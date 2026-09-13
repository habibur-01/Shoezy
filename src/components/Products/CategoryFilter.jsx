import React, { useState, useEffect } from "react";
import FilterSection from "./FilterSection";
import { ChevronDown, ChevronRight, Check } from "lucide-react";

/**
 * Subcategory & Child Category Filter
 * Requirements:
 * 1. Main parent categories (Men, Women, Kids) are NOT displayed here - they exist only in the Navbar.
 * 2. Only subcategories and their child categories for the selected department are shown.
 * 3. Clicking a child (e.g. Heels) adds child-category=heels AND sub-category=women-shoe to URL params.
 * 4. Unselecting a child removes child-category, but parent subcategory (Shoe) REMAINS active in URL params.
 * 5. Unselecting the parent subcategory unselects both parent and all its children.
 * 6. Border color stays constant (no color change).
 * 7. Active child color is black (no red).
 */
const CategoryFilter = ({
  categories = [],
  selectedCategories = [],
  selectedSubCategories = [],
  selectedChildCategories = [],
  onToggleCategory,
  onToggleSubCategory,
  onToggleChildCategory,
}) => {
  const [expandedSubCategories, setExpandedSubCategories] = useState({});

  // Filter categories matching the selection from the navbar or path params
  const relevantCategories = categories.filter((cat) => {
    if (!selectedCategories || selectedCategories.length === 0) return true;
    return selectedCategories.includes(cat.slug);
  });

  // Group and merge subcategories by normalized name to guarantee unique cards (e.g. ONE Shoe, ONE Apparel, ONE Accessories)
  const subcategoryMap = new Map();

  relevantCategories.forEach((cat) => {
    (cat.subcategories || []).forEach((sub) => {
      const key = sub.name.trim().toLowerCase();
      if (!subcategoryMap.has(key)) {
        subcategoryMap.set(key, {
          _id: sub._id,
          name: sub.name,
          slug: sub.slug,
          allSubSlugs: [sub.slug],
          childCategories: (sub.childCategories || []).map((child) => ({
            ...child,
            parentSubSlug: sub.slug,
          })),
        });
      } else {
        const existing = subcategoryMap.get(key);
        if (!existing.allSubSlugs.includes(sub.slug)) {
          existing.allSubSlugs.push(sub.slug);
        }
        // Merge child categories without duplicate names or slugs
        (sub.childCategories || []).forEach((child) => {
          const childKey = child.name.trim().toLowerCase();
          const childSeen = existing.childCategories.some(
            (c) => c.slug === child.slug || c.name.trim().toLowerCase() === childKey
          );
          if (!childSeen) {
            existing.childCategories.push({
              ...child,
              parentSubSlug: sub.slug,
            });
          }
        });
      }
    });
  });

  const uniqueSubcategories = Array.from(subcategoryMap.values());

  // Auto-expand parent subcategories if any of their slugs or child items are selected
  useEffect(() => {
    const nextSubExp = { ...expandedSubCategories };
    uniqueSubcategories.forEach((sub) => {
      const isSubChecked = (sub.allSubSlugs || [sub.slug]).some((s) =>
        selectedSubCategories.includes(s)
      );
      const hasSelectedChild = (sub.childCategories || []).some((child) =>
        selectedChildCategories.includes(child.slug)
      );

      if (isSubChecked || hasSelectedChild) {
        nextSubExp[sub._id] = true;
      }
    });
    setExpandedSubCategories(nextSubExp);
  }, [selectedSubCategories, selectedChildCategories, categories]);

  const toggleSubExpand = (e, subId) => {
    if (e) e.stopPropagation();
    setExpandedSubCategories((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  const handleParentSubClick = (sub) => {
    const childSlugs = (sub.childCategories || []).map((c) => c.slug);
    onToggleSubCategory(sub.slug, childSlugs, sub.allSubSlugs);
  };

  const handleChildClick = (child, sub) => {
    onToggleChildCategory(child.slug, child.parentSubSlug || sub.slug);
  };

  return (
    <FilterSection title="Categories">
      {uniqueSubcategories && uniqueSubcategories.length > 0 ? (
        <div className="space-y-2">
          {uniqueSubcategories.map((sub) => {
            const isSubChecked = (sub.allSubSlugs || [sub.slug]).some((s) =>
              selectedSubCategories.includes(s)
            );
            const children = sub.childCategories || [];
            const hasChildren = children.length > 0;

            // Check if any child category is active
            const hasActiveChild = children.some((child) =>
              selectedChildCategories.includes(child.slug)
            );

            // Parent subcategory is active if checked in params OR if any child is active
            const isSubActive = isSubChecked || hasActiveChild;
            const isSubExpanded = !!expandedSubCategories[sub._id];

            const activeChildCount = children.filter((c) =>
              selectedChildCategories.includes(c.slug)
            ).length;

            return (
              <div
                key={sub._id}
                className="border border-stone-200/80 rounded-xl overflow-hidden bg-white shadow-2xs"
              >
                {/* Subcategory Row (Parent) */}
                <div
                  className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                    isSubActive ? "bg-stone-100 font-bold" : "hover:bg-stone-50"
                  }`}
                >
                  <div
                    onClick={() => handleParentSubClick(sub)}
                    className="flex items-center gap-2.5 cursor-pointer select-none flex-1 min-w-0"
                  >
                    {/* Checkbox: active in solid black when active */}
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                        isSubActive
                          ? "bg-stone-900 border-stone-900 text-white"
                          : "border border-stone-300 bg-white hover:border-stone-500"
                      }`}
                    >
                      {isSubActive && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <span
                      className={`text-xs capitalize truncate transition-colors ${
                        isSubActive ? "text-stone-900 font-bold" : "font-medium text-stone-800"
                      }`}
                    >
                      {sub.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Active child count badge in BLACK */}
                    {activeChildCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-900 text-white shadow-2xs">
                        {activeChildCount}
                      </span>
                    )}

                    {/* Expand/Collapse Toggle Button */}
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={(e) => toggleSubExpand(e, sub._id)}
                        className="p-1 text-stone-500 hover:text-stone-950 rounded-lg hover:bg-stone-200/60 transition cursor-pointer"
                        aria-label="Toggle child categories"
                      >
                        {isSubExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Level 3: Child Categories Dropdown */}
                {hasChildren && isSubExpanded && (
                  <div className="pl-6 pr-3 py-2 bg-stone-50/80 border-t border-stone-200/70 space-y-1">
                    {children.map((child) => {
                      const isChildChecked = selectedChildCategories.includes(child.slug);

                      return (
                        <div
                          key={child._id || child.slug}
                          onClick={() => handleChildClick(child, sub)}
                          className="flex items-center gap-2.5 py-1.5 px-1.5 rounded-lg cursor-pointer select-none group hover:bg-stone-100/70 transition-colors"
                        >
                          {/* Child Checkbox: Active in BLACK (no red) */}
                          <div
                            className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center transition-all ${
                              isChildChecked
                                ? "bg-stone-900 border-stone-900 text-white"
                                : "border border-stone-300 bg-white group-hover:border-stone-500"
                            }`}
                          >
                            {isChildChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>

                          {/* Child Label: Active in BLACK (no red) */}
                          <span
                            className={`text-xs capitalize transition-colors ${
                              isChildChecked
                                ? "text-stone-900 font-bold"
                                : "text-stone-600 group-hover:text-stone-900 font-normal"
                            }`}
                          >
                            {child.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-stone-400 italic">No subcategories available</p>
      )}
    </FilterSection>
  );
};

export default CategoryFilter;
