import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  customerName: string;
  customerPhone: string;
  tableId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  partySize: number;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  reservedBy: "Website" | "CallCenter" | "WalkIn";
  staffId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    tableId: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    partySize: { type: Number, required: true },
    staffId: { type: Schema.Types.ObjectId, ref: "User" },
    reservedBy: {
      type: String,
      enum: ["Website", "CallCenter", "WalkIn"],
      default: "Website",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Reservation ||
  mongoose.model<IReservation>("Reservation", ReservationSchema);
