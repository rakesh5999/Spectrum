import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { getallstock } from "../dao/dao.product.js";


export const addToCart = async (req, res) => {

  const { productId, variantId } = req.params;
  const { quantity = 1} = req.body;
  
  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId
  });

  if (!product) {
    return res.status(404).json({ 
      message: "Product not found" ,
      success: false
    });
  }


 const stock = await getallstock(productId, variantId);

  const cart =( await cartModel.findOne({ userId: req.user._id })) || ( await cartModel.create({ userId: req.user._id }));

  const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant.toString() === variantId);

  if(isProductAlreadyInCart){
   const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId).quantity;

    if(quantityInCart + quantity > stock){
      return res.status(400).json({ 
        message: `Cannot add ${quantity} items to cart. Only ${stock - quantityInCart} items left in stock.`,
        success: false
      });
    }

    await cartModel.findOneAndUpdate(
      { userId: req.user._id, "items.product": productId, "items.variant": variantId },
      { $inc: { "items.$.quantity": quantity } },
      { new: true }
    );

    return res.status(200).json({
      message: "Cart upadated successfully",
      success: true
    });

  }

  if(quantity > stock){
    return res.status(400).json({ 
      message: `Only  ${stock} items left in stock.`,
      success: false
    });
  }

  cart.items.push({
    product: productId,
    variant: variantId,
    quantity: quantity,
    price: product.price
  });

  await cart.save();

  return res.status(200).json({
    message: "Product added to cart successfully",
    success: true
  });

}

export const getCart = async (req, res) => {
  const user = req.user;

  let cart = await cartModel.findOne({ userId: user._id }).populate("items.product");

  if(!cart){
    cart = await cartModel.create({ userId: user._id });
  }

  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart
  });
  
}