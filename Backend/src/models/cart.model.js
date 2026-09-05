import mongoose from "mongoose";
import priceSchema from "./price.model.js";

const cartSchema = new mongoose.Schema(
  {
    userId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: true
       },
       items:[
        {
          product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        variant:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "product.variants",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price:{
          type: priceSchema,
          required: true
        }
      }
       ]
      
  })

  const cartModel = mongoose.model("Cart", cartSchema);

  export default cartModel;