import mongoose from "mongoose";

const getModel = <T>(name: string, schema: mongoose.Schema<T>) => {
  return mongoose.models[name] || mongoose.model<T>(name, schema);
};

export default getModel;
