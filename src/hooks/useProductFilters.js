import { useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

/**
 * Custom hook to manage all product filter states directly in URL query parameters.
 * The URL serves as the single source of truth.
 */
export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Helper to parse comma-separated values from query string
  const parseCommaList = useCallback((val) => {
    if (!val) return [];
    return val
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, []);

  // Parse current active filters from URL
  const filters = useMemo(() => {
    const categories = parseCommaList(searchParams.get("category"));
    const subCategories = parseCommaList(
      searchParams.get("sub-category") || searchParams.get("subcategory")
    );
    const childCategories = parseCommaList(
      searchParams.get("child-category") || searchParams.get("childcategory")
    );
    const brands = parseCommaList(searchParams.get("brand") || searchParams.get("brands"));
    const colors = parseCommaList(searchParams.get("color") || searchParams.get("colors"));
    const sizes = parseCommaList(searchParams.get("size") || searchParams.get("sizes"));

    const minPriceRaw = searchParams.get("minPrice");
    const maxPriceRaw = searchParams.get("maxPrice");
    const minPrice = minPriceRaw !== null && minPriceRaw !== "" && !isNaN(minPriceRaw) ? Number(minPriceRaw) : null;
    const maxPrice = maxPriceRaw !== null && maxPriceRaw !== "" && !isNaN(maxPriceRaw) ? Number(maxPriceRaw) : null;

    const ratingRaw = searchParams.get("rating");
    const rating = ratingRaw ? Number(ratingRaw) : null;

    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || searchParams.get("sortBy") || "default";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 12);

    return {
      categories,
      subCategories,
      childCategories,
      brands,
      colors,
      sizes,
      minPrice,
      maxPrice,
      rating,
      search,
      sort,
      page,
      limit,
    };
  }, [searchParams, parseCommaList]);

  // Internal helper to update URL search params without page reload and preserving others
  const updateParams = useCallback(
    (updater) => {
      setSearchParams(
        (prevParams) => {
          const nextParams = new URLSearchParams(prevParams);
          updater(nextParams);

          // Clean up empty params
          const keysToDelete = [];
          nextParams.forEach((val, key) => {
            if (!val || val.trim() === "") {
              keysToDelete.push(key);
            }
          });
          keysToDelete.forEach((k) => nextParams.delete(k));

          return nextParams;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  // Toggle multi-select parameter (e.g. category, sub-category, child-category, brand, color, size)
  const toggleMultiFilter = useCallback(
    (paramKey, value) => {
      if (!value) return;
      const normalizedVal = String(value).trim();

      updateParams((params) => {
        const currentList = parseCommaList(params.get(paramKey));
        let nextList;

        if (currentList.includes(normalizedVal)) {
          nextList = currentList.filter((item) => item !== normalizedVal);
        } else {
          nextList = [...currentList, normalizedVal];
        }

        if (nextList.length > 0) {
          params.set(paramKey, nextList.join(","));
        } else {
          params.delete(paramKey);
        }

        // Reset page to 1 when filters change
        params.delete("page");
      });
    },
    [updateParams, parseCommaList]
  );

  // Set single value parameter (or remove if null/empty)
  const setFilterValue = useCallback(
    (paramKey, value) => {
      updateParams((params) => {
        if (value !== undefined && value !== null && String(value).trim() !== "") {
          params.set(paramKey, String(value).trim());
        } else {
          params.delete(paramKey);
        }
        params.delete("page");
      });
    },
    [updateParams]
  );

  // Dedicated Category toggles with hierarchical parent-child synchronization
  const toggleCategory = useCallback((slug) => toggleMultiFilter("category", slug), [toggleMultiFilter]);

  const toggleSubCategory = useCallback(
    (slug, childSlugs = [], allSubSlugs = []) => {
      if (!slug) return;
      const slugsToCheck = (allSubSlugs && allSubSlugs.length > 0 ? allSubSlugs : [slug]).map((s) => String(s).trim());
      const normalizedChildren = (childSlugs || []).map((c) => String(c).trim());

      updateParams((params) => {
        const currentSubList = parseCommaList(params.get("sub-category") || params.get("subcategory"));
        const currentChildList = parseCommaList(params.get("child-category") || params.get("childcategory"));

        // Check if ANY of the subcategory's associated slugs are currently active
        const isCurrentlyActive = currentSubList.some((s) => slugsToCheck.includes(s));

        let nextSubList;
        let nextChildList = [...currentChildList];

        if (isCurrentlyActive) {
          // Unselecting parent subcategory: remove ALL its associated slugs, AND remove all its children
          nextSubList = currentSubList.filter((item) => !slugsToCheck.includes(item));
          if (normalizedChildren.length > 0) {
            nextChildList = nextChildList.filter((item) => !normalizedChildren.includes(item));
          }
        } else {
          // Selecting parent subcategory: add primary slug
          const primarySlug = String(slug).trim();
          if (!currentSubList.includes(primarySlug)) {
            nextSubList = [...currentSubList, primarySlug];
          } else {
            nextSubList = [...currentSubList];
          }
        }

        if (nextSubList.length > 0) {
          params.set("sub-category", nextSubList.join(","));
        } else {
          params.delete("sub-category");
          params.delete("subcategory");
        }

        if (nextChildList.length > 0) {
          params.set("child-category", nextChildList.join(","));
        } else {
          params.delete("child-category");
          params.delete("childcategory");
        }

        params.delete("page");
      });
    },
    [updateParams, parseCommaList]
  );

  const toggleChildCategory = useCallback(
    (childSlug, parentSubSlug) => {
      if (!childSlug) return;
      const normalizedChild = String(childSlug).trim();
      const normalizedParent = parentSubSlug ? String(parentSubSlug).trim() : null;

      updateParams((params) => {
        const currentChildList = parseCommaList(params.get("child-category") || params.get("childcategory"));
        const currentSubList = parseCommaList(params.get("sub-category") || params.get("subcategory"));

        let nextChildList;
        let nextSubList = [...currentSubList];

        if (currentChildList.includes(normalizedChild)) {
          // Unselecting child: remove child, BUT keep parent active in sub-category
          nextChildList = currentChildList.filter((item) => item !== normalizedChild);
        } else {
          // Selecting child: add child, AND ensure parent subcategory is also added to URL params
          nextChildList = [...currentChildList, normalizedChild];
          if (normalizedParent && !nextSubList.includes(normalizedParent)) {
            nextSubList.push(normalizedParent);
          }
        }

        if (nextChildList.length > 0) {
          params.set("child-category", nextChildList.join(","));
        } else {
          params.delete("child-category");
          params.delete("childcategory");
        }

        if (nextSubList.length > 0) {
          params.set("sub-category", nextSubList.join(","));
        } else {
          params.delete("sub-category");
          params.delete("subcategory");
        }

        params.delete("page");
      });
    },
    [updateParams, parseCommaList]
  );

  // Dedicated Brand, Color, Size toggles
  const toggleBrand = useCallback((brand) => toggleMultiFilter("brand", brand), [toggleMultiFilter]);
  const toggleColor = useCallback((color) => toggleMultiFilter("color", color), [toggleMultiFilter]);
  const toggleSize = useCallback((size) => toggleMultiFilter("size", size), [toggleMultiFilter]);

  // Set Price Range
  const setPriceRange = useCallback(
    (min, max) => {
      updateParams((params) => {
        if (min !== undefined && min !== null && min !== "" && !isNaN(min)) {
          params.set("minPrice", min);
        } else {
          params.delete("minPrice");
        }

        if (max !== undefined && max !== null && max !== "" && !isNaN(max)) {
          params.set("maxPrice", max);
        } else {
          params.delete("maxPrice");
        }

        params.delete("page");
      });
    },
    [updateParams]
  );

  // Set Rating
  const setRating = useCallback(
    (val) => {
      updateParams((params) => {
        if (val && Number(val) > 0) {
          params.set("rating", val);
        } else {
          params.delete("rating");
        }
        params.delete("page");
      });
    },
    [updateParams]
  );

  // Set Sort
  const setSort = useCallback(
    (sortVal) => {
      updateParams((params) => {
        if (sortVal && sortVal !== "default") {
          params.set("sort", sortVal);
        } else {
          params.delete("sort");
          params.delete("sortBy");
        }
        params.delete("page");
      });
    },
    [updateParams]
  );

  // Set Page
  const setPage = useCallback(
    (pageNum) => {
      updateParams((params) => {
        if (pageNum > 1) {
          params.set("page", pageNum);
        } else {
          params.delete("page");
        }
      });
    },
    [updateParams]
  );

  // Remove a specific filter item from multi-value params, or remove single param
  const removeFilterItem = useCallback(
    (paramKey, valueToRemove) => {
      updateParams((params) => {
        if (valueToRemove) {
          const currentList = parseCommaList(params.get(paramKey));
          const nextList = currentList.filter((item) => item !== String(valueToRemove).trim());
          if (nextList.length > 0) {
            params.set(paramKey, nextList.join(","));
          } else {
            params.delete(paramKey);
          }
        } else {
          params.delete(paramKey);
        }
        params.delete("page");
      });
    },
    [updateParams, parseCommaList]
  );

  // Clear all filters completely
  const clearAllFilters = useCallback(() => {
    navigate("/products", { replace: false });
  }, [navigate]);

  return {
    filters,
    searchParams,
    toggleCategory,
    toggleSubCategory,
    toggleChildCategory,
    toggleBrand,
    toggleColor,
    toggleSize,
    toggleMultiFilter,
    setFilterValue,
    setPriceRange,
    setRating,
    setSort,
    setPage,
    removeFilterItem,
    clearAllFilters,
  };
};
