import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name:"product",
  initialState:{
    sellerProduct: []
  },

  reducers:{
    setsellerProduct: (state, action) =>{
      state.sellerProduct = action.payload
    }
  }
})

export const {setsellerProduct} = productSlice.actions
export default productSlice.reducer