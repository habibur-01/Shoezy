import React from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';

import { renderCategoryIcon } from './categoryIcons';


























export const CategoryModal = ({
  isOpen,
  onClose,
  modalMode,
  modalTier,
  setModalTier,
  categories,
  activeCategory,
  targetParentCatId,
  setTargetParentCatId,
  targetParentSubCatId,
  setTargetParentSubCatId,
  formName,
  formSlug,
  formDescription,
  formStatus,
  formIcon,
  setFormSlug,
  setFormDescription,
  setFormStatus,
  setFormIcon,
  onNameChange,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              {modalMode === 'create' ? 'Add Taxonomy Node' : 'Edit Taxonomy Node'}
            </h3>
            <p className="text-xs text-zinc-500">
              {modalTier === 'category' && 'Level 1: Top-level catalog master category'}
              {modalTier === 'subcategory' && 'Level 2: Subcategory assigned to a master category'}
              {modalTier === 'child' && 'Level 3: Specific child category for leaf item organization'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200/60 cursor-pointer">
            
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Tier Selector Pills (When in Create mode) */}
          {modalMode === 'create' &&
          <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Select Hierarchy Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                type="button"
                onClick={() => {
                  setModalTier('category');
                  setTargetParentCatId('');
                  setTargetParentSubCatId('');
                }}
                className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                modalTier === 'category' ?
                'border-indigo-600 bg-indigo-50/60 text-indigo-900' :
                'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`
                }>
                
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  Level 1: Category
                </button>
                <button
                type="button"
                onClick={() => {
                  setModalTier('subcategory');
                  setTargetParentCatId(activeCategory?.id || categories[0]?.id || '');
                  setTargetParentSubCatId('');
                }}
                className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                modalTier === 'subcategory' ?
                'border-emerald-600 bg-emerald-50/60 text-emerald-900' :
                'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`
                }>
                
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Level 2: Subcategory
                </button>
                <button
                type="button"
                onClick={() => {
                  setModalTier('child');
                  const catId = activeCategory?.id || categories[0]?.id || '';
                  setTargetParentCatId(catId);
                  const cObj = categories.find((c) => c.id === catId);
                  setTargetParentSubCatId(cObj?.subCategories?.[0]?.id || '');
                }}
                className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                modalTier === 'child' ?
                'border-amber-600 bg-amber-50/60 text-amber-900' :
                'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`
                }>
                
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  Level 3: Child Node
                </button>
              </div>
            </div>
          }

          {/* Parent Category Selector (If Subcategory or Child) */}
          {(modalTier === 'subcategory' || modalTier === 'child') && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Parent Master Category (Level 1) <span className="text-rose-500">*</span>
              </label>
              {categories.length === 0 ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  ⚠️ No master category found! You must create a main category (e.g. Men, Women, Kids) first before you can add a subcategory or child category.
                </div>
              ) : (
                <select
                  value={targetParentCatId}
                  required
                  onChange={(e) => {
                    const newCatId = e.target.value;
                    setTargetParentCatId(newCatId);
                    const cObj = categories.find((c) => c.id === newCatId || c._id === newCatId);
                    const subs = cObj?.subCategories || cObj?.subcategories || [];
                    setTargetParentSubCatId(subs[0]?.id || subs[0]?._id || '');
                  }}
                  disabled={modalMode === 'edit'}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 disabled:opacity-60"
                >
                  <option value="">-- Select Master Category (e.g. Men, Women, Kids) * --</option>
                  {categories.map((c) => (
                    <option key={c.id || c._id} value={c.id || c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Parent Subcategory Selector (If Child) */}
          {modalTier === 'child' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Parent Subcategory (Level 2) <span className="text-rose-500">*</span>
              </label>
              {!targetParentCatId ? (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  Please select a Master Category above first to see its available subcategories.
                </div>
              ) : (
                (() => {
                  const parentCat = categories.find((c) => c.id === targetParentCatId || c._id === targetParentCatId);
                  const availableSubs = parentCat?.subCategories || parentCat?.subcategories || [];
                  if (availableSubs.length === 0) {
                    return (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                        ⚠️ No subcategories exist under &ldquo;{parentCat?.name}&rdquo; yet. Please add a subcategory (Level 2: e.g. Shoe, Apparel) first before adding a child category!
                      </div>
                    );
                  }
                  return (
                    <select
                      value={targetParentSubCatId}
                      required
                      onChange={(e) => setTargetParentSubCatId(e.target.value)}
                      disabled={modalMode === 'edit'}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 disabled:opacity-60"
                    >
                      <option value="">-- Select Subcategory (e.g. Shoe, Apparel) * --</option>
                      {availableSubs.map((s) => (
                        <option key={s.id || s._id} value={s.id || s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  );
                })()
              )}
            </div>
          )}

          {/* Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Wireless Headphones"
                value={formName}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
              
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                placeholder="e.g. wireless-headphones"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg font-mono text-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
              
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Description / Merchandising Guidance
            </label>
            <textarea
              rows={2}
              placeholder="Optional brief description for taxonomy and customer navigation..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
            
          </div>

          {/* Level 1 Icon Picker */}
          {modalTier === 'category' &&
          <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Category Icon
              </label>
              <div className="flex items-center gap-2">
                {[
              { id: 'Cpu', label: 'Tech / Audio' },
              { id: 'Home', label: 'Home / Living' },
              { id: 'Shirt', label: 'Apparel' },
              { id: 'Sparkles', label: 'Lifestyle' }].
              map((ico) =>
              <button
                key={ico.id}
                type="button"
                onClick={() => setFormIcon(ico.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                formIcon === ico.id ?
                'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-2xs' :
                'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`
                }>
                
                    {renderCategoryIcon(ico.id)}
                    {ico.label}
                  </button>
              )}
              </div>
            </div>
          }

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Publish Status
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formStatus === 'active'}
                  onChange={() => setFormStatus('active')}
                  className="text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active (Visible in store)
                </span>
              </label>
              <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formStatus === 'inactive'}
                  onChange={() => setFormStatus('inactive')}
                  className="text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                
                <span className="flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-zinc-400" /> Inactive (Hidden draft)
                </span>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer">
              
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                modalMode === 'create' && (
                  (modalTier === 'subcategory' && (!targetParentCatId || categories.length === 0)) ||
                  (modalTier === 'child' && (!targetParentCatId || !targetParentSubCatId))
                )
              }
              className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
              {modalMode === 'create' ? 'Create Node' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>);

};