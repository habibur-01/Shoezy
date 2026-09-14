import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronRight, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { renderCategoryIcon } from './categoryIcons';

export const MasterCategoryColumn = ({
  categories,
  selectedCatId,
  catSearch,
  setCatSearch,
  onSelectCategory,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteCategory,
  onReorderCategories
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const isFiltering = Boolean(catSearch && catSearch.trim());

  // Handle Drag Start
  const handleDragStart = (e, index) => {
    if (isFiltering) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  // Handle Drag Over
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (isFiltering) return;
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  // Handle Drop
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (isFiltering || draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...categories];
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    if (onReorderCategories) {
      onReorderCategories(reordered);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle Drag End
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Move Up 1 position
  const handleMoveUp = (e, index) => {
    e.stopPropagation();
    if (index === 0) return;
    const reordered = [...categories];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;

    if (onReorderCategories) {
      onReorderCategories(reordered);
    }
  };

  // Move Down 1 position
  const handleMoveDown = (e, index) => {
    e.stopPropagation();
    if (index === categories.length - 1) return;
    const reordered = [...categories];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;

    if (onReorderCategories) {
      onReorderCategories(reordered);
    }
  };

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
        {categories
          .filter((cat) => cat.name.toLowerCase().includes((catSearch || '').toLowerCase()))
          .map((cat, index) => {
            const catId = cat.id || cat._id;
            const isSelected = catId === selectedCatId;
            const totalSubs = cat.subCategories?.length || 0;
            const totalChildren = (cat.subCategories || []).reduce(
              (sum, s) => sum + (s.childCategories?.length || 0),
              0
            );
            const isBeingDragged = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <div
                key={catId}
                draggable={!isFiltering}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectCategory(catId)}
                className={`group relative flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer select-none ${
                  isBeingDragged
                    ? 'opacity-30 border-dashed border-indigo-400 bg-indigo-50/40 scale-[0.98]'
                    : isDragOver
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-md ring-2 ring-indigo-500/20'
                    : isSelected
                    ? 'bg-indigo-50/80 border-indigo-200 shadow-xs'
                    : 'bg-white border-zinc-200/70 hover:border-zinc-300 hover:bg-zinc-50/50'
                }`}
              >
                {/* Left section: Drag handle + Order index + Icon + Title */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* Drag Handle Grip */}
                  <div
                    className={`text-zinc-300 group-hover:text-zinc-500 p-0.5 rounded cursor-grab active:cursor-grabbing hover:bg-zinc-200/50 transition-colors ${
                      isFiltering ? 'opacity-20 cursor-not-allowed' : ''
                    }`}
                    title={isFiltering ? 'Clear search filter to reorder' : 'Drag up/down to change order'}
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Position Order Badge (#1, #2, #3...) */}
                  <span
                    className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200 group-hover:bg-zinc-200/70'
                    }`}
                    title={`Position #${index + 1} in Store Navbar`}
                  >
                    #{index + 1}
                  </span>

                  {/* Category Icon */}
                  <div className="p-1.5 rounded-md bg-white border border-zinc-200 shadow-2xs shrink-0">
                    {renderCategoryIcon(cat.icon)}
                  </div>

                  {/* Category Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-zinc-900 truncate">
                        {cat.name}
                      </span>
                      {cat.status === 'inactive' && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-zinc-100 text-zinc-500 rounded font-normal shrink-0">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {totalSubs} subcategories • {totalChildren} child nodes
                    </div>
                  </div>
                </div>

                {/* Right Actions: Up/Down Buttons + Edit/Delete + Chevron */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {/* Up / Down Arrow Quick Reorder Buttons */}
                  {!isFiltering && (
                    <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleMoveUp(e, index)}
                        disabled={index === 0}
                        className="p-0.5 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 rounded disabled:opacity-20 disabled:hover:text-zinc-400 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleMoveDown(e, index)}
                        disabled={index === categories.length - 1}
                        className="p-0.5 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 rounded disabled:opacity-20 disabled:hover:text-zinc-400 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Hover Actions: Edit & Delete */}
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditModal('category', cat);
                      }}
                      className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-white cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCategory(cat);
                      }}
                      className="p-1 text-zinc-400 hover:text-rose-600 rounded hover:bg-white cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-indigo-600' : 'text-zinc-300'
                    }`}
                  />
                </div>
              </div>
            );
          })}
      </div>

      {/* Column Footer */}
      <div className="p-2 border-t border-zinc-100 bg-zinc-50/50 text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1">
        <span>⠿ Drag & drop or use arrows to change navbar display order</span>
      </div>
    </div>
  );
};