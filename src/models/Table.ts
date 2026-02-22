import mongoose, { Schema, Document } from "mongoose";
import getModel from "./getModal";

export interface ITable extends Document {
  number: string;
  capacity: number;
  status: "Available" | "Occupied" | "Reserved";
  reservationId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema: Schema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Reserved"],
      default: "Available",
    },
    reservationId: { type: Schema.Types.ObjectId, ref: "Reservation" },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Table;
}

export default getModel<ITable>("Table", TableSchema);
