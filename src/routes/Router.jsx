import { Route, Routes } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ErrorPage from "../pages/ErrorPage";
import ProfilePage from "../pages/authenticated/ProfilePage";
import CartPage from "../pages/authenticated/CartPage";
import PrivateRoute from "../components/PrivateRoute/PrivatRoute";
import WishlistPage from "../pages/authenticated/WishListPage";
import ShopPage from "../pages/ShopPage";

const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
         <Route path="/shop/products" element={<ShopPage/>} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/account/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/account/mycart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/account/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
      </Route>
      {/* <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<Home />} />
        <Route path="settings" element={<Settings />} />
      </Route> */}
      <Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      {/* 🚨 Catch-all route for 404 pages */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Router;
