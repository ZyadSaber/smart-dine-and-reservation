import { z } from "zod";

export const tableSchema = z.object({
  _id: z.string().optional(),
  number: z.string().min(1, "Table number is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  status: z.enum(["Available", "Occupied", "Reserved"]),
});

export type TableInput = z.infer<typeof tableSchema>;
