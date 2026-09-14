import React, { useState } from 'react';
import { Truck, X, PlusCircle } from 'lucide-react';
import { ShippingCarrierOption } from '../../types';

interface AddCustomCarrierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCarrier: (carrier: Omit<ShippingCarrierOption, 'id'>) => void;
}

export const AddCustomCarrierModal: React.FC<AddCustomCarrierModalProps> = ({
  isOpen,
  onClose,
  onAddCarrier,
}) => {
  const [carrierName, setCarrierName] = useState('');
  const [serviceType, setServiceType] = useState('Standard Expedited Parcel');
  const [estimatedDays, setEstimatedDays] = useState('2-3 business days');
  const [baseRate, setBaseRate] = useState('15.00');
  const [trackingPrefix, setTrackingPrefix] = useState('TRK-');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrierName.trim()) return;

    onAddCarrier({
      name: carrierName.trim(),
      serviceType: serviceType.trim() || 'Custom Parcel Service',
      estimatedDays: estimatedDays.trim() || '2-4 business days',
      baseRate: Math.max(0, parseFloat(baseRate) || 0),
      trackingPrefix: trackingPrefix.trim().toUpperCase() || 'TRK-',
      isCustom: true,
    });

    onClose();
    setCarrierName('');
    setServiceType('Standard Expedited Parcel');
    setEstimatedDays('2-3 business days');
    setBaseRate('15.00');
    setTrackingPrefix('TRK-');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Add New Shipping Carrier</h3>
              <p className="text-[11px] text-zinc-500">
                Register a new regional or specialized parcel carrier
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Carrier / Courier Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Sendle, Aramex, Ninja Van, Local Courier..."
              value={carrierName}
              onChange={(e) => setCarrierName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800"
              autoFocus
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Service Tier / Class</label>
            <input
              type="text"
              placeholder="e.g., Metro Express Same-Day or Carbon-Neutral Standard"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Base Shipping Rate ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={baseRate}
                onChange={(e) => setBaseRate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-zinc-800"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Estimated Delivery Days</label>
              <input
                type="text"
                placeholder="e.g., 1-2 business days"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Tracking Number Prefix <span className="text-zinc-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., SND-, ARX-"
              value={trackingPrefix}
              onChange={(e) => setTrackingPrefix(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-zinc-800 uppercase"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Save & Select Carrier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
