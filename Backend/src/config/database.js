import mongoose from "mongoose";
import { config } from "./config.js";

const connectToDB = async () =>{
   await mongoose.connect(config.MONGO_URI)
  console.log("MongooDB is Connected");
  
}

export default connectToDB