import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loggedIn, loggedOut, setUser } from "./features/auth/authSlice";
import loaderSlice from "./features/loader/loaderSlice";
import { jwtDecode } from "jwt-decode";

const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderSlice,
  },
});

function isTokenValid(token) {

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const loadDataFromStorage = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (token && isTokenValid(token)) {
      store.dispatch(loggedIn());
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      store.dispatch(loggedOut());
    }

    if (user) store.dispatch(setUser(JSON.parse(user)));
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

// Load data from AsyncStorage
// const loadDataFromStorage = async () => {
//   try {
//     const credentials = localStorage.getItem("authToken");
//     if (credentials) {
//       store.dispatch(loggedIn());
//     }
//     const user = localStorage.getItem("user");
//     console.log("🚀 ~ loadDataFromStorage ~ user:", user)
//     if (user) {
//       store.dispatch(setUser(JSON.parse(user)));
//     }
//   } catch (error) {
//     console.log("Error loading data from store.js loadDataFromStorage:", error);
//   }
// };


loadDataFromStorage();
export default store;
