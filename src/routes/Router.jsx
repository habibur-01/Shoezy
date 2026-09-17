import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProfilePageLayout from "../layouts/ProfilePageLayout";
import AdminLayout from "../layouts/AdminLayout";
import PrivateRoute from "../components/PrivateRoute/PrivatRoute";
import AdminRoute from "../components/PrivateRoute/AdminRoute";

// Common Pages (Root of pages)
import Home from "../pages/Home";
import ShopPage from "../pages/ShopPage";
import ProductDetails from "../pages/ProductDetails";
import OutletsPage from "../pages/OutletsPage";
import ErrorPage from "../pages/ErrorPage";

// Authentication Pages - Customer
import Login from "../pages/auth/customer/Login";
import Signup from "../pages/auth/customer/Signup";
import ForgotPassword from "../pages/auth/customer/ForgotPassword";
import ResetPassword from "../pages/auth/customer/ResetPassword";
import VerifyEmail from "../pages/auth/customer/VerifyEmail";

// Authentication Pages - Admin
import AdminLogin from "../pages/auth/admin/AdminLogin";

// Customer Pages
import CartPage from "../pages/customer/CartPage";
import WishlistPage from "../pages/customer/WishListPage";
import CheckoutPage from "../pages/customer/CheckoutPage";
import ProfileDetails from "../pages/customer/ProfileDetails";
import BillingAddress from "../pages/customer/BillingAddress";
import UserPaymentOptions from "../pages/customer/UserPaymentOptions";
import MyOrders from "../pages/customer/MyOrders";
import MyReturns from "../pages/customer/MyReturns";
import MyCancellations from "../pages/customer/MyCancellations";
import OrderTrackingPage from "../pages/customer/OrderTrackingPage";

// Admin Operations Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProductsPage from "../pages/admin/ProductsView";
import AddProductPage from "../pages/admin/AddProductView";
import CategoriesPage from "../pages/admin/CategoriesView";
import OrdersView from "../pages/admin/OrdersView";
import CouponsView from "../pages/admin/CouponsView";
import AnalyticsView from "../pages/admin/AnalyticsView";
import RolesPermissionsView from "../pages/admin/RolesPermissionsView";
import AuditLogsView from "../pages/admin/AuditLogsView";
import PaymentGatewayManager from "../pages/admin/PaymentGatewayManager";
import UsersView from "../pages/admin/UsersView";

const Router = () => {
  return (
    <Routes>
      {/* Customer Authentication routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Dedicated Executive Admin Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Operations Hub Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="add_product" element={<AddProductPage />} />
        <Route path="add-product" element={<AddProductPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="orders" element={<OrdersView />} />
        <Route path="coupons" element={<CouponsView />} />
        <Route path="analytics" element={<AnalyticsView />} />
        <Route path="roles" element={<RolesPermissionsView />} />
        <Route path="users" element={<UsersView />} />
        <Route path="audit" element={<AuditLogsView />} />
        <Route path="payment-gateways" element={<PaymentGatewayManager />} />
      </Route>

      {/* Public Store routes & main store shell */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<ShopPage />} />
        <Route path="/products/:categorySlug?/:subSlug?" element={<ShopPage />} />
        <Route path="/products/:categorySlug/:subSlug?/:slug" element={<ProductDetails />} />
        <Route path="/outlets" element={<OutletsPage />} />
        <Route path="/account/mycart" element={<CartPage />} />
        <Route path="/track-order" element={<OrderTrackingPage />} />
        <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />

        {/* Private Customer Routes inside main layout */}
        <Route element={<PrivateRoute />}>
          <Route path="/order" element={<CheckoutPage />} />
          <Route path="/account/wishlist" element={<WishlistPage />} />
          <Route path="/mycart/checkout" element={<CheckoutPage />} />
        </Route>
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
        <Route path="track-order" element={<OrderTrackingPage />} />
        <Route path="track-order/:orderId" element={<OrderTrackingPage />} />
      </Route>

      {/* Catch-all 404 route for any undefined path */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Router;
