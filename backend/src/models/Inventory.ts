import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  productId: mongoose.Types.ObjectId;
  warehouse: string;
  quantity: number;
  reserved: number;
  lastRestocked: Date;
  threshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  reserved: { type: Number, default: 0 },
  lastRestocked: { type: Date, default: Date.now },
  threshold: { type: Number, default: 20 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

InventorySchema.index({ productId: 1 });
export const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);
