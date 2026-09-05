import {param, body, validationResult} from "express-validator"

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();

}

export const addToCartValidator = [
  param("productId").isMongoId().withMessage("Invalid product ID"),
  param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("quantity must be a positive integer"),
  validateRequest
];
