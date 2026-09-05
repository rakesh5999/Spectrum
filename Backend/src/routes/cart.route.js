import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { addToCartValidator } from "../validator/cart.validator.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const router = express.Router();


router.post("/add/:productId/:variantId", authenticateUser, addToCartValidator, addToCart)

router.get("/", authenticateUser, getCart)

export default router;