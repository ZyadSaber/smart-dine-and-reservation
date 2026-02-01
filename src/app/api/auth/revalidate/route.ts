import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken, signToken } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { UserData } from "@/types/users";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload._id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload._id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData: UserData = JSON.parse(JSON.stringify(user));

    // Check if permissions/data have changed
    const permissionsChanged =
      JSON.stringify(payload.allowedPages) !==
      JSON.stringify(userData.allowedPages);
    const fullNameChanged = payload.fullName !== userData.fullName;
    const roleChanged = payload.role !== userData.role;

    if (permissionsChanged || fullNameChanged || roleChanged) {
      // Update token with fresh data but KEEP original expiry
      const newToken = await signToken(userData, payload.exp);

      const response = NextResponse.json({
        success: true,
        user: userData,
        revalidated: true,
      });

      response.cookies.set("auth_token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return response;
    }

    return NextResponse.json({
      success: true,
      user: userData,
      revalidated: false,
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
