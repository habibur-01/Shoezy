import React, { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Award,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const CustomersView = ({
  initialTab = 'all',
  onNavigateToAnalytics,
}) => {
  const { customers } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState(initialTab);

  const tiers = ['all', 'VIP', 'Regular', 'New', 'At-Risk'];

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'all' || c.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalSpentAll / Math.max(1, customers.reduce((sum, c) => sum + c.ordersCount, 0));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Customer Relationship Management</h1>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              Customers & CRM
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Audit customer lifetime value (LTV), buying velocity, geographic clusters, and VIP loyalty tiers.
          </p>
        </div>

        {/* Sub-tabs: All Customers vs Customer Analytics */}
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'all' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            All Customers ({customers.length})
          </button>
          <button
            onClick={() => {
              if (onNavigateToAnalytics) onNavigateToAnalytics();
              else setActiveSubTab('analytics');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'analytics' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Cohort Analytics
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">Total Registered Profiles</span>
          <div className="text-2xl font-bold font-mono text-zinc-900 mt-1">{customers.length}</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Active retail buyers</p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">Combined Customer LTV</span>
          <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">
            ${totalSpentAll.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">All-time store spend</p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">Average Order Value (AOV)</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            ${avgOrderValue.toFixed(2)}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Per order basket size</p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">VIP Tier Ratio</span>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {Math.round((customers.filter((c) => c.tier === 'VIP').length / customers.length) * 100)}%
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">High-frequency recurring</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search customer name, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer capitalize ${
                selectedTier === tier
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {tier === 'all' ? 'All Tiers' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Customer Name & Email</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Tier Status</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4 text-right">Last Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-900">{c.name}</div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-zinc-400" />
                      {c.email}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-zinc-700">
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span>
                        {c.city}, {c.country}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.tier === 'VIP'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : c.tier === 'Regular'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : c.tier === 'New'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {c.tier}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-zinc-900">
                    {c.ordersCount} orders
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                    ${c.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-zinc-500">
                    {c.lastOrderDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
