import mongoose, { Schema, type Document } from "mongoose"

export interface IFeedback extends Document {
  hotelId: string
  table: string
  rating: number
  message: string
  createdAt: Date
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    hotelId: { type: String, required: true },
    table: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, default: "" },
  },
  { timestamps: true },
)

export default mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema)
