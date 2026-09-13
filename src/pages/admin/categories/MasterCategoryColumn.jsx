import React from 'react';
import { Plus, Search, Edit2, Trash2, ChevronRight } from 'lucide-react';

import { renderCategoryIcon } from './categoryIcons';












export const MasterCategoryColumn = ({
  categories,
  selectedCatId,
  catSearch,
  setCatSearch,
  onSelectCategory,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteCategory
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs flex flex-col overflow-hidden">
      {/* Column Header */}
      <div className="p-3.5 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            1. Categories ({categories.length})
          </h2>
        </div>
        <button
          id="btn-add-cat-col"
          onClick={() => onOpenCreateModal('category')}
          className="p-1 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
          title="Add Category">
          
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Column Search */}
      <div className="p-2.5 border-b border-zinc-100">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter categories..."
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:bg-white" />
          
        </div>
      </div>

      {/* Column List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[500px]">
        {categories.
        filter((cat) => cat.name.toLowerCase().includes(catSearch.toLowerCase())).
        map((cat) => {
          const isSelected = cat.id === selectedCatId;
          const totalSubs = cat.subCategories?.length || 0;
          const totalChildren = (cat.subCategories || []).reduce(
            (sum, s) => sum + (s.childCategories?.length || 0),
            0
          );

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
              isSelected ?
              'bg-indigo-50/80 border-indigo-200 shadow-xs' :
              'bg-white border-zinc-200/70 hover:border-zinc-300 hover:bg-zinc-50/50'}`
              }>
              
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-md bg-white border border-zinc-200 shadow-2xs">
                    {renderCategoryIcon(cat.icon)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-zinc-900 truncate">
                        {cat.name}
                      </span>
                      {cat.status === 'inactive' &&
                    <span className="px-1.5 py-0.2 text-[9px] bg-zinc-100 text-zinc-500 rounded font-normal">
                          Inactive
                        </span>
                    }
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {totalSubs} subcategories • {totalChildren} child nodes
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Hover Actions */}
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEditModal('category', cat);
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-white cursor-pointer"
                    title="Edit Category">
                    
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(cat);
                    }}
                    className="p-1 text-zinc-400 hover:text-rose-600 rounded hover:bg-white cursor-pointer"
                    title="Delete Category">
                    
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                  isSelected ? 'text-indigo-600' : 'text-zinc-300'}`
                  } />
                
                </div>
              </div>);

        })}
      </div>

      {/* Column Footer */}
      <div className="p-2 border-t border-zinc-100 bg-zinc-50/50 text-[11px] text-zinc-400 text-center">
        Click a category to inspect its subcategories
      </div>
    </div>);

};