import mongoose, { Schema, Document } from "mongoose";

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

export default mongoose.models.Table ||
  mongoose.model<ITable>("Table", TableSchema);
