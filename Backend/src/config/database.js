import mongoose from "mongoose";
import { config } from "./config.js";

const connectToDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB is Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};

export default connectToDB;