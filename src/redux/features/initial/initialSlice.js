import { createSlice } from "@reduxjs/toolkit";

const initialSlice = createSlice({
  name: "initial",
  initialState: {
    categories: [],
    category: [],
    countCartItem: 0,
    countWishlistItem: 0,
    subCategory: [],
    hasAddress: false
  },
  reducers: {

    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSubCategory: (state, action) => {
      state.subCategory = action.payload;
    },
    setCountCartItem: (state, action) => {
      state.countCartItem = action.payload;
    },
    setCountWishlistItem: (state, action) => {
      state.countWishlistItem = action.payload;
    },
    increaseWishlistCount: (state) => {
      state.countWishlistItem = Math.max(state.countWishlistItem + 1, 0);
    },
    decreaseWishlistCount: (state) => {
      state.countWishlistItem = Math.max(state.countWishlistItem - 1, 0);
    },
    increaseItemCount: (state) => {
      state.countCartItem = Math.max(state.countCartItem + 1, 0);
    },
    removeOneFromCount: (state) => {
      state.countCartItem = Math.max(state.countCartItem - 1, 0);
    },
    resetCartCount: (state) => {
      state.countCartItem = 0;
    },
    sethasAdrress: (state, action) => {
      state.hasAddress = action.payload; // true or false
    },
  },
});

export const { setCategories, setCategory, setSubCategory, setCountCartItem, setCountWishlistItem, increaseWishlistCount, decreaseWishlistCount, removeOneFromCount, resetCartCount, increaseItemCount, sethasAdrress } = initialSlice.actions;
export default initialSlice.reducer;
