import { z } from "zod";

export const userSchema = z.object({
  _id: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().optional().or(z.literal("")),
  role: z.enum(["admin", "staff", "manager"]),
  allowedPages: z.array(z.string()),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
});

export type UserInput = z.infer<typeof userSchema>;

export const createUserSchema = userSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});
