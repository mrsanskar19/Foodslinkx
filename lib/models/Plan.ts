import mongoose, { Schema, type Document } from "mongoose"

export interface IPlan extends Document {
  planName: "free" | "basic" | "premium"
  maxTables: number
  maxOrdersPerTable: number
  maxMenuItems: number
  price: number
  trialDays: number
  createdAt: Date
}

const PlanSchema = new Schema<IPlan>(
  {
    planName: { type: String, enum: ["free", "basic", "premium"], required: true, unique: true },
    maxTables: { type: Number, required: true },
    maxOrdersPerTable: { type: Number, required: true },
    maxMenuItems: { type: Number, required: true },
    price: { type: Number, required: true },
    trialDays: { type: Number, default: 5 },
  },
  { timestamps: true },
)

export default mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema)
