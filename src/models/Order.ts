import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  itemId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  shiftId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  tableId?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: "Cash" | "Visa";
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    shiftId: { type: Schema.Types.ObjectId, ref: "Shift", required: true },
    staffId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    tableId: { type: Schema.Types.ObjectId, ref: "Table" },
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Cash", "Visa"], default: "Cash" },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
