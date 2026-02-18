"use server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import {
  hashPassword,
  comparePassword,
  signToken,
  getAuthSession,
} from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { UserData, LogInProps } from "@/types/users";
import Shift from "@/models/Shift";

export async function login(data: LogInProps) {
  try {
    await connectDB();
    const { username, password } = data;

    const user = await User.findOne({ username });
    if (!user || !password) {
      return { error: "Invalid username or password" };
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return { error: "Invalid username or password" };
    }

    let payload = {
      _id: user._id,
      username: user.username,
      role: user.role,
      allowedPages: user.allowedPages,
      fullName: user.fullName,
      shiftId: "",
    };

    if (user.role === "staff") {
      const openShift = await Shift.findOne({ status: "Open" });
      if (!openShift) {
        return { error: "No open shift found" };
      }
      payload = {
        ...payload,
        shiftId: openShift._id,
        role: user.role, // Ensure role is explicitly included/maintained
      };
    }

    const token = await signToken(payload);

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return { success: true, allowedPages: user.allowedPages };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Something went wrong!" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return { success: true };
}

export async function getCurrentUser() {
  const session = await getAuthSession();
  if (!session) return null;
  return JSON.parse(JSON.stringify(session));
}

export async function getUsers() {
  const session = await getAuthSession();
  if (!session) return null;

  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    await connectDB();
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function createUser(data: UserData) {
  try {
    await connectDB();
    const { username, password, allowedPages, role, fullName } = data;

    if (!password) {
      throw new Error("Password is required");
    }
    const hashedPassword = await hashPassword(password);
    await User.create({
      username,
      password: hashedPassword,
      allowedPages,
      role,
      fullName,
    });

    revalidatePath("/management/users");
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Something went wrong!" };
  }
}

export async function updateUser(data: UserData) {
  try {
    await connectDB();
    const { username, password, allowedPages, role, _id, fullName } = data;

    const updateData: UserData = { username, allowedPages, role, fullName };
    if (password) {
      updateData.password = await hashPassword(password);
    }

    await User.findByIdAndUpdate(_id, updateData, { new: true });
    revalidatePath("/management/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Something went wrong!" };
  }
}

export async function deleteUser(id: string) {
  try {
    await connectDB();
    await User.findByIdAndDelete(id);
    revalidatePath("/management/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Something went wrong!" };
  }
}
