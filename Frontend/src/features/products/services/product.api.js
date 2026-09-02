import axios from "axios"

const productInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true
})

export const createProduct = async (formdata) => {
  const response = await productInstance.post("/", formdata)

  return response.data
}

export const getProduct = async () => {
  const response = await productInstance.get("/seller")

  return response.data
}

export const getAllProduct = async () => {
  const response = await productInstance.get("/")

  return response.data
}

export const getProductById = async (productId) => {
  const response = await productInstance.get(`/detail/${productId}`)

  return response.data
}

export const addProductVariant = async (productId, newProductVariant) => {

  const formData = new FormData()

  newProductVariant.images.forEach((image) => {
    formData.append(`images`, image.file)
  })

    formData.append("stock", newProductVariant.stock)
    formData.append("price", newProductVariant.price)
    formData.append("attributes", JSON.stringify(newProductVariant.attributes))

    const response = await productInstance.post(`/${productId}/variants`, formData)
    
    return response.data
}

 