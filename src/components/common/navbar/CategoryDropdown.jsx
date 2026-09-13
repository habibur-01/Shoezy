import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

/**
 * Multi-Level Category Dropdown Menu for Navbar
 * Supports: Category -> Subcategory -> Child Category
 */
const CategoryDropdown = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const navigate = useNavigate();

  const subcategories = category?.subcategories || [];
  const hasSubcategories = subcategories.length > 0;

  const handleCategoryClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    navigate(`/products?category=${category.slug}`);
  };

  const handleSubCategoryClick = (e, sub) => {
    e.stopPropagation();
    setIsOpen(false);
    navigate(`/products?category=${category.slug}&sub-category=${sub.slug}`);
  };

  const handleChildCategoryClick = (e, sub, child) => {
    e.stopPropagation();
    setIsOpen(false);
    navigate(
      `/products?category=${category.slug}&sub-category=${sub.slug}&child-category=${child.slug}`
    );
  };

  return (
    <li
      className="relative group py-2"
      onMouseEnter={() => {
        setIsOpen(true);
        if (hasSubcategories && !activeSubcategory) {
          setActiveSubcategory(subcategories[0]?._id);
        }
      }}
      onMouseLeave={() => {
        setIsOpen(false);
      }}
    >
      {/* Category Link */}
      <button
        onClick={handleCategoryClick}
        className="flex items-center gap-1 text-base text-[var(--color-text)] hover:text-[var(--color-red)] font-medium transition-colors capitalize cursor-pointer outline-none"
      >
        <span>{category.name}</span>
        {hasSubcategories && (
          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-stone-500" />
        )}
      </button>

      {/* Multi-Level Dropdown Flyout */}
      {hasSubcategories && isOpen && (
        <div className="absolute left-0 top-full pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200/80 overflow-hidden flex min-w-[320px] max-w-[480px]">
            {/* Subcategories Column */}
            <div className="w-48 bg-stone-50/80 border-r border-stone-200/60 p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-600">
                Categories
              </div>
              {subcategories.map((sub) => {
                const isCurrentActive = activeSubcategory === sub._id;
                const hasChildren = (sub.childCategories || []).length > 0;

                return (
                  <div
                    key={sub._id}
                    onMouseEnter={() => setActiveSubcategory(sub._id)}
                    onClick={(e) => handleSubCategoryClick(e, sub)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      isCurrentActive
                        ? "bg-white text-stone-900 shadow-xs border border-stone-200/70"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60"
                    }`}
                  >
                    <span className="capitalize">{sub.name}</span>
                    {hasChildren && (
                      <ChevronRight className="w-3 h-3 text-stone-400" />
                    )}
                  </div>
                );
              })}

              <div className="pt-2 mt-2 border-t border-stone-200/60 px-2">
                <button
                  onClick={handleCategoryClick}
                  className="w-full text-left text-[11px] font-bold text-red-600 hover:text-red-700 py-1"
                >
                  View All {category.name} →
                </button>
              </div>
            </div>

            {/* Child Categories Column */}
            <div className="flex-1 p-3 min-w-[200px] bg-white">
              {(() => {
                const currentSub = subcategories.find(
                  (s) => s._id === activeSubcategory
                ) || subcategories[0];

                const children = currentSub?.childCategories || [];

                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
                      <span className="text-xs font-bold text-stone-900 capitalize">
                        {currentSub?.name}
                      </span>
                      <button
                        onClick={(e) => handleSubCategoryClick(e, currentSub)}
                        className="text-[10px] font-semibold text-stone-500 hover:text-black cursor-pointer"
                      >
                        All in {currentSub?.name}
                      </button>
                    </div>

                    {children.length > 0 ? (
                      <ul className="space-y-1">
                        {children.map((child) => (
                          <li key={child._id}>
                            <button
                              onClick={(e) =>
                                handleChildCategoryClick(e, currentSub, child)
                              }
                              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-normal text-stone-600 hover:text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer capitalize"
                            >
                              {child.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-xs text-stone-400">
                          No sub-groups listed
                        </p>
                        <button
                          onClick={(e) => handleSubCategoryClick(e, currentSub)}
                          className="mt-2 text-xs text-red-600 font-semibold"
                        >
                          Explore {currentSub?.name} Products
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default CategoryDropdown;
