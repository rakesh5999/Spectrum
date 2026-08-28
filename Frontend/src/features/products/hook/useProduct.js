import { setsellerProducts } from "../state/product.slice";
import { createProduct, getProduct } from "../services/product.api";
import { useDispatch } from "react-redux";

export const useProduct = () => {

  const dispatch = useDispatch()

  async function handleCreateProduct(formdata){
    const data = await createProduct(formdata)
    return data.product

  }

  async function handleGetProduct(){
    const data = await getProduct()
    dispatch(setsellerProducts(data.products))
    return data.products
  }

  return {handleCreateProduct, handleGetProduct}

}