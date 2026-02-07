import { z } from "zod";

export const reservationSchema = z.object({
  _id: z.string().optional(),
  customerName: z
    .string()
    .min(3, "Customer name must be at least 3 characters"),
  customerPhone: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  tableId: z.string().optional(),
  date: z.union([z.date(), z.string()]),
  startTime: z.string(),
  endTime: z.string(),
  partySize: z.coerce.number().min(1, "Party size must be at least 1"),
  status: z
    .enum(["Pending", "Confirmed", "Cancelled", "Completed"])
    .default("Pending"),
  reservedBy: z.enum(["Website", "CallCenter", "WalkIn"]).default("WalkIn"),
  staffId: z.string().optional(),
  menuItems: z
    .array(
      z.object({
        itemId: z.string(),
        quantity: z.number().min(1),
      }),
    )
    .optional(),
  step: z.number().default(1).optional(),
  successData: z.any().optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const createReservationSchema = reservationSchema;
