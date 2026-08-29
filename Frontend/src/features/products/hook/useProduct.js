import { setsellerProducts, setProducts } from "../state/product.slice";
import { createProduct, getProduct, getAllProduct , getProductById} from "../services/product.api";
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

  async function handleGetAllProduct(){
    const data = await getAllProduct()
    dispatch(setProducts(data.products))
   
  }

  async function handleGetProductById (productId){
     const data = await getProductById(productId)

     return data.product
  }


  return {handleCreateProduct, handleGetProduct, handleGetAllProduct, handleGetProductById}

}