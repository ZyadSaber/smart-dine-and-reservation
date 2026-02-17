import { z } from "zod";

export const shiftSchema = z.object({
  _id: z.string().optional(),
  staffId: z.string().min(1, "Staff is required"),
  startTime: z.union([z.date(), z.string()]).optional(),
  endTime: z.union([z.date(), z.string()]).optional(),
  openingBalance: z.number().min(0, "Opening balance must be at least 0"),
  totalCashSales: z.number().min(0).default(0),
  totalVisaSales: z.number().min(0).default(0),
  totalCardSales: z.number().min(0).default(0),
  totalDigitalSales: z.number().min(0).default(0),
  actualCashAtClose: z.number().min(0).optional(),
  status: z.enum(["Open", "Closed"]),
});

export type ShiftInput = z.infer<typeof shiftSchema>;
