import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";


async function sendTokenResponse(user, res, message) {
  const token = jwt.sign({ 
    id: user._id
   },config.JWT_SECRET, { expiresIn: "7d" }); 

   res.cookie("token", token)

   res.status(200).json({
     message,
     success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname
    },
   })

}

export const registerUser = async (req, res) => {
  const {email, contact , fullname , password , isSeller} = req.body;

  try{
    const existingUser = await userModel.findOne({ 
      $or: [{email} , {contact}]
     });

     if(existingUser) {
      return res.status(400).json({ message: "User already exists" });
     }

     const user = new userModel({ email, contact , fullname , password, role: isSeller ? "seller" : "buyer" });

     await sendTokenResponse(user, res, "User registered successfully");

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }


}