import axios from "axios"

const cartInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true
})

export const addItemCart = async ({productId, variantId}) => {

  const response = await cartInstance.post(`/add/${productId}/${variantId}`,{
    quantity: 1
  })

  return response.data
}