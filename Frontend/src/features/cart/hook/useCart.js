import {addItemCart} from "../services/cart.api"
import {useDispatch} from "react-redux"
import {addItem} from "../state/cart.slice"

export const useCart = () => {
  const dispatch = useDispatch()

  
  const handleAddItem = async ({productId, variantId}) => {

    const data = await addItemCart({productId, variantId})

    return data
  }

  return {handleAddItem}


}