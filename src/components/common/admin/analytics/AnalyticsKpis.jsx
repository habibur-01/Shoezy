import React from 'react';
import { ShoppingBag, TrendingUp, DollarSign, Award, Users } from 'lucide-react';









export const AnalyticsKpis = ({
  averageOrderValue,
  avgCustomerLtv,
  vipPercent,
  vipCount,
  repeatPurchaseRate = '71.4%'
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span className="text-xs font-medium">Average Order Value (AOV)</span>
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <ShoppingBag className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-bold text-zinc-900">${averageOrderValue.toFixed(2)}</div>
        <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium mt-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+8.4%</span>
          <span className="text-zinc-400 font-normal">vs store benchmark</span>
        </div>
      </div>

      <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span className="text-xs font-medium">Customer Lifetime Value (LTV)</span>
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <DollarSign className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-bold text-zinc-900">${avgCustomerLtv.toFixed(2)}</div>
        <div className="text-xs text-zinc-500 mt-1">Calculated across cohorts</div>
      </div>

      <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span className="text-xs font-medium">VIP Tier Concentration</span>
          <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <Award className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-bold text-zinc-900">{vipPercent}%</div>
        <div className="text-xs text-amber-700 font-medium mt-1">{vipCount} High-Value VIP shoppers</div>
      </div>

      <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span className="text-xs font-medium">Repeat Purchase Rate</span>
          <span className="p-1.5 rounded-lg bg-violet-50 text-violet-700">
            <Users className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-bold text-zinc-900">{repeatPurchaseRate}</div>
        <div className="text-xs text-zinc-500 mt-1">High customer brand loyalty</div>
      </div>
    </div>);

};