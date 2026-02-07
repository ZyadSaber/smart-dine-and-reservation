import { Schema, Document } from "mongoose";
import getModel from "./getModal";

export interface ITable extends Document {
  number: string;
  capacity: number;
  status: "Available" | "Occupied" | "Reserved";
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
  },
  { timestamps: true },
);

export default getModel<ITable>("Table", TableSchema);
