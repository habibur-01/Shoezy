import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LayoutDashboard, Package, Layers, Tag, Boxes, ShoppingCart, CreditCard, Users, Star, TicketPercent, Percent, Gift, FileText, Image as ImageIcon, LayoutGrid, Menu, ImagePlus, ShieldCheck, FileClock, BarChart3, Settings, ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight, Megaphone, } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';
const productSubItems = [
    { id: 'products', label: 'All Products' },
    { id: 'add_product', label: 'Add Product' },
    {
        id: 'product_variants',
        label: 'Product Variants',
        badge: (<span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
        New
      </span>),
    },
];
const orderSubItems = [
    { id: 'orders', label: 'All Orders' },
    { id: 'create_order', label: 'Create Order' },
    { id: 'returns_refunds', label: 'Returns & Refunds' },
];
const customerSubItems = [
    { id: 'customers', label: 'All Customers' },
    { id: 'customer_analytics', label: 'Customer Analytics' },
];
const reportSubItems = [
    { id: 'reports_sales', label: 'Sales Report' },
    { id: 'reports_orders', label: 'Order Report' },
    { id: 'reports_products', label: 'Product Report' },
    { id: 'reports_inventory', label: 'Inventory Report' },
    { id: 'reports_customers', label: 'Customer Report' },
    { id: 'reports_payments', label: 'Payment Report' },
    { id: 'reports_coupons', label: 'Coupon / Discount Report' },
];
const storeSettingsSubItems = [
    { id: 'settings_store_info', label: 'Store Information' },
    { id: 'settings_tax', label: 'Tax' },
    { id: 'settings_currency', label: 'Currency' },
    { id: 'settings_shipping', label: 'Shipping' },
    { id: 'settings_payment_methods', label: 'Payment Methods' },
    { id: 'settings_notifications', label: 'Notification Settings' },
];
const NavItem = ({ id, icon: Icon, label, isActive, isCollapsed, badge, onClick, onMouseEnter, onMouseLeave, }) => {
    return (<button id={id} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={`w-full h-10 flex items-center px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer relative overflow-hidden shrink-0 ${isActive
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
      {/* Fixed Icon container: isolated from label and badge, NEVER gets squashed or clipped */}
      <div className="w-7 h-7 flex items-center justify-center shrink-0">
        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}/>
      </div>

      {/* Label and Badge Container: smoothly vanishes right-to-left when collapsed */}
      <div className={`flex items-center justify-between min-w-0 transition-all duration-500 ease-in-out ${isCollapsed
            ? 'opacity-0 pointer-events-none max-w-0 ml-0 -translate-x-3 overflow-hidden'
            : 'opacity-100 max-w-full flex-1 ml-3 translate-x-0'}`}>
        <span className="truncate whitespace-nowrap">{label}</span>
        {badge && <div className="shrink-0 ml-2">{badge}</div>}
      </div>
    </button>);
};
const NavGroup = ({ id, icon: Icon, label, isGroupActive, isExpanded, isCollapsed, badge, onToggle, onMouseEnter, onMouseLeave, children, }) => {
    return (<div className="shrink-0">
      <div id={id} onClick={onToggle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={`w-full h-10 flex items-center px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer relative overflow-hidden ${isGroupActive
            ? 'text-white bg-slate-800/60'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}`}>
        {/* Fixed Icon container: isolated from label and chevron, NEVER gets squashed */}
        <div className="w-7 h-7 flex items-center justify-center shrink-0">
          <Icon className={`w-5 h-5 shrink-0 ${isGroupActive ? 'text-white' : 'text-slate-400'}`}/>
        </div>

        {/* Label, Badge, and Chevron - smoothly vanishes right-to-left */}
        <div className={`flex items-center justify-between min-w-0 transition-all duration-500 ease-in-out ${isCollapsed
            ? 'opacity-0 pointer-events-none max-w-0 ml-0 -translate-x-3 overflow-hidden'
            : 'opacity-100 max-w-full flex-1 ml-3 translate-x-0'}`}>
          <span className="truncate whitespace-nowrap">{label}</span>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {badge}
            <div className="text-slate-400 hover:text-white p-0.5">
              {isExpanded ? (<ChevronDown className="w-3.5 h-3.5"/>) : (<ChevronRight className="w-3.5 h-3.5"/>)}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Submenu - only rendered when expanded and not collapsed */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${!isCollapsed && isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0 hidden'}`}>
        <div className="space-y-0.5 pl-6 pr-1">{children}</div>
      </div>
    </div>);
};
const NavSubItem = ({ id, label, isActive, badge, onClick }) => {
    return (<button id={id} onClick={onClick} className={`w-full flex items-center justify-between py-1.5 px-3 rounded-md text-xs transition-colors cursor-pointer ${isActive ? 'text-white font-semibold bg-slate-800/80' : 'text-slate-400 hover:text-white'}`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-slate-400 font-bold">•</span>
        <span className="truncate">{label}</span>
      </div>
      {badge}
    </button>);
};
const NavSectionHeader = ({ title, isCollapsed, }) => (<div className={`px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out ${isCollapsed ? 'hidden' : 'h-6 pt-2 pb-1 opacity-100'}`}>
    {title}
  </div>);
// --- Primary Sidebar Component ---
export const Sidebar = ({ activeTab, setActiveTab, isCollapsed: externalIsCollapsed, setIsCollapsed: externalSetIsCollapsed, }) => {
    const { metrics, currentRole, currentUser, logout } = useAdmin();
    // Collapsed state
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const isCollapsed = externalIsCollapsed ?? internalCollapsed;
    const toggleCollapse = () => {
        if (externalSetIsCollapsed) {
            externalSetIsCollapsed(!isCollapsed);
        }
        else {
            setInternalCollapsed(!isCollapsed);
        }
    };
    // Expanded sub-menus: default to Products, Reports, and Store Settings expanded
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
    const handleItemMouseEnter = (key, title, icon, e, items, badge) => {
        if (!isCollapsed)
            return;
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const itemCount = items?.length || 0;
        const approxHeight = itemCount > 0 ? 56 + itemCount * 36 : 42;
        const maxTop = window.innerHeight - approxHeight - 16;
        const safeTop = Math.max(12, Math.min(rect.top, maxTop));
        setFlyout({
            key,
            title,
            top: safeTop,
            icon,
            badge,
            items,
        });
    };
    const handleItemMouseLeave = () => {
        if (!isCollapsed)
            return;
        closeTimeoutRef.current = setTimeout(() => {
            setFlyout(null);
        }, 200);
    };
    const toggleSubmenu = (menuKey, e) => {
        if (e)
            e.stopPropagation();
        setExpandedMenus((prev) => ({
            ...prev,
            [menuKey]: !prev[menuKey],
        }));
    };
    // Helper to check if any child of a menu group is active
    const isParentActive = (childrenIds) => childrenIds.includes(activeTab);
    return (<aside className={`relative ${isCollapsed ? 'w-[70px]' : 'w-72'} transition-[width] duration-500 ease-in-out flex-shrink-0 bg-[#0B0F19] text-slate-300 flex flex-col justify-between border-r border-slate-800/80 h-screen sticky top-0 z-40 select-none`}>
      {/* Toggle Button:
            - When expanded: sits INSIDE the header on the right (right: 14px), exactly like the original UI.
            - When collapsed: glides smoothly to the right border (right: -14px) so it sits half inside, half outside.
            - Styling: previous rounded-lg box with ChevronsLeft / ChevronsRight icons.
            - Duration: 500ms slow and smooth. */}
      <button id="sidebar-collapse-toggle-btn" onClick={toggleCollapse} style={{
            right: isCollapsed ? '-14px' : '14px',
        }} className="absolute top-4.5 z-50 p-1.5 rounded-lg border border-slate-700/80 bg-slate-900/95 hover:bg-slate-800 text-slate-400 hover:text-white shadow-lg transition-all duration-500 ease-in-out cursor-pointer flex items-center justify-center shrink-0" title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {isCollapsed ? (<ChevronsRight className="w-4 h-4"/>) : (<ChevronsLeft className="w-4 h-4"/>)}
      </button>

      {/* Inner wrapper with overflow-hidden to cleanly clip children while width collapses */}
      <div className="flex flex-col min-h-0 flex-1 overflow-hidden w-full">
        {/* Brand Header */}
        <SidebarHeader isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse}/>

        {/* Scrollable Navigation Menu - scrollbar hidden to ensure icons are 100% visible with no overlapping */}
        <nav onScroll={() => setFlyout(null)} className={`p-2.5 overflow-y-auto overflow-x-hidden flex-1 overscroll-contain text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isCollapsed ? 'space-y-1' : 'space-y-3.5'} transition-all duration-500`}>
          {/* ================= SECTION 1: OVERVIEW ================= */}
          <div className="space-y-1">
            <NavSectionHeader title="OVERVIEW" isCollapsed={isCollapsed}/>
            <NavItem id="nav-dashboard" icon={LayoutDashboard} label="Dashboard" isActive={activeTab === 'dashboard'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('dashboard');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('dashboard', 'Dashboard', LayoutDashboard, e)} onMouseLeave={handleItemMouseLeave}/>
          </div>

          {/* ================= SECTION 2: CATALOG ================= */}
          <div className="space-y-1">
            <NavSectionHeader title="CATALOG" isCollapsed={isCollapsed}/>

            {/* Products (Collapsible) */}
            <NavGroup id="nav-products-group" icon={Package} label="Products" isGroupActive={['products', 'add_product', 'product_variants'].includes(activeTab)} isExpanded={expandedMenus.products} isCollapsed={isCollapsed} onToggle={(e) => {
            if (isCollapsed) {
                handleItemMouseEnter('products', 'Products', Package, e, productSubItems);
            }
            else {
                toggleSubmenu('products');
            }
        }} onMouseEnter={(e) => handleItemMouseEnter('products', 'Products', Package, e, productSubItems)} onMouseLeave={handleItemMouseLeave}>
              <NavSubItem id="nav-all-products" label="All Products" isActive={activeTab === 'products'} onClick={() => setActiveTab('products')}/>
              <NavSubItem id="nav-add-product" label="Add Product" isActive={activeTab === 'add_product'} onClick={() => setActiveTab('add_product')}/>
              <NavSubItem id="nav-product-variants" label="Product Variants" isActive={activeTab === 'product_variants'} badge={<span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    New
                  </span>} onClick={() => setActiveTab('product_variants')}/>
            </NavGroup>

            {/* Categories */}
            <NavItem id="nav-categories" icon={Layers} label="Categories" isActive={activeTab === 'categories'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('categories');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('categories', 'Categories', Layers, e)} onMouseLeave={handleItemMouseLeave}/>

            {/* Brands */}
            <NavItem id="nav-brands" icon={Tag} label="Brands" isActive={activeTab === 'brands'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('brands');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('brands', 'Brands', Tag, e)} onMouseLeave={handleItemMouseLeave}/>

            {/* Inventory */}
            <NavItem id="nav-inventory" icon={Boxes} label="Inventory" isActive={activeTab === 'inventory'} isCollapsed={isCollapsed} badge={<span className="bg-rose-950/90 text-rose-300 border border-rose-800/80 text-[10px] font-medium px-2 py-0.5 rounded-full">
                  Low Stock {metrics.lowStockCount || 3}
                </span>} onClick={() => {
            setActiveTab('inventory');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('inventory', 'Inventory', Boxes, e, undefined, <span className="bg-rose-950/90 text-rose-300 border border-rose-800/80 text-[10px] font-medium px-2 py-0.5 rounded-full">
                    Low Stock {metrics.lowStockCount || 3}
                  </span>)} onMouseLeave={handleItemMouseLeave}/>
          </div>

          {/* ================= SECTION 3: SALES & ORDERS ================= */}
          <div className="space-y-1">
            <NavSectionHeader title="SALES & ORDERS" isCollapsed={isCollapsed}/>

            {/* Orders (Collapsible) */}
            <NavGroup id="nav-orders-group" icon={ShoppingCart} label="Orders" isGroupActive={['orders', 'create_order', 'returns_refunds'].includes(activeTab)} isExpanded={expandedMenus.orders} isCollapsed={isCollapsed} badge={<span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                  5
                </span>} onToggle={(e) => {
            if (isCollapsed) {
                handleItemMouseEnter('orders', 'Orders', ShoppingCart, e, orderSubItems, <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                      5
                    </span>);
            }
            else {
                toggleSubmenu('orders');
            }
        }} onMouseEnter={(e) => handleItemMouseEnter('orders', 'Orders', ShoppingCart, e, orderSubItems, <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                    5
                  </span>)} onMouseLeave={handleItemMouseLeave}>
              <NavSubItem id="nav-all-orders" label="All Orders" isActive={activeTab === 'orders'} badge={<span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                    5
                  </span>} onClick={() => setActiveTab('orders')}/>
              <NavSubItem id="nav-create-order" label="Create Order" isActive={activeTab === 'create_order'} onClick={() => setActiveTab('create_order')}/>
              <NavSubItem id="nav-returns-refunds" label="Returns & Refunds" isActive={activeTab === 'returns_refunds'} onClick={() => setActiveTab('returns_refunds')}/>
            </NavGroup>

            {/* Transactions */}
            <NavItem id="nav-transactions" icon={CreditCard} label="Transactions" isActive={activeTab === 'transactions'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('transactions');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('transactions', 'Transactions', CreditCard, e)} onMouseLeave={handleItemMouseLeave}/>
          </div>

          {/* ================= SECTION 4: CUSTOMERS ================= */}
          <div className="space-y-1">
            <NavSectionHeader title="CUSTOMERS" isCollapsed={isCollapsed}/>

            {/* Customers (Collapsible) */}
            <NavGroup id="nav-customers-group" icon={Users} label="Customers" isGroupActive={['customers', 'customer_analytics'].includes(activeTab)} isExpanded={expandedMenus.customers} isCollapsed={isCollapsed} onToggle={(e) => {
            if (isCollapsed) {
                handleItemMouseEnter('customers', 'Customers', Users, e, customerSubItems);
            }
            else {
                toggleSubmenu('customers');
            }
        }} onMouseEnter={(e) => handleItemMouseEnter('customers', 'Customers', Users, e, customerSubItems)} onMouseLeave={handleItemMouseLeave}>
              <NavSubItem id="nav-all-customers" label="All Customers" isActive={activeTab === 'customers'} onClick={() => setActiveTab('customers')}/>
              <NavSubItem id="nav-customer-analytics" label="Customer Analytics" isActive={activeTab === 'customer_analytics'} onClick={() => setActiveTab('customer_analytics')}/>
            </NavGroup>

            {/* Reviews */}
            <NavItem id="nav-reviews" icon={Star} label="Reviews" isActive={activeTab === 'reviews'} isCollapsed={isCollapsed} badge={<span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                  8
                </span>} onClick={() => {
            setActiveTab('reviews');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('reviews', 'Reviews', Star, e, undefined, <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                    8
                  </span>)} onMouseLeave={handleItemMouseLeave}/>
          </div>

          {/* ================= SECTION 5: PROMOTIONS & MARKETING ================= */}
          <div className="space-y-1">
            <NavSectionHeader title="PROMOTIONS & MARKETING" isCollapsed={isCollapsed}/>

            {/* Coupons */}
            <NavItem id="nav-coupons" icon={TicketPercent} label="Coupons" isActive={activeTab === 'coupons'} isCollapsed={isCollapsed} badge={<span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                  4
                </span>} onClick={() => {
            setActiveTab('coupons');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('coupons', 'Coupons', TicketPercent, e, undefined, <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                    4
                  </span>)} onMouseLeave={handleItemMouseLeave}/>

            {/* Discounts & Offers */}
            <NavItem id="nav-discounts-offers" icon={Percent} label="Discounts & Offers" isActive={activeTab === 'discounts_offers'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('discounts_offers');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('discounts_offers', 'Discounts & Offers', Percent, e)} onMouseLeave={handleItemMouseLeave}/>

            {/* Campaigns */}
            <NavItem id="nav-campaigns" icon={Gift} label="Campaigns" isActive={activeTab === 'campaigns'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('campaigns');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('campaigns', 'Campaigns', Gift, e)} onMouseLeave={handleItemMouseLeave}/>
          </div>

          {/* ================= SECTION 6: CONTENT (CMS) ================= */}
          <div className="space-y-1">
            <NavSectionHeader title="CONTENT (CMS)" isCollapsed={isCollapsed}/>

            <NavItem id="nav-cms-pages" icon={FileText} label="Pages" isActive={activeTab === 'cms_pages'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('cms_pages');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('cms_pages', 'Pages', FileText, e)} onMouseLeave={handleItemMouseLeave}/>

            <NavItem id="nav-cms-banners" icon={ImageIcon} label="Banners" isActive={activeTab === 'cms_banners'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('cms_banners');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('cms_banners', 'Banners', ImageIcon, e)} onMouseLeave={handleItemMouseLeave}/>

            <NavItem id="nav-cms-homepage-sections" icon={LayoutGrid} label="Homepage Sections" isActive={activeTab === 'cms_homepage_sections'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('cms_homepage_sections');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('cms_homepage_sections', 'Homepage Sections', LayoutGrid, e)} onMouseLeave={handleItemMouseLeave}/>

            <NavItem id="nav-cms-navigation" icon={Menu} label="Navigation / Menus" isActive={activeTab === 'cms_navigation'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('cms_navigation');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('cms_navigation', 'Navigation / Menus', Menu, e)} onMouseLeave={handleItemMouseLeave}/>

            <NavItem id="nav-cms-media" icon={ImagePlus} label="Media Library" isActive={activeTab === 'cms_media'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('cms_media');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('cms_media', 'Media Library', ImagePlus, e)} onMouseLeave={handleItemMouseLeave}/>
          </div>

          {/* ================= SECTION 7: USER MANAGEMENT ================= */}
          <div className="space-y-1">
            <NavSectionHeader title="USER MANAGEMENT" isCollapsed={isCollapsed}/>

            <NavItem id="nav-staff-admins" icon={Users} label="Staff & Admins" isActive={activeTab === 'staff_admins'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('staff_admins');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('staff_admins', 'Staff & Admins', Users, e)} onMouseLeave={handleItemMouseLeave}/>

            <NavItem id="nav-roles" icon={ShieldCheck} label="Roles & Permissions" isActive={activeTab === 'roles'} isCollapsed={isCollapsed} badge={<span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs">
                  RBAC
                </span>} onClick={() => {
            setActiveTab('roles');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('roles', 'Roles & Permissions', ShieldCheck, e, undefined, <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs">
                    RBAC
                  </span>)} onMouseLeave={handleItemMouseLeave}/>

            <NavItem id="nav-audit" icon={FileClock} label="Audit Logs" isActive={activeTab === 'audit'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('audit');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('audit', 'Audit Logs', FileClock, e)} onMouseLeave={handleItemMouseLeave}/>
          </div>

          {/* ================= SECTION 8: ANALYTICS & INSIGHTS ================= */}
          <div className="space-y-1">
            <NavSectionHeader title="ANALYTICS & INSIGHTS" isCollapsed={isCollapsed}/>

            {/* Reports (Collapsible) */}
            <NavGroup id="nav-reports-group" icon={BarChart3} label="Reports" isGroupActive={isParentActive([
            'reports',
            'reports_sales',
            'reports_orders',
            'reports_products',
            'reports_inventory',
            'reports_customers',
            'reports_payments',
            'reports_coupons',
        ])} isExpanded={expandedMenus.reports} isCollapsed={isCollapsed} onToggle={(e) => {
            if (isCollapsed) {
                handleItemMouseEnter('reports', 'Reports', BarChart3, e, reportSubItems);
            }
            else {
                toggleSubmenu('reports');
                if (!isParentActive([
                    'reports',
                    'reports_sales',
                    'reports_orders',
                    'reports_products',
                    'reports_inventory',
                    'reports_customers',
                    'reports_payments',
                    'reports_coupons',
                ])) {
                    setActiveTab('reports_sales');
                }
            }
        }} onMouseEnter={(e) => handleItemMouseEnter('reports', 'Reports', BarChart3, e, reportSubItems)} onMouseLeave={handleItemMouseLeave}>
              <NavSubItem id="nav-report-sales" label="Sales Report" isActive={activeTab === 'reports_sales' || activeTab === 'reports'} onClick={() => setActiveTab('reports_sales')}/>
              <NavSubItem id="nav-report-orders" label="Order Report" isActive={activeTab === 'reports_orders'} onClick={() => setActiveTab('reports_orders')}/>
              <NavSubItem id="nav-report-products" label="Product Report" isActive={activeTab === 'reports_products'} onClick={() => setActiveTab('reports_products')}/>
              <NavSubItem id="nav-report-inventory" label="Inventory Report" isActive={activeTab === 'reports_inventory'} onClick={() => setActiveTab('reports_inventory')}/>
              <NavSubItem id="nav-report-customers" label="Customer Report" isActive={activeTab === 'reports_customers'} onClick={() => setActiveTab('reports_customers')}/>
              <NavSubItem id="nav-report-payments" label="Payment Report" isActive={activeTab === 'reports_payments'} onClick={() => setActiveTab('reports_payments')}/>
              <NavSubItem id="nav-report-coupons" label="Coupon / Discount Report" isActive={activeTab === 'reports_coupons'} onClick={() => setActiveTab('reports_coupons')}/>
            </NavGroup>

            {/* Analytics */}
            <NavItem id="nav-analytics" icon={Megaphone} label="Analytics" isActive={activeTab === 'analytics'} isCollapsed={isCollapsed} onClick={() => {
            setActiveTab('analytics');
            setFlyout(null);
        }} onMouseEnter={(e) => handleItemMouseEnter('analytics', 'Analytics', Megaphone, e)} onMouseLeave={handleItemMouseLeave}/>
          </div>

          {/* ================= SECTION 9: SYSTEM & CONFIGURATION ================= */}
          <div className="space-y-1">
            <NavSectionHeader title="SYSTEM & CONFIGURATION" isCollapsed={isCollapsed}/>

            {/* Store Settings (Collapsible) */}
            <NavGroup id="nav-store-settings-group" icon={Settings} label="Store Settings" isGroupActive={isParentActive([
            'store_settings',
            'settings_store_info',
            'settings_tax',
            'settings_currency',
            'settings_shipping',
            'settings_payment_methods',
            'settings_notifications',
        ])} isExpanded={expandedMenus.store_settings} isCollapsed={isCollapsed} onToggle={(e) => {
            if (isCollapsed) {
                handleItemMouseEnter('store_settings', 'Store Settings', Settings, e, storeSettingsSubItems);
            }
            else {
                toggleSubmenu('store_settings');
            }
        }} onMouseEnter={(e) => handleItemMouseEnter('store_settings', 'Store Settings', Settings, e, storeSettingsSubItems)} onMouseLeave={handleItemMouseLeave}>
              <NavSubItem id="nav-setting-store-info" label="Store Information" isActive={activeTab === 'settings_store_info' || activeTab === 'store_settings'} onClick={() => setActiveTab('settings_store_info')}/>
              <NavSubItem id="nav-setting-tax" label="Tax" isActive={activeTab === 'settings_tax'} onClick={() => setActiveTab('settings_tax')}/>
              <NavSubItem id="nav-setting-currency" label="Currency" isActive={activeTab === 'settings_currency'} onClick={() => setActiveTab('settings_currency')}/>
              <NavSubItem id="nav-setting-shipping" label="Shipping" isActive={activeTab === 'settings_shipping'} onClick={() => setActiveTab('settings_shipping')}/>
              <NavSubItem id="nav-setting-payment-methods" label="Payment Methods" isActive={activeTab === 'settings_payment_methods'} onClick={() => setActiveTab('settings_payment_methods')}/>
              <NavSubItem id="nav-setting-notifications" label="Notification Settings" isActive={activeTab === 'settings_notifications'} onClick={() => setActiveTab('settings_notifications')}/>
            </NavGroup>
          </div>
        </nav>
      </div>

      {/* Footer: User Identity Status */}
      <SidebarUserProfile currentUser={currentUser} currentRole={currentRole} isCollapsed={isCollapsed} onNavigateRoles={() => setActiveTab('roles')} onLogout={logout}/>

      {/* Floating Absolute / Portal Dropdown Menu when Collapsed */}
      {isCollapsed && flyout && typeof document !== 'undefined' &&
            createPortal(<div id="sidebar-collapsed-dropdown-flyout" style={{ top: `${flyout.top}px` }} onMouseEnter={() => {
                    if (closeTimeoutRef.current) {
                        clearTimeout(closeTimeoutRef.current);
                        closeTimeoutRef.current = null;
                    }
                }} onMouseLeave={handleItemMouseLeave} className="fixed left-[88px] z-50 bg-[#0B0F19] border border-slate-700/90 rounded-xl shadow-2xl ring-1 ring-white/10 p-2 min-w-56 max-w-72 select-none before:content-[''] before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-3">
            {/* Left triangle pointer indicator */}
            <div className="absolute -left-1.5 top-3.5 w-3 h-3 bg-[#0B0F19] border-l border-b border-slate-700 rotate-45 pointer-events-none"/>

            {/* Header */}
            <div className="relative px-2.5 py-1.5 pb-2 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <flyout.icon className="w-4 h-4 text-indigo-400 shrink-0"/>
                <span className="font-bold text-xs text-white truncate">{flyout.title}</span>
              </div>
              {flyout.badge && <div className="shrink-0">{flyout.badge}</div>}
            </div>

            {/* Submenu Dropdown Items */}
            {flyout.items && flyout.items.length > 0 ? (<div className="relative mt-1.5 space-y-0.5 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                {flyout.items.map((subItem) => {
                        const isItemActive = activeTab === subItem.id ||
                            (subItem.id === 'reports_sales' && activeTab === 'reports') ||
                            (subItem.id === 'settings_store_info' && activeTab === 'store_settings');
                        return (<button key={subItem.id} onClick={() => {
                                setActiveTab(subItem.id);
                                setFlyout(null);
                            }} className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${isItemActive
                                ? 'text-white font-semibold bg-indigo-600 shadow-xs'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={isItemActive ? 'text-white' : 'text-slate-500 font-bold'}>•</span>
                        <span className="truncate">{subItem.label}</span>
                      </div>
                      {subItem.badge && <div className="shrink-0 ml-2">{subItem.badge}</div>}
                    </button>);
                    })}
              </div>) : (<div className="relative mt-1 px-2.5 py-1 text-[11px] text-slate-400">
                Click to open
              </div>)}
          </div>, document.body)}
    </aside>);
};
