import { z } from "zod";

export const menuSchema = z.object({
  _id: z.string().optional(),
  name: z.object({
    en: z.string().min(3, "Name must be at least 3 characters"),
    ar: z.string().min(3, "Name must be at least 3 characters"),
  }),
  description: z.object({
    en: z.string().min(3, "Description must be at least 3 characters"),
    ar: z.string().min(3, "Description must be at least 3 characters"),
  }),
  price: z.number().min(0, "Price must be at least 0"),
  category: z.union([
    z.string().min(3, "Category must be at least 3 characters"),
    z.object({ _id: z.string() }),
  ]),
  isAvailable: z.boolean(),
});

export type MenuItemInput = z.infer<typeof menuSchema>;
export const categorySchema = z.object({
  _id: z.string().optional(),
  name: z.object({
    en: z.string().min(3, "Name must be at least 3 characters"),
    ar: z.string().min(3, "Name must be at least 3 characters"),
  }),
});

export type CategoryInput = z.infer<typeof categorySchema>;
