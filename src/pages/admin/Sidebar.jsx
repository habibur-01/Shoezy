import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  Boxes,
  ShoppingCart,
  CreditCard,
  Users,
  Star,
  TicketPercent,
  Percent,
  Gift,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  Menu,
  ImagePlus,
  ShieldCheck,
  FileClock,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Megaphone,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';

const productSubItems = [
  { id: 'products', label: 'All Products', to: '/admin/products', permKey: 'products.view' },
  { id: 'add_product', label: 'Add Product', to: '/admin/add_product', permKey: 'products.create' },
  {
    id: 'product_variants',
    label: 'Product Variants',
    to: '/admin/product_variants',
    permKey: 'products.variants',
    fallbackPermKey: 'products.view',
    badge: (
      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
        New
      </span>
    ),
  },
];

const orderSubItems = [
  { id: 'orders', label: 'All Orders', to: '/admin/orders', permKey: 'orders.view' },
  { id: 'create_order', label: 'Create Order', to: '/admin/create_order', permKey: 'orders.create' },
  { id: 'returns_refunds', label: 'Returns & Refunds', to: '/admin/returns_refunds', permKey: 'orders.cancel_refund' },
];

const customerSubItems = [
  { id: 'customers', label: 'All Customers', to: '/admin/customers', permKey: 'customers.view' },
  { id: 'customer_analytics', label: 'Customer Analytics', to: '/admin/customer_analytics', permKey: 'customers.analytics', fallbackPermKey: 'analytics.view' },
];

const reportSubItems = [
  { id: 'reports_sales', label: 'Sales Report', to: '/admin/reports_sales', permKey: 'reports.view' },
  { id: 'reports_orders', label: 'Order Report', to: '/admin/reports_orders', permKey: 'reports.view' },
  { id: 'reports_products', label: 'Product Report', to: '/admin/reports_products', permKey: 'reports.view' },
  { id: 'reports_inventory', label: 'Inventory Report', to: '/admin/reports_inventory', permKey: 'reports.view' },
  { id: 'reports_customers', label: 'Customer Report', to: '/admin/reports_customers', permKey: 'reports.view' },
  { id: 'reports_payments', label: 'Payment Report', to: '/admin/reports_payments', permKey: 'reports.view' },
  { id: 'reports_coupons', label: 'Coupon / Discount Report', to: '/admin/reports_coupons', permKey: 'reports.view' },
];

const storeSettingsSubItems = [
  { id: 'settings_store_info', label: 'Store Information', to: '/admin/settings_store_info', permKey: 'settings.view' },
  { id: 'settings_tax', label: 'Tax', to: '/admin/settings_tax', permKey: 'settings.view' },
  { id: 'settings_currency', label: 'Currency', to: '/admin/settings_currency', permKey: 'settings.view' },
  { id: 'settings_shipping', label: 'Shipping', to: '/admin/settings_shipping', permKey: 'settings.view' },
  { id: 'settings_payment_methods', label: 'Payment Methods', to: '/admin/settings_payment_methods', permKey: 'settings.view' },
  { id: 'settings_notifications', label: 'Notification Settings', to: '/admin/settings_notifications', permKey: 'settings.view' },
];

const NavItem = ({ id, icon: Icon, label, isActive, isCollapsed, badge, onClick, onMouseEnter, onMouseLeave, to }) => {
  const content = (
    <>
      <div className="w-7 h-7 flex items-center justify-center shrink-0">
        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
      </div>

      <div
        className={`flex items-center justify-between min-w-0 transition-all duration-500 ease-in-out ${
          isCollapsed
            ? 'opacity-0 pointer-events-none max-w-0 ml-0 -translate-x-3 overflow-hidden'
            : 'opacity-100 max-w-full flex-1 ml-3 translate-x-0'
        }`}
      >
        <span className="truncate whitespace-nowrap">{label}</span>
        {badge && <div className="shrink-0 ml-2">{badge}</div>}
      </div>
    </>
  );

  const className = `w-full h-10 flex items-center px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer relative overflow-hidden shrink-0 ${
    isActive
      ? 'bg-indigo-600 text-white shadow-xs'
      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
  }`;

  if (to) {
    return (
      <Link id={id} to={to} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button id={id} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={className}>
      {content}
    </button>
  );
};

const NavGroup = ({
  id,
  icon: Icon,
  label,
  isGroupActive,
  isExpanded,
  isCollapsed,
  badge,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  children,
}) => {
  return (
    <div className="shrink-0">
      <div
        id={id}
        onClick={onToggle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`w-full h-10 flex items-center px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer relative overflow-hidden ${
          isGroupActive ? 'text-white bg-slate-800/60' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
        }`}
      >
        <div className="w-7 h-7 flex items-center justify-center shrink-0">
          <Icon className={`w-5 h-5 shrink-0 ${isGroupActive ? 'text-white' : 'text-slate-400'}`} />
        </div>

        <div
          className={`flex items-center justify-between min-w-0 transition-all duration-500 ease-in-out ${
            isCollapsed
              ? 'opacity-0 pointer-events-none max-w-0 ml-0 -translate-x-3 overflow-hidden'
              : 'opacity-100 max-w-full flex-1 ml-3 translate-x-0'
          }`}
        >
          <span className="truncate whitespace-nowrap">{label}</span>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {badge}
            <div className="text-slate-400 hover:text-white p-0.5">
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          !isCollapsed && isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0 hidden'
        }`}
      >
        <div className="space-y-0.5 pl-6 pr-1">{children}</div>
      </div>
    </div>
  );
};

const NavSubItem = ({ id, label, isActive, badge, onClick, to }) => {
  const content = (
    <>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-slate-400 font-bold">•</span>
        <span className="truncate">{label}</span>
      </div>
      {badge}
    </>
  );

  const className = `w-full flex items-center justify-between py-1.5 px-3 rounded-md text-xs transition-colors cursor-pointer ${
    isActive ? 'text-white font-semibold bg-slate-800/80' : 'text-slate-400 hover:text-white'
  }`;

  if (to) {
    return (
      <Link id={id} to={to} onClick={onClick} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button id={id} onClick={onClick} className={className}>
      {content}
    </button>
  );
};

const NavSectionHeader = ({ title, isCollapsed }) => (
  <div
    className={`px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out ${
      isCollapsed ? 'hidden' : 'h-6 pt-2 pb-1 opacity-100'
    }`}
  >
    {title}
  </div>
);

// --- Primary Sidebar Component with Dynamic RBAC Filtering ---
export const Sidebar = ({
  activeTab,
  setActiveTab,
  onLogout,
  isCollapsed: externalIsCollapsed,
  setIsCollapsed: externalSetIsCollapsed,
}) => {
  const { metrics, currentRole, currentUser, hasPermission } = useAdmin();

  // Collapsed state
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalIsCollapsed ?? internalCollapsed;
  const toggleCollapse = () => {
    if (externalSetIsCollapsed) {
      externalSetIsCollapsed(!isCollapsed);
    } else {
      setInternalCollapsed(!isCollapsed);
    }
  };

  // Expanded sub-menus
  const [expandedMenus, setExpandedMenus] = useState({
    products: true,
    orders: false,
    customers: false,
    reports: true,
    store_settings: true,
  });

  // Collapsed flyout popup state
  const [flyout, setFlyout] = useState(null);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isCollapsed) {
      setFlyout(null);
    }
  }, [isCollapsed]);

  // Auto-expand parent groups when a child route is active
  useEffect(() => {
    if (['products', 'add_product', 'product_variants'].includes(activeTab)) {
      setExpandedMenus((prev) => ({ ...prev, products: true }));
    } else if (['orders', 'create_order', 'returns_refunds'].includes(activeTab)) {
      setExpandedMenus((prev) => ({ ...prev, orders: true }));
    } else if (['customers', 'customer_analytics'].includes(activeTab)) {
      setExpandedMenus((prev) => ({ ...prev, customers: true }));
    } else if (activeTab && activeTab.startsWith('report')) {
      setExpandedMenus((prev) => ({ ...prev, reports: true }));
    } else if (activeTab && (activeTab.startsWith('settings_') || activeTab === 'store_settings')) {
      setExpandedMenus((prev) => ({ ...prev, store_settings: true }));
    }
  }, [activeTab]);

  // ==========================================
  // DYNAMIC RBAC VISIBILITY CHECKS
  // ==========================================
  const filterPermittedSubItems = (items) => {
    if (!items || !hasPermission) return items || [];
    return items.filter((item) => {
      if (item.permKey && hasPermission(item.permKey)) return true;
      if (item.fallbackPermKey && hasPermission(item.fallbackPermKey)) return true;
      return !item.permKey;
    });
  };

  const permittedProductSubItems = filterPermittedSubItems(productSubItems);
  const permittedOrderSubItems = filterPermittedSubItems(orderSubItems);
  const permittedCustomerSubItems = filterPermittedSubItems(customerSubItems);
  const permittedReportSubItems = filterPermittedSubItems(reportSubItems);
  const permittedStoreSettingsSubItems = filterPermittedSubItems(storeSettingsSubItems);

  // Section 1: Overview
  const showOverviewSection = hasPermission('overview.view');

  // Section 2: Catalog
  const showProductsGroup = permittedProductSubItems.length > 0;
  const showCategories = hasPermission('categories.view');
  const showBrands = hasPermission('brands.view');
  const showInventory = hasPermission('inventory.view');
  const showCatalogSection = showProductsGroup || showCategories || showBrands || showInventory;

  // Section 3: Sales & Orders
  const showOrdersGroup = permittedOrderSubItems.length > 0;
  const showTransactions = hasPermission('transactions.view');
  const showSalesSection = showOrdersGroup || showTransactions;

  // Section 4: Customers
  const showCustomersGroup = permittedCustomerSubItems.length > 0;
  const showReviews = hasPermission('reviews.view');
  const showCustomersSection = showCustomersGroup || showReviews;

  // Section 5: Promotions & Marketing
  const showCoupons = hasPermission('coupons.view');
  const showDiscounts = hasPermission('discounts.view');
  const showCampaigns = hasPermission('campaigns.view');
  const showPromotionsSection = showCoupons || showDiscounts || showCampaigns;

  // Section 6: Content (CMS)
  const showCmsPages = hasPermission('cms.pages.view');
  const showCmsBanners = hasPermission('cms.banners.view');
  const showCmsHomepage = hasPermission('cms.homepage.view');
  const showCmsNavigation = hasPermission('cms.navigation.view');
  const showCmsMedia = hasPermission('cms.media.view');
  const showCmsSection =
    showCmsPages || showCmsBanners || showCmsHomepage || showCmsNavigation || showCmsMedia;

  // Section 7: User Management
  const showStaff = hasPermission('roles.view');
  const showRoles = hasPermission('roles.manage_permissions') || hasPermission('roles.view');
  const showUsers = hasPermission('users.view');
  const showAudit = hasPermission('audit.view');
  const showUserManagementSection = showStaff || showRoles || showUsers || showAudit;

  // Section 8: Analytics & Insights
  const showReportsGroup = permittedReportSubItems.length > 0;
  const showAnalytics = hasPermission('analytics.view');
  const showAnalyticsSection = showReportsGroup || showAnalytics;

  // Section 9: System & Configuration
  const showStoreSettingsGroup = permittedStoreSettingsSubItems.length > 0;
  const showPaymentGateways = hasPermission('settings.payment_gateways');
  const showSettingsSection = showStoreSettingsGroup || showPaymentGateways;

  // Hover handlers for collapsed flyout menu
  const handleItemMouseEnter = (key, title, icon, e, items, badge) => {
    if (!isCollapsed) return;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    const filteredItems = items ? filterPermittedSubItems(items) : undefined;
    if (items && items.length > 0 && (!filteredItems || filteredItems.length === 0)) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const itemCount = filteredItems?.length || 0;
    const approxHeight = itemCount > 0 ? 56 + itemCount * 36 : 42;
    const maxTop = window.innerHeight - approxHeight - 16;
    const safeTop = Math.max(12, Math.min(rect.top, maxTop));
    setFlyout({
      key,
      title,
      top: safeTop,
      icon,
      badge,
      items: filteredItems,
    });
  };

  const handleItemMouseLeave = () => {
    if (!isCollapsed) return;
    closeTimeoutRef.current = setTimeout(() => {
      setFlyout(null);
    }, 200);
  };

  const toggleSubmenu = (menuKey, e) => {
    if (e) e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const isParentActive = (childrenIds) => childrenIds.includes(activeTab);

  return (
    <aside
      className={`relative ${
        isCollapsed ? 'w-[70px]' : 'w-72'
      } transition-[width] duration-500 ease-in-out flex-shrink-0 bg-[#0B0F19] text-slate-300 flex flex-col justify-between border-r border-slate-800/80 h-screen sticky top-0 z-40 select-none`}
    >
      {/* Collapse/Expand Toggle Button */}
      <button
        id="sidebar-collapse-toggle-btn"
        onClick={toggleCollapse}
        style={{
          right: isCollapsed ? '-14px' : '14px',
        }}
        className="absolute top-4.5 z-50 p-1.5 rounded-lg border border-slate-700/80 bg-slate-900/95 hover:bg-slate-800 text-slate-400 hover:text-white shadow-lg transition-all duration-500 ease-in-out cursor-pointer flex items-center justify-center shrink-0"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
      </button>

      {/* Inner wrapper */}
      <div className="flex flex-col min-h-0 flex-1 overflow-hidden w-full">
        {/* Brand Header */}
        <SidebarHeader isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />

        {/* Scrollable Navigation Menu with Dynamic RBAC Filtering */}
        <nav
          onScroll={() => setFlyout(null)}
          className={`p-2.5 overflow-y-auto overflow-x-hidden flex-1 overscroll-contain text-xs sidebar-scrollbar ${
            isCollapsed ? 'space-y-1' : 'space-y-3.5'
          } transition-all duration-500`}
        >
          {/* ================= SECTION 1: OVERVIEW ================= */}
          {showOverviewSection && (
            <div className="space-y-1">
              <NavSectionHeader title="OVERVIEW" isCollapsed={isCollapsed} />
              <NavItem
                id="nav-dashboard"
                to="/admin/dashboard"
                icon={LayoutDashboard}
                label="Dashboard"
                isActive={activeTab === 'dashboard'}
                isCollapsed={isCollapsed}
                onClick={() => {
                  setActiveTab('dashboard');
                  setFlyout(null);
                }}
                onMouseEnter={(e) => handleItemMouseEnter('dashboard', 'Dashboard', LayoutDashboard, e)}
                onMouseLeave={handleItemMouseLeave}
              />
            </div>
          )}

          {/* ================= SECTION 2: CATALOG ================= */}
          {showCatalogSection && (
            <div className="space-y-1">
              <NavSectionHeader title="CATALOG" isCollapsed={isCollapsed} />

              {/* Products (Collapsible) */}
              {showProductsGroup && (
                <NavGroup
                  id="nav-products-group"
                  icon={Package}
                  label="Products"
                  isGroupActive={['products', 'add_product', 'product_variants'].includes(activeTab)}
                  isExpanded={expandedMenus.products}
                  isCollapsed={isCollapsed}
                  onToggle={(e) => {
                    if (isCollapsed) {
                      handleItemMouseEnter('products', 'Products', Package, e, permittedProductSubItems);
                    } else {
                      toggleSubmenu('products');
                    }
                  }}
                  onMouseEnter={(e) =>
                    handleItemMouseEnter('products', 'Products', Package, e, permittedProductSubItems)
                  }
                  onMouseLeave={handleItemMouseLeave}
                >
                  {hasPermission('products.view') && (
                    <NavSubItem
                      id="nav-all-products"
                      to="/admin/products"
                      label="All Products"
                      isActive={activeTab === 'products'}
                      onClick={() => setActiveTab('products')}
                    />
                  )}
                  {hasPermission('products.create') && (
                    <NavSubItem
                      id="nav-add-product"
                      to="/admin/add_product"
                      label="Add Product"
                      isActive={activeTab === 'add_product'}
                      onClick={() => setActiveTab('add_product')}
                    />
                  )}
                  {(hasPermission('products.variants') || hasPermission('products.view')) && (
                    <NavSubItem
                      id="nav-product-variants"
                      to="/admin/product_variants"
                      label="Product Variants"
                      isActive={activeTab === 'product_variants'}
                      badge={
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                          New
                        </span>
                      }
                      onClick={() => setActiveTab('product_variants')}
                    />
                  )}
                </NavGroup>
              )}

              {/* Categories */}
              {showCategories && (
                <NavItem
                  id="nav-categories"
                  to="/admin/categories"
                  icon={Layers}
                  label="Categories"
                  isActive={activeTab === 'categories'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('categories');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('categories', 'Categories', Layers, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}

              {/* Brands */}
              {showBrands && (
                <NavItem
                  id="nav-brands"
                  to="/admin/brands"
                  icon={Tag}
                  label="Brands"
                  isActive={activeTab === 'brands'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('brands');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('brands', 'Brands', Tag, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}

              {/* Inventory */}
              {showInventory && (
                <NavItem
                  id="nav-inventory"
                  to="/admin/inventory"
                  icon={Boxes}
                  label="Inventory"
                  isActive={activeTab === 'inventory'}
                  isCollapsed={isCollapsed}
                  badge={
                    <span className="bg-rose-950/90 text-rose-300 border border-rose-800/80 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Low Stock {metrics.lowStockCount || 3}
                    </span>
                  }
                  onClick={() => {
                    setActiveTab('inventory');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) =>
                    handleItemMouseEnter(
                      'inventory',
                      'Inventory',
                      Boxes,
                      e,
                      undefined,
                      <span className="bg-rose-950/90 text-rose-300 border border-rose-800/80 text-[10px] font-medium px-2 py-0.5 rounded-full">
                        Low Stock {metrics.lowStockCount || 3}
                      </span>
                    )
                  }
                  onMouseLeave={handleItemMouseLeave}
                />
              )}
            </div>
          )}

          {/* ================= SECTION 3: SALES & ORDERS ================= */}
          {showSalesSection && (
            <div className="space-y-1">
              <NavSectionHeader title="SALES & ORDERS" isCollapsed={isCollapsed} />

              {/* Orders (Collapsible) */}
              {showOrdersGroup && (
                <NavGroup
                  id="nav-orders-group"
                  icon={ShoppingCart}
                  label="Orders"
                  isGroupActive={['orders', 'create_order', 'returns_refunds'].includes(activeTab)}
                  isExpanded={expandedMenus.orders}
                  isCollapsed={isCollapsed}
                  badge={
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                      5
                    </span>
                  }
                  onToggle={(e) => {
                    if (isCollapsed) {
                      handleItemMouseEnter(
                        'orders',
                        'Orders',
                        ShoppingCart,
                        e,
                        permittedOrderSubItems,
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                          5
                        </span>
                      );
                    } else {
                      toggleSubmenu('orders');
                    }
                  }}
                  onMouseEnter={(e) =>
                    handleItemMouseEnter(
                      'orders',
                      'Orders',
                      ShoppingCart,
                      e,
                      permittedOrderSubItems,
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                        5
                      </span>
                    )
                  }
                  onMouseLeave={handleItemMouseLeave}
                >
                  {hasPermission('orders.view') && (
                    <NavSubItem
                      id="nav-all-orders"
                      to="/admin/orders"
                      label="All Orders"
                      isActive={activeTab === 'orders'}
                      badge={
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                          5
                        </span>
                      }
                      onClick={() => setActiveTab('orders')}
                    />
                  )}
                  {hasPermission('orders.create') && (
                    <NavSubItem
                      id="nav-create-order"
                      to="/admin/create_order"
                      label="Create Order"
                      isActive={activeTab === 'create_order'}
                      onClick={() => setActiveTab('create_order')}
                    />
                  )}
                  {hasPermission('orders.cancel_refund') && (
                    <NavSubItem
                      id="nav-returns-refunds"
                      to="/admin/returns_refunds"
                      label="Returns & Refunds"
                      isActive={activeTab === 'returns_refunds'}
                      onClick={() => setActiveTab('returns_refunds')}
                    />
                  )}
                </NavGroup>
              )}

              {/* Transactions */}
              {showTransactions && (
                <NavItem
                  id="nav-transactions"
                  to="/admin/transactions"
                  icon={CreditCard}
                  label="Transactions"
                  isActive={activeTab === 'transactions'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('transactions');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('transactions', 'Transactions', CreditCard, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}
            </div>
          )}

          {/* ================= SECTION 4: CUSTOMERS ================= */}
          {showCustomersSection && (
            <div className="space-y-1">
              <NavSectionHeader title="CUSTOMERS" isCollapsed={isCollapsed} />

              {/* Customers (Collapsible) */}
              {showCustomersGroup && (
                <NavGroup
                  id="nav-customers-group"
                  icon={Users}
                  label="Customers"
                  isGroupActive={['customers', 'customer_analytics'].includes(activeTab)}
                  isExpanded={expandedMenus.customers}
                  isCollapsed={isCollapsed}
                  onToggle={(e) => {
                    if (isCollapsed) {
                      handleItemMouseEnter('customers', 'Customers', Users, e, permittedCustomerSubItems);
                    } else {
                      toggleSubmenu('customers');
                    }
                  }}
                  onMouseEnter={(e) =>
                    handleItemMouseEnter('customers', 'Customers', Users, e, permittedCustomerSubItems)
                  }
                  onMouseLeave={handleItemMouseLeave}
                >
                  {hasPermission('customers.view') && (
                    <NavSubItem
                      id="nav-all-customers"
                      to="/admin/customers"
                      label="All Customers"
                      isActive={activeTab === 'customers'}
                      onClick={() => setActiveTab('customers')}
                    />
                  )}
                  {(hasPermission('customers.analytics') || hasPermission('analytics.view')) && (
                    <NavSubItem
                      id="nav-customer-analytics"
                      to="/admin/customer_analytics"
                      label="Customer Analytics"
                      isActive={activeTab === 'customer_analytics'}
                      onClick={() => setActiveTab('customer_analytics')}
                    />
                  )}
                </NavGroup>
              )}

              {/* Reviews */}
              {showReviews && (
                <NavItem
                  id="nav-reviews"
                  to="/admin/reviews"
                  icon={Star}
                  label="Reviews"
                  isActive={activeTab === 'reviews'}
                  isCollapsed={isCollapsed}
                  badge={
                    <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                      8
                    </span>
                  }
                  onClick={() => {
                    setActiveTab('reviews');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) =>
                    handleItemMouseEnter(
                      'reviews',
                      'Reviews',
                      Star,
                      e,
                      undefined,
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                        8
                      </span>
                    )
                  }
                  onMouseLeave={handleItemMouseLeave}
                />
              )}
            </div>
          )}

          {/* ================= SECTION 5: PROMOTIONS & MARKETING ================= */}
          {showPromotionsSection && (
            <div className="space-y-1">
              <NavSectionHeader title="PROMOTIONS & MARKETING" isCollapsed={isCollapsed} />

              {/* Coupons */}
              {showCoupons && (
                <NavItem
                  id="nav-coupons"
                  to="/admin/coupons"
                  icon={TicketPercent}
                  label="Coupons"
                  isActive={activeTab === 'coupons'}
                  isCollapsed={isCollapsed}
                  badge={
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                      4
                    </span>
                  }
                  onClick={() => {
                    setActiveTab('coupons');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) =>
                    handleItemMouseEnter(
                      'coupons',
                      'Coupons',
                      TicketPercent,
                      e,
                      undefined,
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                        4
                      </span>
                    )
                  }
                  onMouseLeave={handleItemMouseLeave}
                />
              )}

              {/* Discounts & Offers */}
              {showDiscounts && (
                <NavItem
                  id="nav-discounts-offers"
                  to="/admin/discounts_offers"
                  icon={Percent}
                  label="Discounts & Offers"
                  isActive={activeTab === 'discounts_offers'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('discounts_offers');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('discounts_offers', 'Discounts & Offers', Percent, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}

              {/* Campaigns */}
              {showCampaigns && (
                <NavItem
                  id="nav-campaigns"
                  to="/admin/campaigns"
                  icon={Gift}
                  label="Campaigns"
                  isActive={activeTab === 'campaigns'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('campaigns');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('campaigns', 'Campaigns', Gift, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}
            </div>
          )}

          {/* ================= SECTION 6: CONTENT (CMS) ================= */}
          {showCmsSection && (
            <div className="space-y-1">
              <NavSectionHeader title="CONTENT (CMS)" isCollapsed={isCollapsed} />

              {showCmsPages && (
                <NavItem
                  id="nav-cms-pages"
                  to="/admin/cms_pages"
                  icon={FileText}
                  label="Pages"
                  isActive={activeTab === 'cms_pages' || activeTab === 'cms'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('cms_pages');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('cms_pages', 'Pages', FileText, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}

              {showCmsBanners && (
                <NavItem
                  id="nav-cms-banners"
                  to="/admin/cms_banners"
                  icon={ImageIcon}
                  label="Banners"
                  isActive={activeTab === 'cms_banners'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('cms_banners');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('cms_banners', 'Banners', ImageIcon, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}

              {showCmsHomepage && (
                <NavItem
                  id="nav-cms-homepage-sections"
                  to="/admin/cms_homepage_sections"
                  icon={LayoutGrid}
                  label="Homepage Sections"
                  isActive={activeTab === 'cms_homepage_sections'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('cms_homepage_sections');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('cms_homepage_sections', 'Homepage Sections', LayoutGrid, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}

              {showCmsNavigation && (
                <NavItem
                  id="nav-cms-navigation"
                  to="/admin/cms_navigation"
                  icon={Menu}
                  label="Navigation / Menus"
                  isActive={activeTab === 'cms_navigation'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('cms_navigation');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('cms_navigation', 'Navigation / Menus', Menu, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}

              {showCmsMedia && (
                <NavItem
                  id="nav-cms-media"
                  to="/admin/cms_media"
                  icon={ImagePlus}
                  label="Media Library"
                  isActive={activeTab === 'cms_media'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('cms_media');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('cms_media', 'Media Library', ImagePlus, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}
            </div>
          )}

          {/* ================= SECTION 7: USER MANAGEMENT ================= */}
          {showUserManagementSection && (
            <div className="space-y-1">
              <NavSectionHeader title="USER MANAGEMENT" isCollapsed={isCollapsed} />

              {showStaff && (
                <NavItem
                  id="nav-staff-admins"
                  to="/admin/staff_admins"
                  icon={Users}
                  label="Staff & Admins"
                  isActive={activeTab === 'staff_admins'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('staff_admins');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('staff_admins', 'Staff & Admins', Users, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}

              {showRoles && (
                <NavItem
                  id="nav-roles"
                  to="/admin/roles"
                  icon={ShieldCheck}
                  label="Roles & Permissions"
                  isActive={activeTab === 'roles'}
                  isCollapsed={isCollapsed}
                  badge={
                    <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs">
                      RBAC
                    </span>
                  }
                  onClick={() => {
                    setActiveTab('roles');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) =>
                    handleItemMouseEnter(
                      'roles',
                      'Roles & Permissions',
                      ShieldCheck,
                      e,
                      undefined,
                      <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs">
                        RBAC
                      </span>
                    )
                  }
                  onMouseLeave={handleItemMouseLeave}
                />
              )}

              {showUsers && (
                <NavItem
                  id="nav-users"
                  to="/admin/users"
                  icon={Users}
                  label="Registered Users"
                  isActive={activeTab === 'users'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('users');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('users', 'Registered Users', Users, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}

              {showAudit && (
                <NavItem
                  id="nav-audit"
                  to="/admin/audit"
                  icon={FileClock}
                  label="Audit Logs"
                  isActive={activeTab === 'audit'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('audit');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('audit', 'Audit Logs', FileClock, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}
            </div>
          )}

          {/* ================= SECTION 8: ANALYTICS & INSIGHTS ================= */}
          {showAnalyticsSection && (
            <div className="space-y-1">
              <NavSectionHeader title="ANALYTICS & INSIGHTS" isCollapsed={isCollapsed} />

              {/* Reports (Collapsible) */}
              {showReportsGroup && (
                <NavGroup
                  id="nav-reports-group"
                  icon={BarChart3}
                  label="Reports"
                  isGroupActive={isParentActive([
                    'reports',
                    'reports_sales',
                    'reports_orders',
                    'reports_products',
                    'reports_inventory',
                    'reports_customers',
                    'reports_payments',
                    'reports_coupons',
                  ])}
                  isExpanded={expandedMenus.reports}
                  isCollapsed={isCollapsed}
                  onToggle={(e) => {
                    if (isCollapsed) {
                      handleItemMouseEnter('reports', 'Reports', BarChart3, e, permittedReportSubItems);
                    } else {
                      toggleSubmenu('reports');
                      if (
                        !isParentActive([
                          'reports',
                          'reports_sales',
                          'reports_orders',
                          'reports_products',
                          'reports_inventory',
                          'reports_customers',
                          'reports_payments',
                          'reports_coupons',
                        ])
                      ) {
                        setActiveTab('reports_sales');
                      }
                    }
                  }}
                  onMouseEnter={(e) =>
                    handleItemMouseEnter('reports', 'Reports', BarChart3, e, permittedReportSubItems)
                  }
                  onMouseLeave={handleItemMouseLeave}
                >
                  <NavSubItem
                    id="nav-report-sales"
                    to="/admin/reports_sales"
                    label="Sales Report"
                    isActive={activeTab === 'reports_sales' || activeTab === 'reports'}
                    onClick={() => setActiveTab('reports_sales')}
                  />
                  <NavSubItem
                    id="nav-report-orders"
                    to="/admin/reports_orders"
                    label="Order Report"
                    isActive={activeTab === 'reports_orders'}
                    onClick={() => setActiveTab('reports_orders')}
                  />
                  <NavSubItem
                    id="nav-report-products"
                    to="/admin/reports_products"
                    label="Product Report"
                    isActive={activeTab === 'reports_products'}
                    onClick={() => setActiveTab('reports_products')}
                  />
                  <NavSubItem
                    id="nav-report-inventory"
                    to="/admin/reports_inventory"
                    label="Inventory Report"
                    isActive={activeTab === 'reports_inventory'}
                    onClick={() => setActiveTab('reports_inventory')}
                  />
                  <NavSubItem
                    id="nav-report-customers"
                    to="/admin/reports_customers"
                    label="Customer Report"
                    isActive={activeTab === 'reports_customers'}
                    onClick={() => setActiveTab('reports_customers')}
                  />
                  <NavSubItem
                    id="nav-report-payments"
                    to="/admin/reports_payments"
                    label="Payment Report"
                    isActive={activeTab === 'reports_payments'}
                    onClick={() => setActiveTab('reports_payments')}
                  />
                  <NavSubItem
                    id="nav-report-coupons"
                    to="/admin/reports_coupons"
                    label="Coupon / Discount Report"
                    isActive={activeTab === 'reports_coupons'}
                    onClick={() => setActiveTab('reports_coupons')}
                  />
                </NavGroup>
              )}

              {/* Analytics */}
              {showAnalytics && (
                <NavItem
                  id="nav-analytics"
                  to="/admin/analytics"
                  icon={Megaphone}
                  label="Analytics"
                  isActive={activeTab === 'analytics'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('analytics');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('analytics', 'Analytics', Megaphone, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}
            </div>
          )}

          {/* ================= SECTION 9: SYSTEM & CONFIGURATION ================= */}
          {showSettingsSection && (
            <div className="space-y-1">
              <NavSectionHeader title="SYSTEM & CONFIGURATION" isCollapsed={isCollapsed} />

              {/* Store Settings (Collapsible) */}
              {showStoreSettingsGroup && (
                <NavGroup
                  id="nav-store-settings-group"
                  icon={Settings}
                  label="Store Settings"
                  isGroupActive={isParentActive([
                    'store_settings',
                    'settings_store_info',
                    'settings_tax',
                    'settings_currency',
                    'settings_shipping',
                    'settings_payment_methods',
                    'settings_notifications',
                  ])}
                  isExpanded={expandedMenus.store_settings}
                  isCollapsed={isCollapsed}
                  onToggle={(e) => {
                    if (isCollapsed) {
                      handleItemMouseEnter('store_settings', 'Store Settings', Settings, e, permittedStoreSettingsSubItems);
                    } else {
                      toggleSubmenu('store_settings');
                    }
                  }}
                  onMouseEnter={(e) =>
                    handleItemMouseEnter('store_settings', 'Store Settings', Settings, e, permittedStoreSettingsSubItems)
                  }
                  onMouseLeave={handleItemMouseLeave}
                >
                  <NavSubItem
                    id="nav-setting-store-info"
                    to="/admin/settings_store_info"
                    label="Store Information"
                    isActive={activeTab === 'settings_store_info' || activeTab === 'store_settings'}
                    onClick={() => setActiveTab('settings_store_info')}
                  />
                  <NavSubItem
                    id="nav-setting-tax"
                    to="/admin/settings_tax"
                    label="Tax"
                    isActive={activeTab === 'settings_tax'}
                    onClick={() => setActiveTab('settings_tax')}
                  />
                  <NavSubItem
                    id="nav-setting-currency"
                    to="/admin/settings_currency"
                    label="Currency"
                    isActive={activeTab === 'settings_currency'}
                    onClick={() => setActiveTab('settings_currency')}
                  />
                  <NavSubItem
                    id="nav-setting-shipping"
                    to="/admin/settings_shipping"
                    label="Shipping"
                    isActive={activeTab === 'settings_shipping'}
                    onClick={() => setActiveTab('settings_shipping')}
                  />
                  <NavSubItem
                    id="nav-setting-payment-methods"
                    to="/admin/settings_payment_methods"
                    label="Payment Methods"
                    isActive={activeTab === 'settings_payment_methods'}
                    onClick={() => setActiveTab('settings_payment_methods')}
                  />
                  <NavSubItem
                    id="nav-setting-notifications"
                    to="/admin/settings_notifications"
                    label="Notification Settings"
                    isActive={activeTab === 'settings_notifications'}
                    onClick={() => setActiveTab('settings_notifications')}
                  />
                </NavGroup>
              )}

              {/* Payment Gateways */}
              {showPaymentGateways && (
                <NavItem
                  id="nav-payment-gateways"
                  to="/admin/payment-gateways"
                  icon={CreditCard}
                  label="Payment Gateways"
                  isActive={activeTab === 'payment_gateways' || activeTab === 'payment-gateways'}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setActiveTab('payment-gateways');
                    setFlyout(null);
                  }}
                  onMouseEnter={(e) => handleItemMouseEnter('payment-gateways', 'Payment Gateways', CreditCard, e)}
                  onMouseLeave={handleItemMouseLeave}
                />
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Footer: User Identity Status */}
      <SidebarUserProfile
        currentUser={currentUser}
        currentRole={currentRole}
        isCollapsed={isCollapsed}
        onNavigateRoles={() => setActiveTab('roles')}
        onLogout={onLogout}
      />

      {/* Floating Absolute / Portal Dropdown Menu when Collapsed */}
      {isCollapsed &&
        flyout &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id="sidebar-collapsed-dropdown-flyout"
            style={{ top: `${flyout.top}px` }}
            onMouseEnter={() => {
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
              }
            }}
            onMouseLeave={handleItemMouseLeave}
            className="fixed left-[88px] z-50 bg-[#0B0F19] border border-slate-700/90 rounded-xl shadow-2xl ring-1 ring-white/10 p-2 min-w-56 max-w-72 select-none before:content-[''] before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-3"
          >
            <div className="absolute -left-1.5 top-3.5 w-3 h-3 bg-[#0B0F19] border-l border-b border-slate-700 rotate-45 pointer-events-none" />

            <div className="relative px-2.5 py-1.5 pb-2 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <flyout.icon className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-bold text-xs text-white truncate">{flyout.title}</span>
              </div>
              {flyout.badge && <div className="shrink-0">{flyout.badge}</div>}
            </div>

            {flyout.items && flyout.items.length > 0 ? (
              <div className="relative mt-1.5 space-y-0.5 max-h-[calc(100vh-140px)] overflow-y-auto sidebar-scrollbar">
                {flyout.items.map((subItem) => {
                  const isItemActive =
                    activeTab === subItem.id ||
                    (subItem.id === 'reports_sales' && activeTab === 'reports') ||
                    (subItem.id === 'settings_store_info' && activeTab === 'store_settings');
                  return (
                    <Link
                      key={subItem.id}
                      to={subItem.to || `/admin/${subItem.id}`}
                      onClick={() => {
                        setActiveTab(subItem.id);
                        setFlyout(null);
                      }}
                      className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        isItemActive
                          ? 'text-white font-semibold bg-indigo-600 shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={isItemActive ? 'text-white' : 'text-slate-500 font-bold'}>•</span>
                        <span className="truncate">{subItem.label}</span>
                      </div>
                      {subItem.badge && <div className="shrink-0 ml-2">{subItem.badge}</div>}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="relative mt-1 px-2.5 py-1 text-[11px] text-slate-400">Click to open</div>
            )}
          </div>,
          document.body
        )}
    </aside>
  );
};
