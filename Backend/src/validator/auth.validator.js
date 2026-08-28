import { body , validationResult} from "express-validator";

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();

}

export const validateRegisterUser = [
   body("email")
          .isEmail().withMessage("invalid email format"),
    body("contact")
          .notEmpty().withMessage("contact number is required")
           .matches(/^\d{10}$/).withMessage("contact number must be 10 digits"),
     body("password")
          .isLength({ min: 6 }).withMessage("password must be at least 6 characters long"),
     body("fullname")
          .notEmpty().withMessage("fullname is required")
          .isLength({ min: 3 }).withMessage("fullname must be at least 3 characters long"),
    body("isSeller")
            .isBoolean().withMessage("isSeller must be a boolean value"),
     
          validateRequest
]

export const validateLoginUser = [
    body("email")
          .isEmail().withMessage("invalid email format"),
    body("password")
          .notEmpty().withMessage("password is required"),
          validateRequest
]