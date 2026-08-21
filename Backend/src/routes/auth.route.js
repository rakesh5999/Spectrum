import {Router} from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { validateRegisterUser } from "../validator/auth.validator.js";

const router = Router();

router.post("/register", validateRegisterUser, registerUser);

export default router;
