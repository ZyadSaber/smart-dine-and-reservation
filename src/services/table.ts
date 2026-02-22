"use server";

import connectDB from "@/lib/mongodb";
import Table from "@/models/Table";
import { revalidatePath } from "next/cache";
import { TableData } from "@/types/table";

export async function getTables() {
  try {
    await connectDB();
    const tables = await Table.find({}).sort({ number: 1 });
    return JSON.parse(JSON.stringify(tables));
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw new Error("Failed to fetch tables");
  }
}

export async function getTable(id: string) {
  try {
    await connectDB();
    const table = await Table.findById(id);
    return JSON.parse(JSON.stringify(table));
  } catch (error) {
    console.error("Error fetching table:", error);
    return null;
  }
}

export async function createTable(data: TableData) {
  try {
    await connectDB();
    const { number, capacity, status } = data;

    await Table.create({
      number,
      capacity,
      status,
    });

    revalidatePath("/management/tables");
    return { success: true };
  } catch (error) {
    console.error("Error creating table:", error);
    return { error: "Something went wrong!" };
  }
}

export async function updateTable(
  data: Omit<TableData, "reservationId"> & { reservationId?: string | null },
) {
  try {
    await connectDB();
    const { _id, number, capacity, status, reservationId } = data;

    const updateData: Record<string, unknown> = { number, capacity, status };
    if (reservationId !== undefined) {
      updateData.reservationId = reservationId;
    }

    if (reservationId === null) {
      updateData.$unset = { reservationId: "" };
      delete updateData.reservationId;
    }

    await Table.findByIdAndUpdate(_id, updateData, { new: true });
    revalidatePath("/management/tables");
    revalidatePath("/management/pos");
    revalidatePath("/ar/management/pos");
    revalidatePath("/en/management/pos");
    return { success: true };
  } catch (error) {
    console.error("Error updating table:", error);
    return { error: "Something went wrong!" };
  }
}

export async function deleteTable(id: string) {
  try {
    await connectDB();
    await Table.findByIdAndDelete(id);
    revalidatePath("/management/tables");
    return { success: true };
  } catch (error) {
    console.error("Error deleting table:", error);
    return { error: "Something went wrong!" };
  }
}
