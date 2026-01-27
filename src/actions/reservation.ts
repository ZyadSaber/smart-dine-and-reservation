"use server";

import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import Table from "@/models/Table";
import { revalidatePath } from "next/cache";

export async function createReservation(data: {
  customerName: string;
  customerPhone: string;
  partySize: number;
  startTime: Date;
}) {
  await connectDB();

  // Find an available table with sufficient capacity
  const table = await Table.findOne({
    capacity: { $gte: data.partySize },
    status: "Available",
  });

  if (!table) {
    throw new Error("No tables available for this party size");
  }

  // Create the reservation
  const reservation = await Reservation.create({
    ...data,
    tableId: table._id,
    endTime: new Date(data.startTime.getTime() + 2 * 60 * 60 * 1000), // Default 2 hours
    status: "Confirmed",
  });

  // Mark table as reserved (ideally this should be linked to time slots, but for now simple)
  // table.status = 'Reserved';
  // await table.save();

  revalidatePath("/pos");
  revalidatePath("/reservations");

  return {
    success: true,
    reservationId: reservation._id.toString(),
    customerName: reservation.customerName,
    qrData: JSON.stringify({
      id: reservation._id,
      name: reservation.customerName,
      phone: reservation.customerPhone,
      guests: data.partySize,
      time: data.startTime,
    }),
  };
}
