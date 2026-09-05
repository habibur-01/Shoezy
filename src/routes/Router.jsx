import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ErrorPage from "../pages/ErrorPage";
import CartPage from "../pages/authenticated/CartPage";
import PrivateRoute from "../components/PrivateRoute/PrivatRoute";
import WishlistPage from "../pages/authenticated/WishListPage";
import ShopPage from "../pages/ShopPage";
import OutletsPage from "../pages/OutletsPage";
import ProfileDetails from "../components/Profile/ProfileDteails";
import ProfilePageLayout from "../Layout/ProfilePageLayout";
import BillingAddress from "../components/Profile/BillingAddress";
import CheckoutPage from "../pages/authenticated/CheckoutPage";
import MyOrders from "../components/Profile/MyOrders";
import MyReturns from "../components/Profile/MyReturns";
import MyCancellations from "../components/Profile/MyCancellations";
import UserPaymentOptions from "../components/Profile/UserPaymentOptions";
import OrderTrackingPage from "../components/Profile/OrderTrackingPage";
import PaymentGatewayManager from "../pages/authenticated/PaymentGatewayManager";
import AuthLayout from "../Layout/AuthLayout";

const Router = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Public Store routes & main store shell */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<ShopPage />} />
        <Route path="/products/:categorySlug?/:subSlug?" element={<ShopPage />} />
        <Route path="/products/:categorySlug/:subSlug?/:slug" element={<ProductDetails />} />
        <Route path="/outlets" element={<OutletsPage />} />
        <Route path="/account/mycart" element={<CartPage />} />

        {/* Private Customer & Admin Routes inside main layout */}
        <Route element={<PrivateRoute />}>
          <Route path="/order" element={<CheckoutPage />} />
          <Route path="/account/wishlist" element={<WishlistPage />} />
          <Route path="/mycart/checkout" element={<CheckoutPage />} />
          <Route path="/admin/payment-gateways" element={<PaymentGatewayManager />} />
        </Route>

        {/* Catch-all 404 route inside main store layout */}
        <Route path="*" element={<ErrorPage />} />
      </Route>

      {/* Private Customer Profile Dashboard */}
      <Route path="/account" element={<PrivateRoute><ProfilePageLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/account/profile" replace />} />
        <Route path="profile" element={<ProfileDetails />} />
        <Route path="address" element={<BillingAddress />} />
        <Route path="payment" element={<UserPaymentOptions />} />
        <Route path="myorders" element={<MyOrders />} />
        <Route path="returns" element={<MyReturns />} />
        <Route path="cancellations" element={<MyCancellations />} />
        <Route path="track-order/:orderId?" element={<OrderTrackingPage />} />
      </Route>
    </Routes>
  );
};

export default Router;
