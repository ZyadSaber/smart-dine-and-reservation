"use server";

import connectDB from "@/lib/mongodb";
import Shift from "@/models/Shift";
import { revalidatePath } from "next/cache";
import { IShiftData } from "@/types/shifts";
import Users from "@/models/User";

export async function openShift(staffId: string, openingBalance: number) {
  await connectDB();

  const existingOpenShift = await Shift.findOne({ staffId, status: "Open" });
  if (existingOpenShift) {
    throw new Error("Staff already has an open shift");
  }

  const shift = await Shift.create({
    staffId,
    openingBalance,
    status: "Open",
    startTime: new Date(),
  });

  revalidatePath("/");
  return JSON.parse(JSON.stringify(shift));
}

export async function closeShift(shiftId: string, actualCash: number) {
  await connectDB();

  const shift = await Shift.findById(shiftId);
  if (!shift || shift.status === "Closed") {
    throw new Error("Shift not found or already closed");
  }

  shift.status = "Closed";
  shift.endTime = new Date();
  shift.actualCashAtClose = actualCash;

  await shift.save();

  revalidatePath("/");
  return JSON.parse(JSON.stringify(shift));
}

export async function getShifts() {
  try {
    await connectDB();
    const shifts = await Shift.find({})
      .populate("staffId", "fullName username")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(shifts));
  } catch (error) {
    console.error("Error fetching shifts:", error);
    throw new Error("Failed to fetch shifts");
  }
}

export async function updateShift(id: string, data: Partial<IShiftData>) {
  try {
    await connectDB();
    await Shift.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/management/shifts");
    return { success: true };
  } catch (error) {
    console.error("Error updating shift:", error);
    return { error: "Something went wrong!" };
  }
}

export async function deleteShift(id: string) {
  try {
    await connectDB();
    await Shift.findByIdAndDelete(id);
    revalidatePath("/management/shifts");
    return { success: true };
  } catch (error) {
    console.error("Error deleting shift:", error);
    return { error: "Something went wrong!" };
  }
}

export async function getStaffUsers() {
  try {
    await connectDB();
    const users = await Users.find({ role: "cashier" });
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}
export async function getOpenShifts() {
  try {
    await connectDB();
    const shifts = await Shift.find({ status: "Open" })
      .populate("staffId", "fullName username")
      .sort({ startTime: -1 });

    return JSON.parse(JSON.stringify(shifts));
  } catch (error) {
    console.error("Error fetching open shifts:", error);
    throw new Error("Failed to fetch open shifts");
  }
}
