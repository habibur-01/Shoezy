import React from 'react';
import { Search, Globe } from 'lucide-react';








export const SeoSection = ({
  title,
  description,
  sku,
  category
}) => {
  const generatedSlug = (title || 'product-title').
  toLowerCase().
  replace(/[^a-z0-9]+/g, '-').
  replace(/(^-|-$)+/g, '');

  const metaTitle = title ? `${title} | CommerceHQ Store` : 'Product Title | CommerceHQ Store';
  const metaDesc = description ?
  description.slice(0, 155) + (description.length > 155 ? '...' : '') :
  'Shop the latest authentic collections with free shipping and guaranteed warranty. Browse specifications and customer reviews online today.';

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-600" />
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Search Engine Optimization (SEO) Preview
          </h2>
        </div>
        <span className="text-[11px] text-zinc-400 font-medium">SERP Listing</span>
      </div>

      <div className="p-5 space-y-4">
        {/* SERP Preview Box */}
        <div className="p-4 bg-zinc-50/90 border border-zinc-200 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
            <span>https://shop.commercehq.io</span>
            <span>›</span>
            <span>products</span>
            <span>›</span>
            <span className="text-zinc-800 font-semibold">{generatedSlug}</span>
          </div>
          <div className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer">
            {metaTitle}
          </div>
          <div className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
            {metaDesc}
          </div>
        </div>

        <p className="text-[11px] text-zinc-400">
          This preview demonstrates how your listing will appear across Google Search, Bing, and social sharing open-graph cards.
        </p>
      </div>
    </div>);

};