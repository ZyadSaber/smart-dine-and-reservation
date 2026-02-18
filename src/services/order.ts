"use server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Shift from "@/models/Shift";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import Table from "@/models/Table";

import { CreateOrderData, OrderItemData } from "@/types/pos";
import { getAuthSession } from "@/lib/auth-utils";
import { TableData } from "@/types/table";
import MenuItem, { IMenuItem } from "@/models/MenuItem";

export async function getRunningTables() {
  try {
    await connectDB();
    const tables = await Table.find().sort({
      number: 1,
      status: 1,
    });

    const parsedData = JSON.parse(JSON.stringify(tables)) as TableData[];

    return {
      allTables: parsedData,
      occupiedTables: parsedData.filter((t) => t.status === "Occupied"),
    };
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw new Error("Failed to fetch tables");
  }
}

export async function getRunningOrders(tableId: string) {
  try {
    await connectDB();
    const order = await Order.findOne({ tableId, isPaid: false }).populate(
      "items.itemId",
    );

    if (!order) return null;

    const orderObj = order.toObject();
    const items = await Promise.all(
      orderObj.items.map(
        async (item: {
          itemId: IMenuItem;
          name?: { en: string; ar: string };
          price?: number;
          totalPrice?: number;
          quantity: number;
        }) => {
          const populatedItem = item.itemId;

          // Try to get name from the item itself (snapshot)
          let name = item.name;

          // If snapshot name is missing or incomplete, try populated data
          if (!name || !name.en || !name.ar) {
            name = populatedItem?.name;
          }

          // Final fallback: fetch manually if still missing (for safety)
          if (!name || !name.en || !name.ar) {
            const manualItem = await MenuItem.findById(item.itemId);
            if (manualItem) {
              name = manualItem.name;
            }
          }

          // Ultimate fallback
          if (!name || !name.en || !name.ar) {
            name = { en: "Unknown Item", ar: "صنف غير معروف" };
          }

          return {
            ...item,
            name,
            itemId: populatedItem?._id?.toString() || item.itemId?.toString(),
            price: item.price || populatedItem?.price || 0,
            totalPrice:
              item.totalPrice ||
              (item.price || populatedItem?.price || 0) * item.quantity,
          };
        },
      ),
    );

    orderObj.items = items;
    return JSON.parse(JSON.stringify(orderObj));
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

    let shiftId = currentAuth.shiftId;

    if (!shiftId) {
      const activeShift = await Shift.findOne({ status: "Open" }).sort({
        startTime: -1,
      });
      if (!activeShift) {
        return {
          success: false,
          error:
            "No active shift found. A shift must be open to close the table.",
        };
      }
      shiftId = activeShift._id.toString();
    }

    //update order with payment method and isPaid
    await Order.findByIdAndUpdate(
      data._id,
      {
        paymentMethod: data.paymentMethod,
        discount: data.discount,
        isPaid: true,
        shiftId: shiftId,
        staffId: currentAuth._id,
      },
      {
        session,
      },
    );

    // // 2. Update shift totals
    const shift = await Shift.findById(shiftId).session(session);
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
    let shiftId = currentAuth.shiftId;

    if (!shiftId) {
      const activeShift = await Shift.findOne({ status: "Open" }).sort({
        startTime: -1,
      });
      if (!activeShift) {
        return {
          success: false,
          error: "No active shift found. A cashier must open a shift first.",
        };
      }
      shiftId = activeShift._id.toString();
    }

    if (data._id) {
      // update order
      await Order.findByIdAndUpdate(data._id, {
        items: data.items.map((item) => ({
          itemId: item.itemId,
          name: item.name,
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
            shiftId: shiftId,
            staffId: currentAuth._id,
            tableId: data.tableId,
            items: data.items.map((item) => ({
              itemId: item.itemId,
              name: item.name,
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

export async function submitCustomerOrder(data: {
  tableId: string;
  items: OrderItemData[];
  notes?: string;
  totalAmount: number;
}) {
  try {
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Find an active shift
      const activeShift = await Shift.findOne({ status: "Open" })
        .sort({ startTime: -1 })
        .session(session);

      if (!activeShift) {
        throw new Error("No active shift found. Please contact staff.");
      }

      // 2. Check if there's already an active order for this table
      const order = await Order.findOne({
        tableId: data.tableId,
        isPaid: false,
      }).session(session);

      if (order) {
        // Merge items into existing order
        data.items.forEach((newItem) => {
          const existingItem = order.items.find(
            (i: { itemId: mongoose.Types.ObjectId }) =>
              i.itemId.toString() === newItem.itemId.toString(),
          );
          if (existingItem) {
            existingItem.quantity += newItem.quantity;
            existingItem.totalPrice += newItem.totalPrice;
          } else {
            order.items.push(newItem);
          }
        });

        order.totalAmount += data.totalAmount;
        if (data.notes) {
          order.notes = order.notes
            ? `${order.notes} | ${data.notes}`
            : data.notes;
        }
        await order.save({ session });
      } else {
        // Create new order
        await Order.create(
          [
            {
              shiftId: activeShift._id,
              staffId: activeShift.staffId,
              tableId: data.tableId,
              items: data.items,
              totalAmount: data.totalAmount,
              status: "Pending",
              orderType: "Dine-in",
              notes: data.notes,
              isPaid: false,
              discount: 0,
            },
          ],
          { session },
        );

        // Update table status
        const table = await Table.findById(data.tableId).session(session);
        if (table) {
          table.status = "Occupied";
          await table.save({ session });
        }
      }

      await session.commitTransaction();
      revalidatePath("/");
      return { success: true };
    } catch (error: unknown) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to submit order";
    console.error("Error submitting customer order:", error);
    return { success: false, error: message };
  }
}
