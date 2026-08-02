"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const Product_1 = require("../models/Product");
const mongoose_1 = __importDefault(require("mongoose"));
const products = [
    {
        name: 'Jack Daniel\'s Old No. 7 Tennessee Whiskey',
        category: 'WHISKEY',
        subCategory: 'Tennessee Whiskey',
        price: 32.99,
        mrp: 35.00,
        discount: 5,
        volume: '750ml',
        abv: 40,
        brand: 'Jack Daniel\'s',
        description: 'Mellowed drop by drop through 10-feet of sugar maple charcoal, then matured in handcrafted barrels of our own making.',
        images: ['https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop'],
        stock: 50,
        tags: ['whiskey', 'tennessee', 'popular'],
    },
    {
        name: 'Grey Goose Vodka',
        category: 'VODKA',
        subCategory: 'Premium Vodka',
        price: 45.99,
        mrp: 50.00,
        discount: 8,
        volume: '750ml',
        abv: 40,
        brand: 'Grey Goose',
        description: 'Crafted from the finest French wheat and water naturally filtered over Grande Champagne limestone.',
        images: ['https://images.unsplash.com/photo-1614316982054-0eb4b74e2cda?q=80&w=600&auto=format&fit=crop'],
        stock: 30,
        tags: ['vodka', 'french', 'premium'],
    },
    {
        name: 'Corona Extra',
        category: 'BEER',
        subCategory: 'Lager',
        price: 18.99,
        mrp: 18.99,
        discount: 0,
        volume: '12-pack, 12oz bottles',
        abv: 4.6,
        brand: 'Corona',
        description: 'A refreshing, smooth-tasting Mexican lager.',
        images: ['https://images.unsplash.com/photo-1605555419356-82088f11b2de?q=80&w=600&auto=format&fit=crop'],
        stock: 100,
        tags: ['beer', 'lager', 'mexican', 'party'],
    },
    {
        name: 'Hendrick\'s Gin',
        category: 'GIN',
        subCategory: 'Botanical Gin',
        price: 42.99,
        mrp: 45.00,
        discount: 4,
        volume: '750ml',
        abv: 41.4,
        brand: 'Hendrick\'s',
        description: 'Curiously infused with rose and cucumber.',
        images: ['https://images.unsplash.com/photo-1598468761271-e092da0253cb?q=80&w=600&auto=format&fit=crop'],
        stock: 25,
        tags: ['gin', 'botanical', 'cucumber'],
    },
    {
        name: 'Schweppes Tonic Water',
        category: 'MIXERS',
        subCategory: 'Tonic',
        price: 6.99,
        mrp: 6.99,
        discount: 0,
        volume: '6-pack, 10oz bottles',
        abv: 0,
        brand: 'Schweppes',
        description: 'The original premium tonic water, perfect for mixing.',
        images: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop'],
        stock: 200,
        tags: ['mixer', 'tonic', 'non-alcoholic'],
    },
    {
        name: 'Lay\'s Classic Potato Chips',
        category: 'SNACKS',
        subCategory: 'Chips',
        price: 4.99,
        mrp: 4.99,
        discount: 0,
        volume: '8oz',
        abv: 0,
        brand: 'Lay\'s',
        description: 'It all starts with farm-grown potatoes, cooked and seasoned to perfection.',
        images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=600&auto=format&fit=crop'],
        stock: 150,
        tags: ['snack', 'chips', 'salty'],
    }
];
async function seed() {
    try {
        console.log('⏳ Connecting to Database...');
        await (0, database_1.connectDB)();
        console.log('🗑️ Clearing existing products...');
        await Product_1.Product.deleteMany({});
        console.log('🌱 Inserting new products...');
        const inserted = await Product_1.Product.insertMany(products);
        console.log(`✅ Successfully seeded ${inserted.length} products!`);
        // Disconnect Mongoose
        await mongoose_1.default.disconnect();
        console.log('👋 Database connection closed.');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}
seed();
