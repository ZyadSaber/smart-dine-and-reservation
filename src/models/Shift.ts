import mongoose, { Schema, Document } from "mongoose";

export interface IShift extends Document {
  staffId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  openingBalance: number;
  totalCashSales: number;
  totalVisaSales: number;
  actualCashAtClose?: number;
  status: "Open" | "Closed";
  createdAt: Date;
  updatedAt: Date;
}

const ShiftSchema: Schema = new Schema(
  {
    staffId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    openingBalance: { type: Number, required: true },
    totalCashSales: { type: Number, default: 0 },
    totalVisaSales: { type: Number, default: 0 },
    actualCashAtClose: { type: Number },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  },
  { timestamps: true },
);

export default mongoose.models.Shift ||
  mongoose.model<IShift>("Shift", ShiftSchema);
