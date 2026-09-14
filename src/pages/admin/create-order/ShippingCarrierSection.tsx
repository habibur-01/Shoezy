import React, { useState } from 'react';
import {
  Truck,
  PlusCircle,
  Clock,
  Barcode,
  Sparkles,
  Check,
  DollarSign,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ShippingCarrierOption } from '../../types';
import { AddCustomCarrierModal } from './AddCustomCarrierModal';

interface ShippingCarrierSectionProps {
  carrier: string;
  setCarrier: (name: string) => void;
  shippingRate: number;
  setShippingRate: (rate: number) => void;
  trackingNumber: string;
  setTrackingNumber: (tracking: string) => void;
}

export const ShippingCarrierSection: React.FC<ShippingCarrierSectionProps> = ({
  carrier,
  setCarrier,
  shippingRate,
  setShippingRate,
  trackingNumber,
  setTrackingNumber,
}) => {
  const { shippingCarriers, addShippingCarrier } = useAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSelectCarrier = (c: ShippingCarrierOption) => {
    setCarrier(c.name);
    setShippingRate(c.baseRate);
    if (!trackingNumber) {
      const prefix = c.trackingPrefix || 'TRK-';
      const num = Math.floor(100000000 + Math.random() * 900000000);
      setTrackingNumber(`${prefix}${num}`);
    }
  };

  const handleGenerateTracking = () => {
    const activeCarrier = shippingCarriers.find((c) => c.name === carrier);
    const prefix = activeCarrier?.trackingPrefix || 'TRK-';
    const num = Math.floor(100000000 + Math.random() * 900000000);
    setTrackingNumber(`${prefix}${num}`);
  };

  const handleAddCarrierSuccess = (newCarrierData: Omit<ShippingCarrierOption, 'id'>) => {
    addShippingCarrier(newCarrierData);
    setCarrier(newCarrierData.name);
    setShippingRate(newCarrierData.baseRate);
    const prefix = newCarrierData.trackingPrefix || 'TRK-';
    const num = Math.floor(100000000 + Math.random() * 900000000);
    setTrackingNumber(`${prefix}${num}`);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-zinc-500" />
            <span>6. Shipping Carrier & Delivery Logistics</span>
            <span className="text-[11px] font-normal text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
              Fulfillment Routing
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Select an existing logistics partner or configure a custom shipping carrier.
          </p>
        </div>

        <button
          type="button"
          id="btn-open-add-carrier-modal"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
          + Add New Carrier
        </button>
      </div>

      {/* Carriers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {shippingCarriers.map((c) => {
          const isSelected = carrier === c.name;

          return (
            <button
              key={c.id}
              type="button"
              id={`btn-carrier-${c.id}`}
              onClick={() => handleSelectCarrier(c)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40'
                  : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/70 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    {c.name}
                    {c.isCustom && (
                      <span className="text-[9px] font-normal bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                        Custom
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-zinc-500 truncate mb-2">
                  {c.serviceType}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100/80 text-[11px]">
                <span className="flex items-center gap-1 text-zinc-500">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  {c.estimatedDays}
                </span>
                <span className="font-mono font-bold text-zinc-900">
                  ${c.baseRate.toFixed(2)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Shipping Fee Override & Tracking Number Inputs */}
      <div className="p-3.5 bg-zinc-50/70 border border-zinc-200/80 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Fee Override */}
        <div>
          <label
            htmlFor="input-shipping-rate"
            className="block text-xs font-medium text-zinc-700 mb-1 flex items-center justify-between"
          >
            <span>Shipping Charge to Customer ($)</span>
            <button
              type="button"
              onClick={() => setShippingRate(0)}
              className="text-[11px] text-indigo-600 hover:underline cursor-pointer"
            >
              Set Free Shipping ($0.00)
            </button>
          </label>
          <div className="relative">
            <DollarSign className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              id="input-shipping-rate"
              type="number"
              step="0.01"
              min="0"
              value={shippingRate}
              onChange={(e) =>
                setShippingRate(Math.max(0, parseFloat(e.target.value) || 0))
              }
              className="w-full text-xs pl-7 pr-3 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-zinc-800"
            />
          </div>
        </div>

        {/* Tracking Number */}
        <div>
          <label
            htmlFor="input-tracking-number"
            className="block text-xs font-medium text-zinc-700 mb-1 flex items-center justify-between"
          >
            <span>Tracking Number / Air Waybill</span>
            <button
              type="button"
              onClick={handleGenerateTracking}
              className="text-[11px] text-indigo-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Generate
            </button>
          </label>
          <div className="relative">
            <Barcode className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              id="input-tracking-number"
              type="text"
              placeholder="e.g., FDX-982341908 or leave blank if pending"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono uppercase text-zinc-800"
            />
          </div>
        </div>
      </div>

      {/* Add Custom Carrier Modal */}
      <AddCustomCarrierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCarrier={handleAddCarrierSuccess}
      />
    </div>
  );
};
