import React, { useState, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, X, Store, LogOut, ShieldAlert } from 'lucide-react';
import { AdminProvider, useAdmin } from '../context/AdminContext';
import { Sidebar } from '../pages/admin/Sidebar';
import { Header } from '../pages/admin/Header';
import { UnauthorizedModal } from '../pages/admin/UnauthorizedModal';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../redux/features/auth/authSlice';
import { toast } from 'react-toastify';

import api from '../api/index';
import { LOGOUT_ENDPOINT } from '../endpoint';

const TAB_PERMISSION_MAP = {
  dashboard: 'overview.view',
  products: 'products.view',
  add_product: 'products.create',
  product_variants: 'products.variants',
  categories: 'categories.view',
  brands: 'brands.view',
  inventory: 'inventory.view',
  orders: 'orders.view',
  create_order: 'orders.create',
  returns_refunds: 'orders.cancel_refund',
  transactions: 'transactions.view',
  customers: 'customers.view',
  customer_analytics: 'customers.analytics',
  reviews: 'reviews.view',
  coupons: 'coupons.view',
  discounts_offers: 'discounts.view',
  campaigns: 'campaigns.view',
  cms_pages: 'cms.pages.view',
  cms_banners: 'cms.banners.view',
  cms_homepage_sections: 'cms.homepage.view',
  cms_navigation: 'cms.navigation.view',
  cms_media: 'cms.media.view',
  staff_admins: 'roles.view',
  roles: 'roles.view',
  users: 'users.view',
  audit: 'audit.view',
  analytics: 'analytics.view',
  payment_gateways: 'settings.payment_gateways',
};

const AdminLayoutInner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { hasPermission, currentRole } = useAdmin();

  // Derive active tab from URL path
  const currentTab = useMemo(() => {
    const path = location.pathname.replace(/^\/admin\/?/, '').toLowerCase();
    if (!path || path === 'dashboard') return 'dashboard';
    if (path.includes('variant')) return 'product_variants';
    if (path.startsWith('product') && (path.includes('add') || path.includes('new'))) return 'add_product';
    if (path.startsWith('product')) return 'products';
    if (path.startsWith('categorie') || path.startsWith('category')) return 'categories';
    if (path.startsWith('brand')) return 'brands';
    if (path.startsWith('inventory')) return 'inventory';
    if (path.startsWith('order') && (path.includes('create') || path.includes('add') || path.includes('new'))) return 'create_order';
    if (path.startsWith('returns') || path.startsWith('refund')) return 'returns_refunds';
    if (path.startsWith('order')) return 'orders';
    if (path.startsWith('transaction')) return 'transactions';
    if (path.startsWith('customer_analytic')) return 'customer_analytics';
    if (path.startsWith('customer')) return 'customers';
    if (path.startsWith('review')) return 'reviews';
    if (path.startsWith('coupon')) return 'coupons';
    if (path.startsWith('discount')) return 'discounts_offers';
    if (path.startsWith('campaign')) return 'campaigns';
    if (path === 'cms') return 'cms_pages';
    if (path.startsWith('cms')) return path;
    if (path.startsWith('staff')) return 'staff_admins';
    if (path.startsWith('role') || path.startsWith('permission')) return 'roles';
    if (path.startsWith('user')) return 'users';
    if (path.startsWith('audit')) return 'audit';
    if (path.startsWith('report')) return path;
    if (path.startsWith('analytic')) return 'analytics';
    if (path.startsWith('settings_') || path === 'store_settings') return path;
    if (path.startsWith('payment')) return 'payment_gateways';
    return path;
  }, [location.pathname]);

  // Route-level permission gate check
  const requiredPermissionForTab = useMemo(() => {
    if (!currentTab) return null;
    if (TAB_PERMISSION_MAP[currentTab]) return TAB_PERMISSION_MAP[currentTab];
    if (currentTab.startsWith('report')) return 'reports.view';
    if (currentTab.startsWith('settings_') || currentTab === 'store_settings') return 'settings.view';
    if (currentTab.startsWith('cms')) return 'cms.pages.view';
    return null;
  }, [currentTab]);

  const isTabPermitted = useMemo(() => {
    if (!requiredPermissionForTab || !hasPermission) return false;
    return hasPermission(requiredPermissionForTab);
  }, [requiredPermissionForTab, hasPermission]);

  const handleTabChange = (tabId) => {
    setIsMobileSidebarOpen(false);
    if (tabId === 'payment_gateways' || tabId === 'payment-gateways') {
      navigate('/admin/payment-gateways');
    } else {
      navigate(`/admin/${tabId}`);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await api.post(LOGOUT_ENDPOINT);
    } catch (err) {
      console.warn('Backend logout error:', err);
    } finally {
      dispatch(clearAuth());
      toast.info('Admin session signed out successfully.');
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <div className="flex h-screen h-[100dvh] bg-zinc-100 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar activeTab={currentTab} setActiveTab={handleTabChange} onLogout={handleAdminLogout} />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-zinc-900 z-10 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar activeTab={currentTab} setActiveTab={handleTabChange} onLogout={handleAdminLogout} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Pinned Top Header Bar with Mobile Menu Toggle & Storefront Quick-Link */}
        <header className="sticky top-0 z-30 shrink-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-xs transition-colors">
          <div className="flex items-center">
            {/* Mobile hamburger button */}
            <button
              id="btn-mobile-admin-menu"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-3 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Standard Admin Header */}
            <div className="flex-1 min-w-0">
              <Header setActiveTab={handleTabChange} />
            </div>

            {/* Storefront Link & Logout Actions in Header */}
            <div className="hidden md:flex items-center gap-2 pr-6 border-l border-zinc-200 dark:border-zinc-800 pl-4 h-16 shrink-0">
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Open Public Customer Storefront"
              >
                <Store className="w-3.5 h-3.5 text-indigo-500" />
                <span>Storefront</span>
              </Link>

              <button
                id="btn-admin-logout"
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                title="Sign Out of Operations Console"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport with RBAC Route Permission Protection */}
        <main id="admin-main-viewport" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 overscroll-contain">
          <div className="max-w-7xl mx-auto space-y-6">
            {!isTabPermitted ? (
              <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl shadow-sm text-center max-w-lg mx-auto my-12">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 mb-4">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Access Restricted (RBAC)</h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Your current role <span className="font-semibold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">{currentRole?.name || 'Assigned Role'}</span> does not have security clearance for this section.
                </p>
                <div className="w-full bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-3 mb-6 text-xs text-left border border-zinc-200 dark:border-zinc-700">
                  <div className="text-zinc-400 text-[10px] uppercase font-mono">Required Capability Key:</div>
                  <div className="font-mono font-semibold text-rose-600 dark:text-rose-400 mt-0.5">{requiredPermissionForTab}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTabChange('dashboard')}
                    className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <Outlet context={{ activeTab: currentTab, setActiveTab: handleTabChange }} />
            )}
          </div>
        </main>
      </div>

      {/* Global RBAC Unauthorized Notification Modal */}
      <UnauthorizedModal />
    </div>
  );
};

const AdminLayout = () => {
  return (
    <AdminProvider>
      <AdminLayoutInner />
    </AdminProvider>
  );
};

export default AdminLayout;
