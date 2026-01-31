"use server";

import connectDB from "@/lib/mongodb";
import Shift from "@/models/Shift";
import { revalidatePath } from "next/cache";

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
