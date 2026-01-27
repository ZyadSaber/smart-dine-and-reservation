"use server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import MenuItem from "@/models/MenuItem";
import Shift from "@/models/Shift";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function createOrder(data: {
  shiftId: string;
  staffId: string;
  tableId?: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: "Cash" | "Visa";
}) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Create the order
    const order = await Order.create([data], { session });

    // 2. Update stock for each item
    for (const item of data.items) {
      const menuItem = await MenuItem.findById(item.itemId).session(session);
      if (!menuItem) throw new Error(`Item ${item.name} not found`);

      if (menuItem.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }

      menuItem.quantity -= item.quantity;
      await menuItem.save({ session });
    }

    // 3. Update shift totals
    const shift = await Shift.findById(data.shiftId).session(session);
    if (!shift) throw new Error("Shift not found");

    if (data.paymentMethod === "Cash") {
      shift.totalCashSales += data.totalAmount;
    } else {
      shift.totalVisaSales += data.totalAmount;
    }
    await shift.save({ session });

    await session.commitTransaction();
    revalidatePath("/");
    return JSON.parse(JSON.stringify(order[0]));
  } catch (error: any) {
    await session.abortTransaction();
    throw new Error(error.message || "Failed to create order");
  } finally {
    session.endSession();
  }
}
