import mongoose, { Schema, type Document } from "mongoose"

export interface IOrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  customization?: string
}

export interface IOrder extends Document {
  hotelId: string
  table: string
  deviceId: string
  items: IOrderItem[]
  total: number
  status: "pending" | "cooking" | "served" | "paid"
  location?: {
    lat: number
    lon: number
    accuracy: number
    verified: boolean
    note?: string
  }
  requiresReview?: boolean
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    hotelId: { type: String, required: true, index: true },
    table: { type: String, required: true },
    deviceId: { type: String, required: true, index: true },
    items: [
      {
        menuItemId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        customization: { type: String, default: "" },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "cooking", "served", "paid"],
      default: "pending",
    },
    location: {
      lat: { type: Number },
      lon: { type: Number },
      accuracy: { type: Number },
      verified: { type: Boolean, default: false },
      note: { type: String },
    },
    requiresReview: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
