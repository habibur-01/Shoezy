import {
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";

import authReducer from "./features/auth/authSlice";
import productReducer from "./features/product/productSlice";
import cartReducer from "./features/cart/cartSlice";
import reviewReducer from "./features/review/reviewSlice";
import initialReducer from "./features/initial/initialSlice";
import loaderReducer from "./features/loader/loaderSlice";

import storage from "redux-persist/lib/storage";

import {
  persistReducer,
  persistStore,
} from "redux-persist";


// ==============================
// Root Reducer
// ==============================

const rootReducer = combineReducers({
  auth: authReducer,
  initial: initialReducer,
  product: productReducer,
  review: reviewReducer,
  cart: cartReducer,
  loader: loaderReducer,
});


// ==============================
// Redux Persist
// ==============================

const persistConfig = {
  key: "root",
  storage,

  // Only persist these slices
  whitelist: [
    "cart",
    "initial",
  ],
};


const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);


// ==============================
// Store
// ==============================

const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


// ==============================
// Persistor
// ==============================

export const persistor =
  persistStore(store);


export default store;
