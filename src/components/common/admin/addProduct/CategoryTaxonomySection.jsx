import React from 'react';
import { Layers, ChevronRight, Folder, Tag, Plus, ExternalLink } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';











export const CategoryTaxonomySection = ({
  category,
  setCategory,
  subCategory,
  setSubCategory,
  childCategory,
  setChildCategory,
  onNavigateToTaxonomy
}) => {
  const { categories } = useAdmin();

  // Selected Category Object
  const selectedCatObj = categories.find((c) => c.name === category) || categories[0];

  // Available Subcategories
  const availableSubCategories = selectedCatObj?.subCategories || [];

  // Selected Subcategory Object
  const selectedSubObj =
  availableSubCategories.find((s) => s.name === subCategory) || availableSubCategories[0];

  // Available Child Categories
  const availableChildCategories = selectedSubObj?.childCategories || [];

  const handleCategoryChange = (catName) => {
    setCategory(catName);
    const catObj = categories.find((c) => c.name === catName);
    const firstSub = catObj?.subCategories?.[0]?.name || '';
    setSubCategory(firstSub);

    const subObj = catObj?.subCategories?.[0];
    const firstChild = subObj?.childCategories?.[0]?.name || '';
    setChildCategory(firstChild);
  };

  const handleSubCategoryChange = (subName) => {
    setSubCategory(subName);
    const subObj = availableSubCategories.find((s) => s.name === subName);
    const firstChild = subObj?.childCategories?.[0]?.name || '';
    setChildCategory(firstChild);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Category & 3-Tier Taxonomy
          </h2>
        </div>
        {onNavigateToTaxonomy &&
        <button
          type="button"
          onClick={onNavigateToTaxonomy}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
          
            Manage Hierarchy
            <ExternalLink className="w-3 h-3" />
          </button>
        }
      </div>

      <div className="p-5 space-y-4">
        {/* Visual Path Breadcrumb */}
        <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-lg flex items-center gap-1.5 flex-wrap text-xs">
          <span className="font-semibold text-zinc-400">Assigned Path:</span>
          <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">
            {category || 'Select Category'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
            {subCategory || 'Select Subcategory'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 font-medium">
            {childCategory || 'Select Child Category'}
          </span>
        </div>

        {/* 3 Select Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Level 1 Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              1. Master Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="select-product-category"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white">
              
              {categories.map((cat) =>
              <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              )}
            </select>
          </div>

          {/* Level 2 Subcategory */}
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              2. Subcategory <span className="text-rose-500">*</span>
            </label>
            <select
              id="select-product-subcategory"
              value={subCategory}
              onChange={(e) => handleSubCategoryChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white">
              
              {availableSubCategories.map((sub) =>
              <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              )}
            </select>
          </div>

          {/* Level 3 Child Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              3. Child Category
            </label>
            <select
              id="select-product-childcategory"
              value={childCategory}
              onChange={(e) => setChildCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white">
              
              <option value="">None / General</option>
              {availableChildCategories.map((child) =>
              <option key={child.id} value={child.name}>
                  {child.name}
                </option>
              )}
            </select>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500">
          Categorizing your product properly improves search ranking, faceted store filters, and customer discovery.
        </p>
      </div>
    </div>);

};