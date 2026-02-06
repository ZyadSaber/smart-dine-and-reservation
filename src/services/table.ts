"use server";

import connectDB from "@/lib/mongodb";
import Table from "@/models/Table";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/auth-utils";
import { TableData } from "@/types/table";

export async function getTables() {
  const session = await getAuthSession();
  if (!session) return null;

  try {
    await connectDB();
    const tables = await Table.find({}).sort({ number: 1 });
    return JSON.parse(JSON.stringify(tables));
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw new Error("Failed to fetch tables");
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

export async function updateTable(data: TableData) {
  try {
    await connectDB();
    const { _id, number, capacity, status } = data;

    await Table.findByIdAndUpdate(
      _id,
      { number, capacity, status },
      { new: true },
    );
    revalidatePath("/management/tables");
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
