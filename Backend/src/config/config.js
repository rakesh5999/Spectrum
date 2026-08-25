import dotenv from "dotenv";
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment varibles")
  }

if (!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment varibles")
  }
  
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not defined in environment varibles")
  }

if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment varibles")
  }
  if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined in environment varibles")
  }

export const config = {
  MONGO_URI : process.env.MONGO_URI?.trim(),
  JWT_SECRET : process.env.JWT_SECRET?.trim(),
  GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID?.trim(),
  GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET?.trim(),
  NODE_ENV : process.env.NODE_ENV?.trim() || "development",
  IMAGEKIT_PRIVATE_KEY : process.env.IMAGEKIT_PRIVATE_KEY?.trim()
}

