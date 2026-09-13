import React from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Layers,
  ShoppingCart,
  TicketPercent,
  LineChart,
  ShieldCheck,
  Users,
  FileClock } from
'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNavItem } from './sidebar/SidebarNavItem';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';






export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { metrics, currentRole, currentUser } = useAdmin();

  const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: null
  },
  {
    id: 'products',
    label: 'Products & Inventory',
    icon: Package,
    badge: metrics.lowStockCount > 0 ? `${metrics.lowStockCount} alert` : null,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: 'add_product',
    label: 'Add Product',
    icon: PlusCircle,
    badge: 'New',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    id: 'categories',
    label: 'Categories & Taxonomy',
    icon: Layers,
    badge: `${metrics.totalCategoriesCount} tiers`,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'orders',
    label: 'Order Tracking',
    icon: ShoppingCart,
    badge: metrics.totalOrders > 0 ? `${metrics.totalOrders}` : null,
    badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-200'
  },
  {
    id: 'coupons',
    label: 'Discount Coupons',
    icon: TicketPercent,
    badge: `${metrics.activeCouponsCount} active`,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'analytics',
    label: 'User Analytics',
    icon: LineChart,
    badge: null
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    badge: 'Users',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    id: 'roles',
    label: 'Roles & Permissions',
    icon: ShieldCheck,
    badge: 'RBAC',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    id: 'audit',
    label: 'Audit Activity Logs',
    icon: FileClock,
    badge: null
  }];


  return (
    <aside className="w-64 flex-shrink-0 bg-zinc-900 text-zinc-300 flex flex-col justify-between border-r border-zinc-800 h-screen sticky top-0 overflow-hidden select-none z-40">
      {/* Brand & Workspace */}
      <div className="flex flex-col min-h-0 flex-1">
        <SidebarHeader />

        {/* Navigation items */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1 overscroll-contain">
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Operations & Catalog
          </div>
          {navItems.map((item) =>
          <SidebarNavItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            badge={item.badge}
            badgeColor={item.badgeColor}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)} />

          )}
        </nav>
      </div>

      {/* Footer: User Identity status */}
      <SidebarUserProfile
        currentUser={currentUser}
        currentRole={currentRole}
        onNavigateRoles={() => setActiveTab('roles')} />
      
    </aside>);

};