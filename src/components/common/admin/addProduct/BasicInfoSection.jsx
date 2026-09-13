import React from 'react';
import { Type, Sparkles, HelpCircle } from 'lucide-react';














export const BasicInfoSection = ({
  title,
  setTitle,
  brand,
  setBrand,
  barcode,
  setBarcode,
  description,
  setDescription,
  tags,
  setTags
}) => {
  const [tagInput, setTagInput] = React.useState('');

  const handleAddTag = (e) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-zinc-700" />
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            General Information
          </h2>
        </div>
        <span className="text-[11px] text-zinc-400 font-medium">Core Identifiers</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Product Title */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-zinc-800">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-zinc-400">{title.length}/100 chars</span>
          </div>
          <input
            type="text"
            required
            id="input-product-title"
            placeholder="e.g. Apex Pro Wireless Noise Cancelling Headphones"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
          
        </div>

        {/* Brand and Barcode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Brand / Manufacturer
            </label>
            <input
              type="text"
              id="input-product-brand"
              placeholder="e.g. Sony, Apple, Nike, Herman Miller"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
            
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Barcode (UPC / EAN / ISBN)
            </label>
            <input
              type="text"
              id="input-product-barcode"
              placeholder="e.g. 012345678905"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg font-mono text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
            
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-zinc-800">
              Product Description
            </label>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Markdown supported
            </div>
          </div>
          <textarea
            id="input-product-description"
            rows={4}
            placeholder="Describe key product benefits, build materials, audio specs, ergonomic fit, or packaging contents..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white leading-relaxed" />
          
        </div>

        {/* Product Tags */}
        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Search & Filter Tags
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              id="input-product-tag"
              placeholder="Add tag (e.g. wireless, anc, bestseller) and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="flex-1 px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
            
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">
              
              Add
            </button>
          </div>

          {tags.length > 0 &&
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {tags.map((tag) =>
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium bg-zinc-100 text-zinc-800 rounded-md border border-zinc-200">
              
                  #{tag}
                  <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-zinc-400 hover:text-zinc-700 ml-0.5">
                
                    ×
                  </button>
                </span>
            )}
            </div>
          }
        </div>
      </div>
    </div>);

};