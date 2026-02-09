import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    isLoading: false,
    cartLoader: false

  },
  reducers: {

    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setCartLoader: (state, action) => {
      state.cartLoader = action.payload;   // ✅ CORRECT
    }

  },
});

export const { startLoading, stopLoading, setIsLoading, setCartLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
