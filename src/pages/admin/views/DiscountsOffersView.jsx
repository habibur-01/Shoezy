import React, { useState } from 'react';
import {
  Percent,
  Plus,
  Search,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const INITIAL_OFFERS = [
  {
    id: 'off_01',
    name: 'Autumn Artisan Kitchen Flash Sale',
    type: 'percentage',
    discountValue: '25% OFF',
    targetCategory: 'Artisan Coffee & Kitchenware',
    startDate: '2026-09-01',
    endDate: '2026-09-20',
    status: 'active',
    minSpend: 80,
    bannerHeadline: 'Elevate your morning brew routine with 25% off all artisan carafes and grinders',
  },
  {
    id: 'off_02',
    name: 'Audiophile Bundle & Save Deal',
    type: 'bundle',
    discountValue: '$60 OFF',
    targetCategory: 'Consumer Electronics & Audio',
    startDate: '2026-09-05',
    endDate: '2026-09-30',
    status: 'active',
    minSpend: 300,
    bannerHeadline: 'Pair any wireless studio headphone with a desktop amp for instant $60 checkout credit',
  },
  {
    id: 'off_03',
    name: 'Weekend BOGO Organic Tees',
    type: 'bogo',
    discountValue: 'Buy 1 Get 1 50%',
    targetCategory: 'Apparel & Leather Goods',
    startDate: '2026-09-12',
    endDate: '2026-09-15',
    status: 'active',
    bannerHeadline: 'Mix & match any two heavyweight organic cotton tees and save 50% on the second item',
  },
  {
    id: 'off_04',
    name: 'Holiday Pre-Order Titanium Gear',
    type: 'percentage',
    discountValue: '15% OFF',
    targetCategory: 'Lifestyle & Hydration',
    startDate: '2026-10-01',
    endDate: '2026-10-15',
    status: 'scheduled',
    minSpend: 100,
    bannerHeadline: 'Reserve aerospace-grade titanium hydration bottles before seasonal holiday rush',
  },
];

export const DiscountsOffersView = () => {
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = offers.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.targetCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.bannerHeadline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Special Discounts & Store Offers</h1>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-500" /> Flash Sales
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure automatic bundle promotions, tier-based quantity discounts, and site-wide promotional banners.
          </p>
        </div>
      </div>

      {/* Grid of Offers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((offer) => (
          <div
            key={offer.id}
            className="p-5 bg-white border border-zinc-200 rounded-xl shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-lg font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                  {offer.discountValue}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    offer.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {offer.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-zinc-900 mt-2">{offer.name}</h3>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{offer.bannerHeadline}</p>

              <div className="mt-4 p-3 bg-zinc-50 rounded-lg space-y-1.5 text-xs text-zinc-600 border border-zinc-100">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Target Category:</span>
                  <span className="font-semibold text-zinc-800">{offer.targetCategory}</span>
                </div>
                {offer.minSpend && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Minimum Cart Spend:</span>
                    <span className="font-semibold text-zinc-800">${offer.minSpend}.00</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-400">Duration:</span>
                  <span className="font-mono text-zinc-800 text-[11px]">
                    {offer.startDate} to {offer.endDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-zinc-400 text-[11px]">Auto-applied at checkout</span>
              <button className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer">
                Edit Promotion
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
