import React from 'react';
import { Plus, Search, Edit2, Trash2, ChevronRight, Folder } from 'lucide-react';













export const SubCategoryColumn = ({
  activeCategory,
  selectedSubCatId,
  subCatSearch,
  setSubCatSearch,
  onSelectSubCategory,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteSubCategory
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs flex flex-col overflow-hidden">
      {/* Column Header */}
      <div className="p-3.5 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            2. Subcategories ({activeCategory?.subCategories?.length || 0})
          </h2>
        </div>
        <button
          id="btn-add-sub-col"
          onClick={() => onOpenCreateModal('subcategory', activeCategory?.id)}
          disabled={!activeCategory}
          className="p-1 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors disabled:opacity-30 cursor-pointer"
          title="Add Subcategory">
          
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Context bar */}
      <div className="px-3 py-1.5 bg-emerald-50/40 border-b border-emerald-100 text-[11px] text-emerald-800 flex items-center justify-between">
        <span className="truncate">
          Under: <strong>{activeCategory?.name || 'Select Category'}</strong>
        </span>
        <span className="font-semibold">{activeCategory?.subCategories?.length || 0} nodes</span>
      </div>

      {/* Column Search */}
      <div className="p-2.5 border-b border-zinc-100">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter subcategories..."
            value={subCatSearch}
            onChange={(e) => setSubCatSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:bg-white" />
          
        </div>
      </div>

      {/* Column List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[500px]">
        {!activeCategory?.subCategories?.length &&
        <div className="p-8 text-center">
            <Folder className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">No subcategories created yet.</p>
            <button
            onClick={() => onOpenCreateModal('subcategory', activeCategory?.id)}
            className="mt-2 text-xs font-medium text-emerald-600 hover:underline cursor-pointer">
            
              + Add first subcategory
            </button>
          </div>
        }

        {activeCategory?.subCategories?.
        filter((sub) => sub.name.toLowerCase().includes(subCatSearch.toLowerCase())).
        map((sub) => {
          const isSelected = sub.id === selectedSubCatId;
          const totalChildren = sub.childCategories?.length || 0;

          return (
            <div
              key={sub.id}
              onClick={() => onSelectSubCategory(sub.id)}
              className={`group relative flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
              isSelected ?
              'bg-emerald-50/80 border-emerald-200 shadow-xs' :
              'bg-white border-zinc-200/70 hover:border-zinc-300 hover:bg-zinc-50/50'}`
              }>
              
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-md bg-white border border-zinc-200 shadow-2xs text-emerald-600">
                    <Folder className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-zinc-900 truncate">
                        {sub.name}
                      </span>
                      {sub.status === 'inactive' &&
                    <span className="px-1.5 py-0.2 text-[9px] bg-zinc-100 text-zinc-500 rounded font-normal">
                          Inactive
                        </span>
                    }
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {totalChildren} child categories
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Actions */}
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEditModal('subcategory', sub, activeCategory.id);
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-white cursor-pointer"
                    title="Edit Subcategory">
                    
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSubCategory(activeCategory.id, sub);
                    }}
                    className="p-1 text-zinc-400 hover:text-rose-600 rounded hover:bg-white cursor-pointer"
                    title="Delete Subcategory">
                    
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                  isSelected ? 'text-emerald-600' : 'text-zinc-300'}`
                  } />
                
                </div>
              </div>);

        })}
      </div>

      {/* Column Footer */}
      <div className="p-2 border-t border-zinc-100 bg-zinc-50/50 text-[11px] text-zinc-400 text-center">
        Click a subcategory to inspect child nodes
      </div>
    </div>);

};