import mongoose, { Schema, Document } from "mongoose";
import getModel from "./getModal";

export interface IShift extends Document {
  staffId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  openingBalance: number;
  totalCashSales: number;
  totalCardSales: number;
  totalDigitalSales: number;
  actualCashAtClose?: number;
  status: "Open" | "Closed";
  createdAt: Date;
  updatedAt: Date;
}

const ShiftSchema: Schema = new Schema(
  {
    staffId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    openingBalance: { type: Number, required: true },
    totalCashSales: { type: Number, default: 0 },
    totalCardSales: { type: Number, default: 0 },
    totalDigitalSales: { type: Number, default: 0 },
    actualCashAtClose: { type: Number },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  },
  { timestamps: true },
);

ShiftSchema.index({ staffId: 1, status: 1 });
ShiftSchema.index({ createdAt: -1 });

export default getModel<IShift>("Shift", ShiftSchema);
