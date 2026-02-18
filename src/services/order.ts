"use server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Shift from "@/models/Shift";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import Table from "@/models/Table";

import { CreateOrderData } from "@/types/pos";
import { getAuthSession } from "@/lib/auth-utils";

export async function getRunningTables() {
  try {
    await connectDB();
    const tables = await Table.find().sort({
      number: 1,
      status: 1,
    });

    const parsedData = JSON.parse(JSON.stringify(tables));

    return {
      allTables: parsedData,
    };
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

export async function closeTable(data: CreateOrderData) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const currentAuth = await getAuthSession();

    if (!currentAuth) {
      return { success: false, error: "Unauthorized" };
    }

    //update order with payment method and isPaid
    await Order.findByIdAndUpdate(
      data._id,
      {
        paymentMethod: data.paymentMethod,
        discount: data.discount,
        isPaid: true,
      },
      {
        session,
      },
    );

    // // 2. Update shift totals
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

    const table = await Table.findById(data.tableId).session(session);
    table.status = "Available";
    await table.save({ session });
    await session.commitTransaction();
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    console.error("Error closing table:", error);
    return { success: false, error: "Failed to close Order" };
  }
}

export async function createOrUpdateTableOrder(
  data: CreateOrderData,
): Promise<{ success: boolean; error?: string }> {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();
  const currentAuth = await getAuthSession();

  if (!currentAuth) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    if (data._id) {
      // update order
      await Order.findByIdAndUpdate(data._id, {
        items: data.items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
        })),
        totalAmount: data.totalAmount,
        discount: data.discount,
        paymentMethod: data.paymentMethod,
        isPaid: !!data.paymentMethod ? true : false,
        notes: data.notes,
      });
    } else {
      await Order.create(
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
            discount: data.discount,
            paymentMethod: data.paymentMethod,
            isPaid: !!data.paymentMethod ? true : false,
            notes: data.notes,
            orderType: "Dine-in",
          },
        ],
        { session },
      );

      // 2. Update table status
      const table = await Table.findById(data.tableId).session(session);
      if (!table) throw new Error("Table not found");
      table.status = "Occupied";
      await table.save({ session });
    }

    await session.commitTransaction();
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return { success: false, error: "Failed to create Order" };
  } finally {
    session.endSession();
  }
}
