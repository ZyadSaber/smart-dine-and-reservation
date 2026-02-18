import mongoose, { Schema, Document } from "mongoose";
import getModel from "./getModal";
import { PaymentMethod } from "@/types/pos";

export type OrderStatus = "Pending" | "Completed" | "Cancelled";
export type OrderType = "Dine-in" | "Takeaway" | "Delivery";

export interface IOrderItem {
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface IOrder extends Document {
  shiftId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  tableId?: mongoose.Types.ObjectId;
  reservationId?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  discount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  orderType: OrderType;
  notes?: string;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    shiftId: { type: Schema.Types.ObjectId, ref: "Shift", required: true },
    staffId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tableId: { type: Schema.Types.ObjectId, ref: "Table" },
    reservationId: { type: Schema.Types.ObjectId, ref: "Reservation" },
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "InstaPay", "E-wallet", ""],
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    orderType: {
      type: String,
      enum: ["Dine-in", "Takeaway", "Delivery"],
      default: "Dine-in",
    },
    notes: { type: String },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true },
);

OrderSchema.index({ shiftId: 1 });
OrderSchema.index({ staffId: 1 });
OrderSchema.index({ tableId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Order;
}

export default getModel<IOrder>("Order", OrderSchema);
