import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: {
    en: string;
    ar: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
  },
  { timestamps: true },
);

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
