import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";


async function sendTokenResponse(user, res, message) {
  const token = jwt.sign({
    id: user._id
  }, config.JWT_SECRET, { expiresIn: "7d" });

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
  const { email, contact, fullname, password, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await userModel.create({ email, contact, fullname, password, role: isSeller ? "seller" : "buyer" });

    await sendTokenResponse(user, res, "User registered successfully");

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }


}

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    await sendTokenResponse(user, res, "User logged in successfully");

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const googleAuthCallback = async (req, res) => {

  const { id, emails, displayName, photos } = req.user;

  const email = emails[0].value;
  const ProfilePic = photos[0].value;

  let user = await userModel.findOne({ email });

  if (!user) {
    const user = await userModel.create({
      email,
      googleId: id,
      fullname: displayName,
    })
  }


  const token = jwt.sign({
    id: user._id
  }, config.JWT_SECRET, {
    expiresIn: "7d"
  })

  res.cookie("token", token)

  res.redirect("http://localhost:5173/")
}