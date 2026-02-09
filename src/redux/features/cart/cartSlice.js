import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    carts: {},
  },
  reducers: {

    setCarts: (state, action) => {
    state.carts = { ...state.carts, ...action.payload };
  },

    updateCart: (state, action) => {
      const { itemId, quantity, subtotal } = action.payload;
      if (!state.carts?.items) state.carts.items = [];
      const item = state.carts?.items.find(i => i._id === itemId); // ✅ use carts
      if (item) {
        item.quantity = quantity;
        item.subtotal = subtotal;
      }

      // Optional: recalculate totalPrice for the cart
      state.carts.totalPrice = state.carts?.items.reduce((acc, i) => acc + i.subtotal, 0); // ✅ use carts
    },

    removedCartItem: (state, action) => {
      const itemId = action.payload;

      if (!state.carts?.items) state.carts.items = [];

      state.carts.items = state.carts.items.filter(i => i._id !== itemId);

      state.carts.totalPrice = state.carts.items.reduce(
        (acc, i) => acc + (i.subtotal || 0),
        0
      );
    },


  },
});

export const { setCarts, updateCart, removedCartItem } = cartSlice.actions;
export default cartSlice.reducer;
