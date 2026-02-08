"use server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import MenuItem from "@/models/MenuItem";
import Shift from "@/models/Shift";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import Table from "@/models/Table";

import { CreateOrderData, OrderResponse } from "@/types/pos";
import { getAuthSession } from "@/lib/auth-utils";

export async function getRunningTables() {
  try {
    await connectDB();
    const tables = await Table.find().sort({
      number: 1,
      status: 1,
    });

    return JSON.parse(JSON.stringify(tables));
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw new Error("Failed to fetch tables");
  }
}

export async function getRunningOrders(tableId: string) {
  try {
    await connectDB();
    const order = await Order.findOne({ tableId, isPaid: false });

    console.log(order);

    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

export async function createTableOrder(
  data: CreateOrderData,
): Promise<OrderResponse | { error: string }> {
  await connectDB();
  const session = await mongoose.startSession();
  const currentAuth = await getAuthSession();
  session.startTransaction();

  if (!currentAuth) {
    return { error: "Unauthorized" };
  }

  try {
    // 1. Create the order
    const order = await Order.create(
      [
        {
          shiftId: currentAuth.shiftId,
          staffId: currentAuth._id,
          tableId: data.tableId,
          items: data.items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice,
          })),
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          isPaid: !!data.paymentMethod ? true : false,
          notes: data.notes,
          orderType: "Dine-in",
        },
      ],
      { session },
    );

    // 2. Update shift totals
    const shift = await Shift.findById(currentAuth.shiftId).session(session);
    if (!shift) throw new Error("Shift not found");

    if (data.paymentMethod === "Cash") {
      shift.totalCashSales += data.totalAmount;
    } else if (data.paymentMethod === "Card") {
      shift.totalCardSales += data.totalAmount;
    } else {
      // InstaPay or E-wallet
      shift.totalDigitalSales += data.totalAmount;
    }
    await shift.save({ session });

    // 3. Update table status
    const table = await Table.findById(data.tableId).session(session);
    if (!table) throw new Error("Table not found");
    table.status = "Occupied";
    await table.save({ session });

    await session.commitTransaction();
    revalidatePath("/");
    return JSON.parse(JSON.stringify(order[0]));
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return { error: "Failed to create Order" };
  } finally {
    session.endSession();
  }
}

export async function createOrder(
  data: CreateOrderData,
): Promise<OrderResponse | { error: string }> {
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
    } else if (data.paymentMethod === "Card") {
      shift.totalCardSales += data.totalAmount;
    } else {
      // InstaPay or E-wallet
      shift.totalDigitalSales += data.totalAmount;
    }
    await shift.save({ session });

    await session.commitTransaction();
    revalidatePath("/");
    return JSON.parse(JSON.stringify(order[0]));
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return { error: "Failed to create Order" };
  } finally {
    session.endSession();
  }
}
