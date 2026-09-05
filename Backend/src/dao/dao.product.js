import productModel from "../models/product.model.js";

export const getallstock = async (productId, variantId) => {
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

     const stock = product.variants.find(variant => variant._id.toString() === variantId).stock;

     return stock;

}