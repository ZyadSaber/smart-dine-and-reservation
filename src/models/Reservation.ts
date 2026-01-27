import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  customerName: string;
  customerPhone: string;
  tableId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  partySize: number;
  status: "Confirmed" | "Cancelled" | "Completed";
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
    status: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Completed"],
      default: "Confirmed",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Reservation ||
  mongoose.model<IReservation>("Reservation", ReservationSchema);
