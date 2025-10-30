import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loggedIn } from "./features/auth/authSlice";
import loaderSlice from "./features/loader/loaderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderSlice,
  },
});

// Load data from AsyncStorage
const loadDataFromStorage = async () => {
  try {
    const credentials = localStorage.getItem("authToken");
    if (credentials) {
      store.dispatch(loggedIn());
    }
    // const user = await AsyncStorage.getItem("user");
    // if (user) {
    //   store.dispatch(setUser(JSON.parse(user)));
    // }
  } catch (error) {
    console.log("Error loading data from store.js loadDataFromStorage:", error);
  }
};

loadDataFromStorage();
export default store;
