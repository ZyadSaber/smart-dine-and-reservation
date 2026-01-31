"use server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, comparePassword, signToken } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function login(data: any) {
  await connectDB();
  const { username, password } = data;

  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Invalid username or password");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid username or password");
  }

  const token = await signToken({
    id: user._id,
    username: user.username,
    role: user.role,
    allowedPages: user.allowedPages,
  });

  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return { success: true, allowedPages: user.allowedPages };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return { success: true };
}

export async function getUsers() {
  await connectDB();
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(users));
}

export async function createUser(data: any) {
  await connectDB();
  const { username, password, allowedPages, role } = data;

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    username,
    password: hashedPassword,
    allowedPages,
    role,
  });

  revalidatePath("/management/users");
  return JSON.parse(JSON.stringify(user));
}

export async function updateUser(id: string, data: any) {
  await connectDB();
  const { username, password, allowedPages, role } = data;

  const updateData: any = { username, allowedPages, role };
  if (password) {
    updateData.password = await hashPassword(password);
  }

  const user = await User.findByIdAndUpdate(id, updateData, { new: true });
  revalidatePath("/management/users");
  return JSON.parse(JSON.stringify(user));
}

export async function deleteUser(id: string) {
  await connectDB();
  await User.findByIdAndDelete(id);
  revalidatePath("/management/users");
  return { success: true };
}
