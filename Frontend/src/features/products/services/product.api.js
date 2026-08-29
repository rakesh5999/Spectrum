import axios from "axios"

const productInstance = axios.create({
  baseURL:"/api/products",
  withCredentials: true
})

export const createProduct =async (formdata) =>{
  const response = await productInstance.post("/", formdata)

  return response.data
}

export const getProduct = async () =>{
  const response = await productInstance.get("/seller")

  return response.data
}

export const getAllProduct = async () =>{
  const response = await productInstance.get("/")

  return response.data
}

export const getProductById = async (productId) => {
  const response = await productInstance.get(`/detail/${productId}`)

  return response.data
}