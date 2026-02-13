"use server";

import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import Table from "@/models/Table";
import { revalidatePath } from "next/cache";
import { ReservationData } from "@/types/reservation";

export async function createReservation(data: {
  customerName: string;
  customerPhone: string;
  partySize: number;
  date: Date;
  startTime: string;
  menuItems?: { itemId: string; quantity: number }[];
}) {
  await connectDB();

  // Calculate default endTime (e.g., +2 hours)
  const [startHour, startMinute] = data.startTime.split(":").map(Number);
  const endHour = (startHour + 2) % 24;
  const endTimeStr = `${endHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;

  // Create the reservation
  const reservation = await Reservation.create({
    ...data,
    endTime: endTimeStr,
    status: "Pending",
  });

  revalidatePath("/pos");
  revalidatePath("/management/reservations");

  return {
    success: true,
    reservationId: reservation._id.toString(),
    customerName: reservation.customerName,
    qrData: JSON.stringify({
      id: reservation._id,
      name: reservation.customerName,
      phone: reservation.customerPhone,
      guests: data.partySize,
      date: data.date,
      time: data.startTime,
    }),
  };
}

export async function getReservations() {
  try {
    await connectDB();
    const reservations = await Reservation.find().sort({
      date: -1,
      startTime: -1,
    });
    return JSON.parse(JSON.stringify(reservations));
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw new Error("Failed to fetch reservations");
  }
}

export async function createReservationAdmin(data: ReservationData) {
  try {
    await connectDB();
    const {
      customerName,
      customerPhone,
      partySize,
      date,
      startTime,
      endTime,
      status,
      reservedBy,
      tableId,
    } = data;

    let assignedTableId = tableId;

    if (!assignedTableId) {
      // Auto-assign logic if no table selected
      const table = await Table.findOne({
        capacity: { $gte: partySize },
        status: "Available",
      });
      if (!table) {
        throw new Error("No tables available for this party size");
      }
      assignedTableId = table._id;
    }

    await Reservation.create({
      customerName,
      customerPhone,
      partySize,
      date: new Date(date),
      startTime,
      endTime,
      status,
      reservedBy,
      tableId: assignedTableId,
    });

    revalidatePath("/management/reservations");
    return { success: true };
  } catch (error) {
    console.error("Error creating reservation:", error);
    return {
      error: error instanceof Error ? error.message : "Something went wrong!",
    };
  }
}

export async function updateReservation(data: ReservationData) {
  try {
    await connectDB();
    const {
      _id,
      customerName,
      customerPhone,
      partySize,
      date,
      startTime,
      endTime,
      status,
      reservedBy,
      tableId,
    } = data;

    await Reservation.findByIdAndUpdate(_id, {
      customerName,
      customerPhone,
      partySize,
      date: new Date(date),
      startTime,
      endTime,
      status,
      reservedBy,
      tableId,
    });

    revalidatePath("/management/reservations");
    return { success: true };
  } catch (error) {
    console.error("Error updating reservation:", error);
    return { error: "Something went wrong!" };
  }
}

export async function deleteReservation(id: string) {
  try {
    await connectDB();
    await Reservation.findByIdAndDelete(id);
    revalidatePath("/management/reservations");
    return { success: true };
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return { error: "Something went wrong!" };
  }
}
