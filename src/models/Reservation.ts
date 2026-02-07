import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  customerName: string;
  customerPhone: string;
  tableId: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  partySize: number;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  reservedBy: "Website" | "CallCenter" | "WalkIn";
  staffId: mongoose.Types.ObjectId;
  menuItems: { itemId: mongoose.Types.ObjectId; quantity: number }[];
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    tableId: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
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
    menuItems: [
      {
        itemId: { type: Schema.Types.ObjectId, ref: "MenuItem" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true },
);

// In development, the model might already be registered in the global scope.
// We delete it to ensure schema changes (like fullName) are correctly applied.
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Reservation;
}

export default mongoose.models.Reservation ||
  mongoose.model<IReservation>("Reservation", ReservationSchema);
