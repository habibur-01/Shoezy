import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    isLoading: false,
    message: "", // optional: useful for showing "Logging in..." / "Fetching products..."
  },
  reducers: {
    startLoading: (state, action) => {
      state.isLoading = true;
      state.message = action.payload || "";
    },
    stopLoading: (state) => {
      state.isLoading = false;
      state.message = "";
    },
  },
});

export const { startLoading, stopLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
