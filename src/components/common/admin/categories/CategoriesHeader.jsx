import React from 'react';
import { SlidersHorizontal, FolderTree, Plus, ChevronDown } from 'lucide-react';










export const CategoriesHeader = ({
  viewMode,
  setViewMode,
  onOpenCreateModal,
  activeCategory,
  activeSubCategory
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Category & Taxonomy Architecture</h1>
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
            3-Tier Hierarchy
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          Manage your store&apos;s complete catalog structure: Categories, Subcategories, and Child Categories on a single page
        </p>
      </div>

      {/* Global Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-zinc-100 border border-zinc-200 rounded-lg text-xs">
          <button
            id="btn-view-columns"
            onClick={() => setViewMode('columns')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            viewMode === 'columns' ?
            'bg-white text-zinc-900 shadow-xs' :
            'text-zinc-600 hover:text-zinc-900'}`
            }>
            
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Cascading Columns
          </button>
          <button
            id="btn-view-tree"
            onClick={() => setViewMode('tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            viewMode === 'tree' ?
            'bg-white text-zinc-900 shadow-xs' :
            'text-zinc-600 hover:text-zinc-900'}`
            }>
            
            <FolderTree className="w-3.5 h-3.5" />
            Interactive Tree
          </button>
        </div>

        {/* "+ Add" Dropdown Menu */}
        <div className="relative group">
          <button
            id="btn-add-taxonomy-node"
            onClick={() => onOpenCreateModal('category')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition-colors">
            
            <Plus className="w-4 h-4" />
            Add Category Node
            <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-70" />
          </button>
          <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg p-1.5 hidden group-hover:block z-30">
            <button
              id="btn-menu-add-cat"
              onClick={() => onOpenCreateModal('category')}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg text-left cursor-pointer">
              
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              Add Category (Level 1)
            </button>
            <button
              id="btn-menu-add-sub"
              onClick={() => onOpenCreateModal('subcategory', activeCategory?.id)}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg text-left cursor-pointer">
              
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Add Subcategory (Level 2)
            </button>
            <button
              id="btn-menu-add-child"
              onClick={() => onOpenCreateModal('child', activeCategory?.id, activeSubCategory?.id)}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg text-left cursor-pointer">
              
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              Add Child Category (Level 3)
            </button>
          </div>
        </div>
      </div>
    </div>);

};