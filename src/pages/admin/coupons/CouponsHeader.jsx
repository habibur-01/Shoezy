import React from 'react';
import { Sparkles } from 'lucide-react';





export const CouponsHeader = ({ onOpenGenerator }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Custom Discount Coupon Generation
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Architect custom promotional incentives, configure usage limits, and track redemption yield
        </p>
      </div>

      <button
        id="btn-open-coupon-generator"
        onClick={onOpenGenerator}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer">
        
        <Sparkles className="w-4 h-4 text-indigo-200" />
        Generate Custom Coupon
      </button>
    </div>);

};