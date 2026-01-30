import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  name: {
    en: string;
    ar: string;
  };
  role: string;
  salary: number;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema = new Schema(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    role: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Employee ||
  mongoose.model<IEmployee>("Employee", EmployeeSchema);
