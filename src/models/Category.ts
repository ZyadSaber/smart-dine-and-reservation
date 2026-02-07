import { Schema, Document } from "mongoose";
import getModel from "./getModal";

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

export default getModel<ICategory>("Category", CategorySchema);
