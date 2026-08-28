import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name:"product",
  initialState:{
    sellerProducts: []
  },

  reducers:{
    setsellerProducts: (state, action) =>{
      state.sellerProducts = action.payload
    }
  }
})

export const {setsellerProducts} = productSlice.actions
export default productSlice.reducer