import express from "express";
import { authenticateSeller, authenticateUser } from "../middleware/auth.middleware.js";
import { addProductVariants, createProduct, getAllProduct, getProductDetails, getSellerProduct } from "../controllers/product.controller.js";
import multer from "multer"
import { createProductValidator } from "../validator/product.validator.js";


const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

const router = express.Router();



router.post("/", authenticateSeller, upload.array('images', 7), createProductValidator, createProduct)


router.get("/seller", authenticateSeller, getSellerProduct)

router.get("/", getAllProduct)

router.get("/detail/:id", getProductDetails)

router.post("/:productId/variants", authenticateSeller, upload.array('images', 7), addProductVariants)

export default router;