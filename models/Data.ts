import mongoose from "mongoose";

export interface VisitorCount {
  count: number;
}

export const VisitorCountSchema = new mongoose.Schema<VisitorCount>({
  count: { type: Number, required: true },
});

export default mongoose.models.Data || mongoose.model("Data", VisitorCountSchema);