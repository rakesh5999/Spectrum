import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name:"product",
  initialState:{
    sellerProducts: [],
    products: []
  },

  reducers:{
    setsellerProducts: (state, action) =>{
      state.sellerProducts = action.payload
    },
    setProducts: (state, action) =>{
      state.products = action.payload
    }
  }
})

export const {setsellerProducts, setProducts} = productSlice.actions
export default productSlice.reducer