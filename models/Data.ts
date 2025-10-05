import mongoose from "mongoose";

export interface VisitorCount {
  count: { type: number; default: 0 };
  clicks: { type: number; default: 0 };
}

export const VisitorCountSchema = new mongoose.Schema<VisitorCount>({
  count: { type: Number, required: true },
});

export default mongoose.models.Data ||
  mongoose.model("Data", VisitorCountSchema);
