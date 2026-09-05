import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    updateAuthUser: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },

    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },

    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setAuthUser,
  updateAuthUser,
  clearAuth,
  setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;