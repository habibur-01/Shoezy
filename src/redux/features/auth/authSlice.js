import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedIn: false,
    user: {},
  },
  reducers: {
    loggedIn: (state, action) => {
      state.loggedIn = true;
      state.user = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    loggedOut: (state) => {
      state.loggedIn = false;
      state.user = {};
    },
  },
});

export const { loggedIn, setUser, loggedOut } = authSlice.actions;
export default authSlice.reducer;
