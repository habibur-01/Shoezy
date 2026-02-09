import { Route, Routes } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ErrorPage from "../pages/ErrorPage";
import CartPage from "../pages/authenticated/CartPage";
import PrivateRoute from "../components/PrivateRoute/PrivatRoute";
import WishlistPage from "../pages/authenticated/WishListPage";
import ShopPage from "../pages/ShopPage";
import ProfileDetails from "../components/Profile/ProfileDteails";
import ProfilePageLayout from "../Layout/ProfilePageLaout";
import BillingAddress from "../components/Profile/BillingAddress";
import CheckoutPage from "../pages/authenticated/CheckoutPage";
import MyOrders from "../components/Profile/MyOrders";


const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/products/:categorySlug?/:subSlug?" element={<ShopPage />} />
        <Route path="/products" element={<ShopPage />} />
        <Route path="/products/:categorySlug/:subSlug?/:slug" element={<ProductDetails />} />
        <Route path="/account/mycart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/account/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
        <Route path="/order" element={<CheckoutPage/>} />
        <Route path="/mycart/checkout" element={<PrivateRoute><CheckoutPage/></PrivateRoute>} />
      </Route>
      <Route path="/account" element={<PrivateRoute><ProfilePageLayout /></PrivateRoute>}>
        <Route path="profile" element={<ProfileDetails />} />
        <Route path="address" element={<BillingAddress />} />
        <Route path="myorders" element={<MyOrders />} />
       
        {/* <Route path="payment" element={<PaymentOptions />} />
        <Route path="returns" element={<Returns />} />
        <Route path="cancellations" element={<Cancellations />} /> */}
      </Route>
      
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
