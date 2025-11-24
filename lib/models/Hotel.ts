import mongoose, { Schema, type Document } from "mongoose"

export interface IHotel extends Document {
  name: string
  address: string
  latitude: number
  longitude: number
  upiId: string
  verified: boolean
  plan: "free" | "basic" | "premium"
  planExpiry: Date
  maxTables: number
  maxOrdersPerTable: number
  locationVerificationRadius: number
  menu: Array<{
    _id: string
    name: string
    description: string
    price: number
    category: string
    available: boolean
    image?: string
  }>
  createdAt: Date
}

const HotelSchema = new Schema<IHotel>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    upiId: { type: String, required: true },
    verified: { type: Boolean, default: false },
    plan: { type: String, enum: ["free", "basic", "premium"], default: "free" },
    planExpiry: { type: Date, default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
    maxTables: { type: Number, default: 10 },
    maxOrdersPerTable: { type: Number, default: 5 },
    locationVerificationRadius: { type: Number, default: 500 },
    menu: [
      {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        available: { type: Boolean, default: true },
        image: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.models.Hotel || mongoose.model<IHotel>("Hotel", HotelSchema)
