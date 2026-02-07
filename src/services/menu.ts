"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/auth-utils";
import connectDB from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import Category from "@/models/Category";
import { MenuItemInput, CategoryInput } from "@/validations/menu";
import { MenuManagementItem, CategoryItem } from "@/types/menu";

export async function getItems() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    await connectDB();
    const rawItems = await MenuItem.find().populate("category").lean();
    return JSON.parse(JSON.stringify(rawItems)) as MenuManagementItem[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [] as MenuManagementItem[];
  }
}

export async function createItem(data: MenuItemInput) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await connectDB();
    const categoryId =
      typeof data.category === "string" ? data.category : data.category._id;

    await MenuItem.create({ ...data, category: categoryId });
    revalidatePath("/[locale]/management/menu");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error creating item:", error);
    return { error: "Failed to create item" };
  }
}

export async function updateItem(data: MenuItemInput) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await connectDB();
    const categoryId =
      typeof data.category === "string" ? data.category : data.category._id;

    await MenuItem.findByIdAndUpdate(data._id, {
      ...data,
      category: categoryId,
    });
    revalidatePath("/[locale]/management/menu");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating item:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update item";
    return { error: message };
  }
}

export async function deleteItem(id: string) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await connectDB();
    await MenuItem.findByIdAndDelete(id);
    revalidatePath("/[locale]/management/menu");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting item:", error);
    return { error: "Failed to delete item" };
  }
}

// Category Services

import { getLocale } from "next-intl/server";

export async function getCategories() {
  try {
    const locale = await getLocale();
    await connectDB();
    const rawCategories = await Category.find().lean();
    const resolvedData = JSON.parse(
      JSON.stringify(rawCategories),
    ) as CategoryItem[];

    const categoriesList = resolvedData.map((category) => ({
      key: category._id,
      label: locale === "ar" ? category.name.ar : category.name.en,
      value: category._id, // Adding value as common prop for Select
    }));

    return {
      categories: resolvedData,
      categoriesList,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      categories: [] as CategoryItem[],
      categoriesList: [],
    };
  }
}

export async function createCategory(data: CategoryInput) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await connectDB();
    await Category.create(data);
    revalidatePath("/[locale]/management/menu");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error creating category:", error);
    return { error: "Failed to create category" };
  }
}

export async function bulkCreateCategories(data: CategoryInput[]) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await connectDB();
    await Category.insertMany(data);
    revalidatePath("/[locale]/management/menu");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error creating categories:", error);
    return { error: "Failed to create categories" };
  }
}

export async function updateCategory(data: CategoryInput) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await connectDB();
    await Category.findByIdAndUpdate(data._id, data);
    revalidatePath("/[locale]/management/menu");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating category:", error);
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await connectDB();
    // Check if any items use this category?
    const items = await MenuItem.countDocuments({ category: id });
    if (items > 0) {
      return {
        error: "Cannot delete category. There are items assigned to it.",
      };
    }

    await Category.findByIdAndDelete(id);
    revalidatePath("/[locale]/management/menu");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting category:", error);
    return { error: "Failed to delete category" };
  }
}
