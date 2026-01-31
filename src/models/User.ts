import mongoose, { Schema, Document } from "mongoose";
import { UserData } from "@/types/users";

export interface IUser extends Document, Omit<UserData, "_id"> {
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    allowedPages: [{ type: String }],
    role: { type: String, default: "staff" },
    fullName: { type: String, required: true },
  },
  { timestamps: true },
);

// In development, the model might already be registered in the global scope.
// We delete it to ensure schema changes (like fullName) are correctly applied.
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.User;
}

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
