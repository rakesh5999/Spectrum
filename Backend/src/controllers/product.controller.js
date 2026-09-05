import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


export async function createProduct(req, res) {

  const { title, description, priceAmount, priceCurrency } = req.body;
  const seller = req.user;

  const images = await Promise.all(req.files.map(async (file) => {
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



export async function getSellerProduct(req, res) {
  const seller = req.user

  const products = await productModel.find({ seller: seller._id })

  res.status(200).json({
    message: " product fetched succesfully",
    success: true,
    products
  })
}

export async function getAllProduct(req, res) {
  const products = await productModel.find()

  res.status(200).json({
    message: "Products feteched successfully",
    success: true,
    products
  })
}

export async function getProductDetails(req, res) {
  const { id } = req.params

  const product = await productModel.findById(id)

  if (!product) {
    return res.status(404).json({
      message: "product not found ",
      success: false
    })
  }

  res.status(200).json({
    message: "product details fetched succesfully",
    success: true,
    product
  })
}

export async function addProductVariants(req, res) {

  const productId = req.params.productId

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user._id
  })

  if (!product) {
    return res.status(404).json({
      message: "product not found",
      success: false
    })
  }

  const files = req.files || []
  const images = await Promise.all(files.map(async (file) => {
    return await uploadFile({
      buffer: file.buffer,
      fileName: file.originalname
    })
  }))

  const price = req.body.price || req.body.priceAmount
  const stock = req.body.stock || 0
  const attributes = JSON.parse(req.body.attributes || "{}")

  product.variants.push({
    images,
    price:{
      amount: Number(price) || product.price.amount,
      currency: req.body.priceCurrency || product.price.currency
    },
    stock,
    attributes
  })

  await product.save()

  return res.status(200).json({
    message: " Product variant added successfully",
    success: true,
    product
  })

}