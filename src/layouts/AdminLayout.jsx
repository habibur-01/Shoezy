import React, { useState, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, X, Store, LogOut } from 'lucide-react';
import { AdminProvider, useAdmin } from '../context/AdminContext';
import { Sidebar } from '../pages/admin/Sidebar';
import { Header } from '../pages/admin/Header';
import { UnauthorizedModal } from '../pages/admin/UnauthorizedModal';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../redux/features/auth/authSlice';
import { toast } from 'react-toastify';

import api from '../api/index';
import { LOGOUT_ENDPOINT } from '../endpoint';

const AdminLayoutInner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Derive active tab from URL path
  const currentTab = useMemo(() => {
    const path = location.pathname.replace(/^\/admin\/?/, '').toLowerCase();
    if (!path || path === 'dashboard') return 'dashboard';
    if (path.startsWith('product') && (path.includes('add') || path.includes('new'))) return 'add_product';
    if (path.startsWith('product')) return 'products';
    if (path.startsWith('categorie') || path.startsWith('category')) return 'categories';
    if (path.startsWith('order')) return 'orders';
    if (path.startsWith('coupon')) return 'coupons';
    if (path.startsWith('analytic')) return 'analytics';
    if (path.startsWith('user')) return 'users';
    if (path.startsWith('role') || path.startsWith('permission')) return 'roles';
    if (path.startsWith('audit')) return 'audit';
    if (path.startsWith('payment')) return 'payment_gateways';
    return path;
  }, [location.pathname]);

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
        <Sidebar activeTab={currentTab} setActiveTab={handleTabChange} />
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
            <Sidebar activeTab={currentTab} setActiveTab={handleTabChange} />
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

        {/* Scrollable Viewport */}
        <main id="admin-main-viewport" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 overscroll-contain">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet context={{ activeTab: currentTab, setActiveTab: handleTabChange }} />
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