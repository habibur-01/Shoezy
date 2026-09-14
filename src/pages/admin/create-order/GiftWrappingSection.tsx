import React from 'react';
import { Gift, Heart, Sparkles, FileText, Check } from 'lucide-react';

interface GiftWrappingSectionProps {
  isGiftOrder: boolean;
  setIsGiftOrder: (val: boolean) => void;
  giftMessage: string;
  setGiftMessage: (val: string) => void;
  giftWrapping: boolean;
  setGiftWrapping: (val: boolean) => void;
  hideInvoicePrices: boolean;
  setHideInvoicePrices: (val: boolean) => void;
}

export const GiftWrappingSection: React.FC<GiftWrappingSectionProps> = ({
  isGiftOrder,
  setIsGiftOrder,
  giftMessage,
  setGiftMessage,
  giftWrapping,
  setGiftWrapping,
  hideInvoicePrices,
  setHideInvoicePrices,
}) => {
  return (
    <div
      className={`border rounded-xl p-5 shadow-2xs transition-all ${
        isGiftOrder
          ? 'bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 border-purple-200'
          : 'bg-white border-zinc-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <Gift className={`w-4 h-4 ${isGiftOrder ? 'text-purple-600' : 'text-zinc-500'}`} />
            <span>5. Gift Order & Custom Greeting Packaging</span>
            {isGiftOrder && (
              <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                Gift Active
              </span>
            )}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure gift packaging, include custom personalized cards, and conceal pricing slips.
          </p>
        </div>

        {/* Master Gift Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            id="toggle-is-gift-order"
            checked={isGiftOrder}
            onChange={(e) => setIsGiftOrder(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
          <span className="ml-2 text-xs font-semibold text-zinc-800">
            {isGiftOrder ? 'Order is a Gift' : 'Enable Gift Options'}
          </span>
        </label>
      </div>

      {isGiftOrder ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Packaging Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGiftWrapping(!giftWrapping)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                giftWrapping
                  ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400/20'
                  : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  giftWrapping
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900">
                    Luxury Gift Wrap & Satin Ribbon
                  </span>
                  {giftWrapping && <Check className="w-3.5 h-3.5 text-purple-700" />}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Pre-wrapped in textured matte paper with embossed seal.
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold text-purple-700">
                  Complimentary Social Promo ($0.00)
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setHideInvoicePrices(!hideInvoicePrices)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                hideInvoicePrices
                  ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400/20'
                  : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  hideInvoicePrices
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900">
                    Omit Pricing on Packing Slip
                  </span>
                  {hideInvoicePrices && <Check className="w-3.5 h-3.5 text-purple-700" />}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Generates a blind gift receipt showing item titles without dollar amounts.
                </p>
                <span className="inline-block mt-1 text-[10px] font-medium text-zinc-400">
                  Recommended for surprise deliveries
                </span>
              </div>
            </button>
          </div>

          {/* Gift Card Message */}
          <div>
            <label
              htmlFor="textarea-gift-message"
              className="block text-xs font-medium text-zinc-700 mb-1 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Personalized Greeting Card Inscription
              </span>
              <span className="text-[11px] text-zinc-400 font-normal">
                {giftMessage.length}/250 characters
              </span>
            </label>
            <div className="relative">
              <textarea
                id="textarea-gift-message"
                rows={3}
                maxLength={250}
                placeholder="e.g., Dearest Sophia, Wishing you the happiest birthday! Hope you adore this gift as much as I loved picking it out for you. With all our love, Mark & Sarah"
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-zinc-800 placeholder-zinc-400"
              />
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[11px] text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
              <Gift className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                This inscription will be printed onto an archival ivory cardstock card tucked into the packaging.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-200/80 text-zinc-500 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-700">Standard retail dispatch</p>
              <p className="text-[11px] text-zinc-400">
                Standard commercial packing slip with item costs included.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsGiftOrder(true)}
            className="text-xs font-semibold text-purple-700 hover:text-purple-800 hover:underline cursor-pointer"
          >
            + Add Gift Packaging
          </button>
        </div>
      )}
    </div>
  );
};
