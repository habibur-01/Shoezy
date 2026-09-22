import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProfilePageLayout from "../layouts/ProfilePageLayout";
import AdminLayout from "../layouts/AdminLayout";
import PrivateRoute from "../components/PrivateRoute/PrivatRoute";
import AdminRoute from "../components/PrivateRoute/AdminRoute";

// Common Pages (Root of pages)
import Home from "../pages/Home";
import ShopPage from "../pages/ProductsPage";
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

// Admin Operations Pages - Ordered Serial-wise by Sidebar Sections
// 1. Overview
import AdminDashboard from "../pages/admin/AdminDashboard";

// 2. Catalog
import ProductsPage from "../pages/admin/ProductsView";
import AddProductPage from "../pages/admin/AddProductView";
import { ProductVariantsView } from "../pages/admin/views/ProductVariantsView";
import CategoriesPage from "../pages/admin/CategoriesView";
import { BrandsView } from "../pages/admin/views/BrandsView";
import { InventoryView } from "../pages/admin/views/InventoryView";

// 3. Sales & Orders
import OrdersView from "../pages/admin/OrdersView";
import { CreateOrderView } from "../pages/admin/CreateOrderView";
import { ReturnsRefundsView } from "../pages/admin/views/ReturnsRefundsView";
import { TransactionsView } from "../pages/admin/views/TransactionsView";

// 4. Customers
import { CustomersView } from "../pages/admin/views/CustomersView";
import { ReviewsView } from "../pages/admin/views/ReviewsView";

// 5. Promotions & Marketing
import CouponsView from "../pages/admin/CouponsView";
import { DiscountsOffersView } from "../pages/admin/views/DiscountsOffersView";
import { CampaignsView } from "../pages/admin/views/CampaignsView";

// 6. Content (CMS)
import { CmsView } from "../pages/admin/views/CmsView";

// 7. User Management
import { StaffAdminsView } from "../pages/admin/views/StaffAdminsView";
import RolesPermissionsView from "../pages/admin/RolesPermissionsView";
import UsersView from "../pages/admin/UsersView";
import AuditLogsView from "../pages/admin/AuditLogsView";

// 8. Analytics & Insights
import { ReportsView } from "../pages/admin/views/ReportsView";
import AnalyticsView from "../pages/admin/AnalyticsView";

// 9. System & Configuration
import { StoreSettingsView } from "../pages/admin/views/StoreSettingsView";
import PaymentGatewayManager from "../pages/admin/PaymentGatewayManager";

// Page Builder & Dynamic Custom Pages
import { PageBuilder } from "../pages/admin/builder/PageBuilder";
import { CustomPageView } from "../pages/CustomPageView";

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

      {/* Protected Admin Operations Hub Routes - Ordered Serial-wise */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />

        {/* 1. OVERVIEW */}
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* 2. CATALOG */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="add_product" element={<AddProductPage />} />
        <Route path="product_variants" element={<ProductVariantsView />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="brands" element={<BrandsView />} />
        <Route path="inventory" element={<InventoryView />} />

        {/* 3. SALES & ORDERS */}
        <Route path="orders" element={<OrdersView />} />
        <Route path="create_order" element={<CreateOrderView />} />
        <Route path="returns_refunds" element={<ReturnsRefundsView />} />
        <Route path="transactions" element={<TransactionsView />} />

        {/* 4. CUSTOMERS */}
        <Route path="customers" element={<CustomersView initialTab="all" />} />
        <Route path="customer_analytics" element={<CustomersView initialTab="analytics" />} />
        <Route path="reviews" element={<ReviewsView />} />

        {/* 5. PROMOTIONS & MARKETING */}
        <Route path="coupons" element={<CouponsView />} />
        <Route path="discounts_offers" element={<DiscountsOffersView />} />
        <Route path="campaigns" element={<CampaignsView />} />

        {/* 6. CONTENT (CMS) */}
        <Route path="cms" element={<CmsView initialSection="pages" />} />
        <Route path="cms_pages" element={<CmsView initialSection="pages" />} />
        <Route path="cms_banners" element={<CmsView initialSection="banners" />} />
        <Route path="cms_homepage_sections" element={<CmsView initialSection="homepage_sections" />} />
        <Route path="cms_navigation" element={<CmsView initialSection="navigation" />} />
        <Route path="cms_media" element={<CmsView initialSection="media" />} />

        {/* 7. USER MANAGEMENT */}
        <Route path="staff_admins" element={<StaffAdminsView />} />
        <Route path="roles" element={<RolesPermissionsView />} />
        <Route path="users" element={<UsersView />} />
        <Route path="audit" element={<AuditLogsView />} />

        {/* 8. ANALYTICS & INSIGHTS */}
        <Route path="reports" element={<ReportsView initialReport="sales" />} />
        <Route path="reports_sales" element={<ReportsView initialReport="sales" />} />
        <Route path="reports_orders" element={<ReportsView initialReport="orders" />} />
        <Route path="reports_products" element={<ReportsView initialReport="products" />} />
        <Route path="reports_inventory" element={<ReportsView initialReport="inventory" />} />
        <Route path="reports_customers" element={<ReportsView initialReport="customers" />} />
        <Route path="reports_payments" element={<ReportsView initialReport="payments" />} />
        <Route path="reports_coupons" element={<ReportsView initialReport="coupons" />} />
        <Route path="analytics" element={<AnalyticsView />} />

        {/* 9. SYSTEM & CONFIGURATION */}
        <Route path="store_settings" element={<StoreSettingsView initialTab="store_info" />} />
        <Route path="settings_store_info" element={<StoreSettingsView initialTab="store_info" />} />
        <Route path="settings_tax" element={<StoreSettingsView initialTab="tax" />} />
        <Route path="settings_currency" element={<StoreSettingsView initialTab="currency" />} />
        <Route path="settings_shipping" element={<StoreSettingsView initialTab="shipping" />} />
        <Route path="settings_payment_methods" element={<StoreSettingsView initialTab="payment_methods" />} />
        <Route path="settings_notifications" element={<StoreSettingsView initialTab="notifications" />} />
        <Route path="payment-gateways" element={<PaymentGatewayManager />} />
        <Route path="payment_gateways" element={<PaymentGatewayManager />} />
      </Route>

      {/* Dedicated Fullscreen Visual Page Builder */}
      <Route
        path="/admin/page-builder/:id"
        element={
          <AdminRoute>
            <PageBuilder />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/page-builder/new"
        element={
          <AdminRoute>
            <PageBuilder />
          </AdminRoute>
        }
      />

      {/* Public Store routes & main store shell */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/page/:slug" element={<CustomPageView />} />
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
