import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User";
import dns from "dns";

if (typeof window === "undefined") {
  dns.setDefaultResultOrder("ipv4first");
  // Fix for local DNS issues with MongoDB Atlas SRV records
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (e) {
    console.warn("Failed to set DNS servers, using system defaults", e);
  }
}

// Bun automatically loads .env files

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
  process.exit(1);
}

async function createTestUser() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    const username = "test";
    const password = "test";
    const hashedPassword = await bcrypt.hash(password, 10);

    const allowedPages = [
      "/management/dashboard",
      "/management/pos",
      "/management/inventory",
      "/management/reservations",
      "/management/users",
      "/management/reports",
      "/management/settings",
    ];

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log(
        "User 'test' already exists. Updating password and permissions...",
      );
      existingUser.password = hashedPassword;
      existingUser.allowedPages = allowedPages;
      existingUser.role = "admin"; // Setting to admin just in case
      await existingUser.save();
      console.log("User 'test' updated successfully.");
    } else {
      const newUser = new User({
        username,
        password: hashedPassword,
        allowedPages,
        role: "admin",
      });
      await newUser.save();
      console.log("User 'test' created successfully.");
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error creating test user:", error);
    process.exit(1);
  }
}

createTestUser();
