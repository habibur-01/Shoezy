import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer, { loggedIn, loggedOut, setUser } from "./features/auth/authSlice";
import productReducer from "./features/product/productSlice";
import cartReducer from "./features/cart/cartSlice";
import reviewReducer from "./features/review/reviewSlice";
import initialReducer from "./features/initial/initialSlice";
import loaderSlice from "./features/loader/loaderSlice";
import { jwtDecode } from "jwt-decode";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  initial: initialReducer,
  product: productReducer,
  review: reviewReducer,
  cart: cartReducer,
  loader: loaderSlice,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: [ "cart", "initial"], // slices to persist
};

// Wrap root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// Create persistor
export const persistor = persistStore(store);

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

    if (user) {
      store.dispatch(setUser(JSON.parse(user)))
    };
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

loadDataFromStorage();
export default store;
