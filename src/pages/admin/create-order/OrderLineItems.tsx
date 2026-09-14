import React, { useState } from 'react';
import {
  Trash2,
  Gift,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { OrderItem } from '../../types';
import { useAdmin } from '../../context/AdminContext';

interface OrderLineItemsProps {
  items: OrderItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onUpdatePrice: (index: number, newPrice: number) => void;
  onToggleGift: (index: number) => void;
  onUpdateGiftMessage: (index: number, message: string) => void;
  onRemoveItem: (index: number) => void;
  onAddCustomItem: (item: OrderItem) => void;
}

export const OrderLineItems: React.FC<OrderLineItemsProps> = ({
  items,
  onUpdateQuantity,
  onUpdatePrice,
  onToggleGift,
  onUpdateGiftMessage,
  onRemoveItem,
  onAddCustomItem,
}) => {
  const { products } = useAdmin();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customPrice, setCustomPrice] = useState('25.00');
  const [customQty, setCustomQty] = useState('1');
  const [customIsGift, setCustomIsGift] = useState(false);

  const handleCreateCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const priceNum = Math.max(0, parseFloat(customPrice) || 0);
    const qtyNum = Math.max(1, parseInt(customQty, 10) || 1);

    const newItem: OrderItem = {
      productId: `custom_${Date.now()}`,
      title: customTitle.trim(),
      price: customIsGift ? 0 : priceNum,
      originalPrice: priceNum,
      quantity: qtyNum,
      sku: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      isGift: customIsGift,
      giftMessage: customIsGift ? 'Custom Gift Package' : undefined,
    };

    onAddCustomItem(newItem);
    setCustomTitle('');
    setCustomPrice('25.00');
    setCustomQty('1');
    setCustomIsGift(false);
    setShowCustomModal(false);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <span>4. Order Line Items & Gifts</span>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full">
              {items.length} item{items.length === 1 ? '' : 's'}
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Adjust item quantities, apply negotiated rates, or flag specific items as gifts.
          </p>
        </div>

        <button
          type="button"
          id="btn-open-custom-item-modal"
          onClick={() => setShowCustomModal(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          + Add Bespoke / Custom Fee
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-10 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
          <ShoppingBag className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          <p className="text-xs font-medium text-zinc-700">No items added to this order yet</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Use the inventory catalog above to add products or social gifts.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const catalogProd = products.find((p) => p.id === item.productId);
            const isStockExceeded =
              catalogProd && item.quantity > catalogProd.stock;

            return (
              <div
                key={`${item.productId}-${item.isGift ? 'gift' : 'reg'}-${index}`}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.isGift
                    ? 'bg-purple-50/40 border-purple-200/80'
                    : 'bg-white border-zinc-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Item Image & Title */}
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover border border-zinc-200 bg-zinc-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 flex-shrink-0">
                        {item.isGift ? (
                          <Gift className="w-5 h-5 text-purple-600" />
                        ) : (
                          <Tag className="w-5 h-5" />
                        )}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-semibold text-zinc-900 truncate">
                          {item.title}
                        </h4>
                        {item.isGift && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full border border-purple-200">
                            <Gift className="w-3 h-3" /> Free Gift ($0.00)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <span className="font-mono text-zinc-600">{item.sku}</span>
                        {catalogProd && (
                          <>
                            <span>•</span>
                            <span
                              className={
                                isStockExceeded
                                  ? 'text-rose-600 font-bold'
                                  : 'text-zinc-500'
                              }
                            >
                              Available: {catalogProd.stock}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper, Price & Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                    {/* Price editor (staff can override for deals) */}
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-zinc-400">Unit Price</span>
                      {item.isGift ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-purple-700 font-mono">
                            $0.00
                          </span>
                          {item.originalPrice && (
                            <span className="text-[10px] text-zinc-400 line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="relative flex items-center">
                          <span className="absolute left-1.5 text-xs text-zinc-400 font-mono">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.price}
                            onChange={(e) =>
                              onUpdatePrice(
                                index,
                                Math.max(0, parseFloat(e.target.value) || 0)
                              )
                            }
                            className="w-20 pl-4 pr-1 py-1 text-xs font-mono font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-md text-right focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      )}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="p-1.5 text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-zinc-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="p-1.5 text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="w-16 text-right font-mono text-xs font-bold text-zinc-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Toggle Gift Status */}
                    <button
                      type="button"
                      onClick={() => onToggleGift(index)}
                      className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                        item.isGift
                          ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                          : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200'
                      }`}
                      title={
                        item.isGift
                          ? 'Change to regular paid item'
                          : 'Mark item as Complimentary Gift ($0.00)'
                      }
                    >
                      <Gift className="w-3.5 h-3.5" />
                    </button>

                    {/* Remove Item */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Overstock Warning */}
                {isStockExceeded && (
                  <div className="mt-2 text-[11px] text-rose-600 flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                    <AlertCircle className="w-3 h-3" />
                    <span>
                      Order quantity ({item.quantity}) exceeds warehouse stock ({catalogProd.stock}).
                      Backorder will be created automatically upon dispatch.
                    </span>
                  </div>
                )}

                {/* Gift Note per item if gift */}
                {item.isGift && (
                  <div className="mt-2.5 pt-2 border-t border-purple-100 flex items-center gap-2">
                    <Gift className="w-3 h-3 text-purple-600 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Special gift packaging tag (e.g., 'Free trial sample with compliments')..."
                      value={item.giftMessage || ''}
                      onChange={(e) => onUpdateGiftMessage(index, e.target.value)}
                      className="w-full text-xs px-2.5 py-1 bg-white border border-purple-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 text-purple-900 placeholder-purple-300"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bespoke / Custom Line Item Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-xl shadow-xl w-full max-w-md p-5">
            <h3 className="text-sm font-bold text-zinc-900 mb-1">
              Add Bespoke Line Item or Service Fee
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Add custom products, expedited packing fees, or bespoke items not currently in the catalog.
            </p>

            <form onSubmit={handleCreateCustomItem} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Item Description / Fee Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Custom Monogramming & Engraving"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={customQty}
                    onChange={(e) => setCustomQty(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="checkbox-custom-is-gift"
                  type="checkbox"
                  checked={customIsGift}
                  onChange={(e) => setCustomIsGift(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label
                  htmlFor="checkbox-custom-is-gift"
                  className="text-xs text-zinc-700 cursor-pointer"
                >
                  Mark as complimentary promotional gift ($0.00 charge)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs cursor-pointer"
                >
                  Add Custom Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
