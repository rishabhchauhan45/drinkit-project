"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiSeederService = void 0;
const Product_1 = require("../models/Product");
const database_1 = require("../config/database");
// Helper to safely parse AI JSON responses
const cleanJsonResponse = (text) => {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '');
    }
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '');
    }
    if (cleaned.endsWith('```')) {
        cleaned = cleaned.replace(/```$/, '');
    }
    return JSON.parse(cleaned.trim());
};
exports.aiSeederService = {
    async generateProducts() {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `
    Act as an e-commerce catalog expert for a beverage store.
    Return a strictly formatted JSON array of exactly 10 realistic beverage/drink products.
    Each product object MUST have the following fields:
    - name: string (e.g. "Royal Challenge Premium")
    - description: string (catchy, 1-2 sentences)
    - price: number (realistic INR price between 200 and 5000)
    - category: string (MUST be one of: 'WHISKEY', 'VODKA', 'RUM', 'GIN', 'WINE', 'BEER', 'SNACKS', 'MIXERS')
    - stock: number (random between 10 and 100)
    - imageUrl: string (use a realistic unsplash placeholder URL for beverages, e.g. "https://images.unsplash.com/photo-...&w=400&q=80")
    - brand: string (e.g. "Royal Challenge", "Smirnoff")
    
    Do NOT return any other text, markdown formatting, or explanation. ONLY the JSON array.
    `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const responseText = response.text || '[]';
        return cleanJsonResponse(responseText);
    },
    async seedData() {
        // 1. Generate Products
        const generatedProducts = await this.generateProducts();
        // 2. Insert into MongoDB
        const savedProducts = [];
        for (const p of generatedProducts) {
            const product = new Product_1.Product({
                name: p.name,
                description: p.description,
                price: p.price,
                category: p.category,
                stock: p.stock,
                brand: p.brand,
                images: [p.imageUrl],
                isActive: true,
            });
            await product.save();
            savedProducts.push(product);
        }
        // 3. Generate Mock Orders (PostgreSQL)
        // Find existing users
        let users = await database_1.prisma.user.findMany({ select: { id: true } });
        if (users.length === 0) {
            // Create a dummy user if none exists
            const dummyUser = await database_1.prisma.user.create({
                data: {
                    email: 'dummy_ai@example.com',
                    phone: '9999999999',
                    name: 'AI Generated User',
                    age: 21,
                    password: 'hashedpassword',
                    role: 'USER',
                }
            });
            users = [dummyUser];
        }
        let ordersCreated = 0;
        // Create 5 random orders
        for (let i = 0; i < 5; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            // Pick 1-3 random products for the order
            const numProducts = Math.floor(Math.random() * 3) + 1;
            const orderProducts = [];
            let totalAmount = 0;
            for (let j = 0; j < numProducts; j++) {
                const randomProduct = savedProducts[Math.floor(Math.random() * savedProducts.length)];
                const quantity = Math.floor(Math.random() * 2) + 1;
                orderProducts.push({
                    productId: randomProduct._id,
                    name: randomProduct.name,
                    price: randomProduct.price,
                    quantity,
                    image: randomProduct.images[0]
                });
                totalAmount += randomProduct.price * quantity;
            }
            const deliveryFee = totalAmount > 500 ? 0 : 40;
            const tax = totalAmount * 0.18;
            const orderTotal = totalAmount + deliveryFee + tax;
            // Random date within the last 30 days
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30));
            const statuses = ['DELIVERED', 'PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            await database_1.prisma.order.create({
                data: {
                    userId: randomUser.id,
                    products: orderProducts,
                    totalAmount: orderTotal,
                    deliveryFee,
                    tax,
                    status,
                    paymentStatus: status === 'DELIVERED' ? 'PAID' : 'PENDING',
                    createdAt: pastDate,
                    updatedAt: pastDate
                }
            });
            ordersCreated++;
        }
        return {
            productsSeeded: savedProducts.length,
            ordersSeeded: ordersCreated
        };
    }
};
