import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from "./env.js";

export async function connectDB() {
  if (!MONGO_URI) throw new Error("MONGO_URI not set");

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(`${MONGO_URI}`);
    console.log(`[db] connected env=${NODE_ENV}`);
  } catch (error) {
    console.error("[db] connection failed:", error?.message || error);
    throw error;
  }
}

export default connectDB;
