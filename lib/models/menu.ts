import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IMenu extends Document {
  name: string;
  price: number;
  category: mongoose.Types.ObjectId;
  description?: string;
  imageUrl?: string;
  imageFileUrl?: string;
  linkTarget?: string;
  hotelId: string;
  available: boolean;
  deleted_at?: Date;
}

const MenuSchema = new Schema<IMenu>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  imageUrl: { type: String },
  imageFileUrl: { type: String },
  linkTarget: { type: String },
  hotelId: { type: String, required: true },
  available: { type: Boolean, default: true },
  deleted_at: { type: Date },
});

// ✅ Use existing model if it’s already compiled (fixes OverwriteModelError)
const Menu = models.Menu || model<IMenu>('Menu', MenuSchema);

export default Menu;
