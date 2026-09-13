import React from 'react';
import { ChevronRight, Plus, Edit2, Trash2, Folder, Tag } from 'lucide-react';

import { renderCategoryIcon } from './categoryIcons';
















export const CategoryTreeView = ({
  categories,
  expandedCats,
  expandedSubs,
  onToggleCatExpand,
  onToggleSubExpand,
  onExpandAll,
  onCollapseAll,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteCategory,
  onDeleteSubCategory,
  onDeleteChildCategory
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Full Catalog Tree Inspector
          </h2>
          <p className="text-[11px] text-zinc-500">
            Expand or collapse entire branches to see all 3 levels structured together
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExpandAll}
            className="px-2.5 py-1 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 cursor-pointer">
            
            Expand All
          </button>
          <button
            onClick={onCollapseAll}
            className="px-2.5 py-1 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 cursor-pointer">
            
            Collapse All
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3 divide-y divide-zinc-100">
        {categories.map((cat) => {
          const isCatExpanded = !!expandedCats[cat.id];
          return (
            <div key={cat.id} className="pt-3 first:pt-0">
              {/* Category Row */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100/70 transition-colors">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onToggleCatExpand(cat.id)}
                    className="p-1 text-zinc-500 hover:text-zinc-900 rounded cursor-pointer">
                    
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                      isCatExpanded ? 'rotate-90 text-indigo-600' : ''}`
                      } />
                    
                  </button>
                  <div className="p-1 rounded bg-white border border-zinc-200">
                    {renderCategoryIcon(cat.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900">{cat.name}</span>
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                        L1 Category
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">/{cat.slug}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500">{cat.description}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenCreateModal('subcategory', cat.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 cursor-pointer">
                    
                    <Plus className="w-3 h-3" />
                    Subcategory
                  </button>
                  <button
                    onClick={() => onOpenEditModal('category', cat)}
                    className="p-1 text-zinc-400 hover:text-zinc-700 rounded cursor-pointer"
                    title="Edit">
                    
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat)}
                    className="p-1 text-zinc-400 hover:text-rose-600 rounded cursor-pointer"
                    title="Delete">
                    
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {isCatExpanded &&
              <div className="ml-6 pl-4 border-l-2 border-indigo-100 mt-2 space-y-2">
                  {!cat.subCategories?.length &&
                <div className="py-2 text-xs text-zinc-400 italic">
                      No subcategories in this branch.
                    </div>
                }
                  {cat.subCategories?.map((sub) => {
                  const isSubExpanded = !!expandedSubs[sub.id];
                  return (
                    <div key={sub.id} className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-zinc-200/80 hover:border-zinc-300">
                          <div className="flex items-center gap-2">
                            <button
                            onClick={() => onToggleSubExpand(sub.id)}
                            className="p-0.5 text-zinc-500 hover:text-zinc-900 rounded cursor-pointer">
                            
                              <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform ${
                              isSubExpanded ? 'rotate-90 text-emerald-600' : ''}`
                              } />
                            
                            </button>
                            <Folder className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-xs font-semibold text-zinc-800">
                              {sub.name}
                            </span>
                            <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                              L2 Subcategory
                            </span>
                            <span className="text-[11px] text-zinc-400 font-mono">
                              /{sub.slug}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                            onClick={() => onOpenCreateModal('child', cat.id, sub.id)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 cursor-pointer">
                            
                              <Plus className="w-3 h-3" />
                              Child
                            </button>
                            <button
                            onClick={() => onOpenEditModal('subcategory', sub, cat.id)}
                            className="p-1 text-zinc-400 hover:text-zinc-700 rounded cursor-pointer"
                            title="Edit">
                            
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                            onClick={() => onDeleteSubCategory(cat.id, sub)}
                            className="p-1 text-zinc-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Delete">
                            
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Child Categories under Subcategory */}
                        {isSubExpanded &&
                      <div className="ml-6 pl-4 border-l-2 border-emerald-100 space-y-1.5 py-1">
                            {!sub.childCategories?.length &&
                        <div className="text-[11px] text-zinc-400 italic py-1">
                                No child categories in this subcategory.
                              </div>
                        }
                            {sub.childCategories?.map((child) =>
                        <div
                          key={child.id}
                          className="flex items-center justify-between p-1.5 px-2.5 rounded-md bg-zinc-50/70 border border-zinc-200/60 hover:bg-white">
                          
                                <div className="flex items-center gap-2">
                                  <Tag className="w-3 h-3 text-amber-600" />
                                  <span className="text-xs text-zinc-700 font-medium">
                                    {child.name}
                                  </span>
                                  <span className="px-1 py-0.2 text-[8px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded">
                                    L3 Child
                                  </span>
                                  <span className="text-[10px] text-zinc-400 font-mono">
                                    /{child.slug}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                              onClick={() =>
                              onOpenEditModal('child', child, cat.id, sub.id)
                              }
                              className="p-0.5 text-zinc-400 hover:text-zinc-700 rounded cursor-pointer"
                              title="Edit">
                              
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                              onClick={() =>
                              onDeleteChildCategory(cat.id, sub.id, child)
                              }
                              className="p-0.5 text-zinc-400 hover:text-rose-600 rounded cursor-pointer"
                              title="Delete">
                              
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                        )}
                          </div>
                      }
                      </div>);

                })}
                </div>
              }
            </div>);

        })}
      </div>
    </div>);

};