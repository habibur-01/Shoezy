import React from 'react';
import { X } from 'lucide-react';




























export const ProductQuickModal = ({
  isOpen,
  onClose,
  editingProduct,
  formTitle,
  setFormTitle,
  formSku,
  setFormSku,
  formCategory,
  setFormCategory,
  formPrice,
  setFormPrice,
  formCost,
  setFormCost,
  formStock,
  setFormStock,
  formThreshold,
  setFormThreshold,
  formImage,
  setFormImage,
  formStatus,
  setFormStatus,
  categories,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              {editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
            </h3>
            <p className="text-xs text-zinc-500">
              Configure item pricing, SKU identifier, and stock limits
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md cursor-pointer">
            
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">Product Title</label>
            <input
              id="form-product-title"
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Ergonomic Bluetooth Mechanical Keyboard"
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
            
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">SKU Code</label>
              <input
                id="form-product-sku"
                type="text"
                required
                value={formSku}
                onChange={(e) => setFormSku(e.target.value)}
                placeholder="SKU-1001"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
              
            </div>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Category</label>
              <select
                id="form-product-category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden cursor-pointer">
                
                {categories.
                filter((c) => c !== 'All').
                map((cat) =>
                <option key={cat} value={cat}>
                      {cat}
                    </option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Retail Price ($)</label>
              <input
                id="form-product-price"
                type="number"
                step="0.01"
                required
                min="0"
                value={formPrice}
                onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
              
            </div>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Unit Cost ($)</label>
              <input
                id="form-product-cost"
                type="number"
                step="0.01"
                required
                min="0"
                value={formCost}
                onChange={(e) => setFormCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
              
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Initial Stock Quantity</label>
              <input
                id="form-product-stock"
                type="number"
                required
                min="0"
                value={formStock}
                onChange={(e) => setFormStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
              
            </div>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Low Stock Threshold</label>
              <input
                id="form-product-threshold"
                type="number"
                required
                min="1"
                value={formThreshold}
                onChange={(e) => setFormThreshold(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
              
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Image URL</label>
            <input
              id="form-product-image"
              type="url"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
            
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Publication Status</label>
            <div className="flex items-center gap-4">
              {['active', 'draft', 'archived'].map((status) =>
              <label key={status} className="flex items-center gap-1.5 capitalize cursor-pointer">
                  <input
                  type="radio"
                  name="product-status"
                  value={status}
                  checked={formStatus === status}
                  onChange={() => setFormStatus(status)}
                  className="text-zinc-900 focus:ring-zinc-900 cursor-pointer" />
                
                  {status}
                </label>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg font-medium transition-colors cursor-pointer">
              
              Cancel
            </button>
            <button
              id="btn-submit-product-form"
              type="submit"
              className="px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer">
              
              {editingProduct ? 'Save Product Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>);

};