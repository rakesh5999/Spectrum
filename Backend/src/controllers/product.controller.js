import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


export async function createProduct(req, res) {

  const { title, description, priceAmount, priceCurrency } = req.body;
  const seller = req.user;

  const images = await Promise.all(req.files.map (async (file) =>{
    return await uploadFile({
      buffer: file.buffer,
      fileName: file.originalname
    })
  }))


  const product = await productModel.create({
    title,
    description,
    price: {
      amount: priceAmount,
      currency: priceCurrency || "INR"
    },
    images,
    seller: seller._id
  })

  res.status(201).json({
    message: "Product created succesfully",
    success: true,
    product
  })


}



export async function getSellerProduct(req, res){
   const seller = req.user

   const products = await productModel.find({seller : seller._id})

   res.status(200).json({
    message: " product fetched succesfully",
    success: true,
    products
   })
}

export async function getAllProduct(req, res){
  const products = await productModel.find()

  res.status(200).json({
    message: "Products feteched successfully",
    success : true,
    products
  })
}