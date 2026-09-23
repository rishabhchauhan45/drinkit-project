import { Product } from '../models/Product';
import { prisma } from '../config/database';
import fs from 'fs';
import path from 'path';

export const aiSeederService = {
  async seedData() {
    // 1. Read Hardcoded Real Products
    const dataPath = path.join(__dirname, '../data/real-products.json');
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const generatedProducts = JSON.parse(fileContent);
    
    // 2. Clear Existing Products and Insert into MongoDB
    await Product.deleteMany({});
    
    const savedProducts = [];
    for (const p of generatedProducts) {
      const product = new Product({
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
    let users = await prisma.user.findMany({ select: { id: true } });
    if (users.length === 0) {
      // Create a dummy user if none exists
      const dummyUser = await prisma.user.create({
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
      const status = statuses[Math.floor(Math.random() * statuses.length)] as any;

      await prisma.order.create({
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
