import React from 'react';
import { Plus, Search, Edit2, Trash2, Tag } from 'lucide-react';















export const ChildCategoryColumn = ({
  activeCategory,
  activeSubCategory,
  selectedChildCatId,
  childSearch,
  setChildSearch,
  onSelectChildCategory,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteChildCategory,
  products
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs flex flex-col overflow-hidden">
      {/* Column Header */}
      <div className="p-3.5 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            3. Child Categories ({activeSubCategory?.childCategories?.length || 0})
          </h2>
        </div>
        <button
          id="btn-add-child-col"
          onClick={() =>
          onOpenCreateModal('child', activeCategory?.id, activeSubCategory?.id)
          }
          disabled={!activeSubCategory}
          className="p-1 text-zinc-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors disabled:opacity-30 cursor-pointer"
          title="Add Child Category">
          
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Context bar */}
      <div className="px-3 py-1.5 bg-amber-50/40 border-b border-amber-100 text-[11px] text-amber-800 flex items-center justify-between">
        <span className="truncate">
          Under: <strong>{activeSubCategory?.name || 'Select Subcategory'}</strong>
        </span>
        <span className="font-semibold">
          {activeSubCategory?.childCategories?.length || 0} nodes
        </span>
      </div>

      {/* Column Search */}
      <div className="p-2.5 border-b border-zinc-100">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter child categories..."
            value={childSearch}
            onChange={(e) => setChildSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:bg-white" />
          
        </div>
      </div>

      {/* Column List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[500px]">
        {!activeSubCategory?.childCategories?.length &&
        <div className="p-8 text-center">
            <Tag className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">No child categories created yet.</p>
            <button
            onClick={() =>
            onOpenCreateModal('child', activeCategory?.id, activeSubCategory?.id)
            }
            className="mt-2 text-xs font-medium text-amber-600 hover:underline cursor-pointer">
            
              + Add first child category
            </button>
          </div>
        }

        {activeSubCategory?.childCategories?.
        filter((ch) => ch.name.toLowerCase().includes(childSearch.toLowerCase())).
        map((ch) => {
          const isSelected = ch.id === selectedChildCatId;
          const countInChild = products.filter(
            (p) =>
            p.childCategory === ch.name ||
            p.category === activeCategory?.name && p.subCategory === activeSubCategory?.name
          ).length;

          return (
            <div
              key={ch.id}
              onClick={() => onSelectChildCategory(isSelected ? '' : ch.id)}
              className={`group relative flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
              isSelected ?
              'bg-amber-50/80 border-amber-200 shadow-xs' :
              'bg-white border-zinc-200/70 hover:border-zinc-300 hover:bg-zinc-50/50'}`
              }>
              
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-md bg-white border border-zinc-200 shadow-2xs text-amber-600">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-zinc-900 truncate">
                        {ch.name}
                      </span>
                      {ch.status === 'inactive' &&
                    <span className="px-1.5 py-0.2 text-[9px] bg-zinc-100 text-zinc-500 rounded font-normal">
                          Inactive
                        </span>
                    }
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono truncate">
                      /{ch.slug}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-zinc-100 text-zinc-700 rounded-md">
                    {ch.productCount || countInChild} items
                  </span>

                  {/* Actions */}
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEditModal(
                        'child',
                        ch,
                        activeCategory?.id,
                        activeSubCategory?.id
                      );
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-white cursor-pointer"
                    title="Edit Child Category">
                    
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activeCategory && activeSubCategory) {
                        onDeleteChildCategory(activeCategory.id, activeSubCategory.id, ch);
                      }
                    }}
                    className="p-1 text-zinc-400 hover:text-rose-600 rounded hover:bg-white cursor-pointer"
                    title="Delete Child Category">
                    
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>);

        })}
      </div>

      {/* Column Footer */}
      <div className="p-2 border-t border-zinc-100 bg-zinc-50/50 text-[11px] text-zinc-400 text-center">
        Child categories represent fine-grained leaf nodes
      </div>
    </div>);

};