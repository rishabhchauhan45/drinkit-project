import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  subCategory: string;
  price: number;
  mrp: number;
  discount: number;
  volume: string;
  abv: number;
  brand: string;
  description: string;
  images: string[];
  stock: number;
  tags: string[];
  pairings: mongoose.Types.ObjectId[];
  ratings: { average: number; count: number; };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  category: { type: String, enum: ['WHISKEY', 'VODKA', 'RUM', 'GIN', 'WINE', 'BEER', 'SNACKS', 'MIXERS'], required: true },
  subCategory: { type: String },
  price: { type: Number, required: true },
  mrp: { type: Number },
  discount: { type: Number, default: 0 },
  volume: { type: String },
  abv: { type: Number },
  brand: { type: String, required: true },
  description: { type: String },
  images: { type: [String], default: [] },
  stock: { type: Number, required: true, default: 0 },
  tags: { type: [String], default: [] },
  pairings: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  ratings: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
