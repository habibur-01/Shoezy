import React, { useEffect, useState } from "react";
import FilterSidebar from "../components/Products/FilterSidebar";
import Header from "../components/Products/Header";
import MobileFilterDrawer from "../components/Products/MobileFilterDrawer";
import Pagination from "../components/Products/Pagination";
import ProductGrid from "../components/Products/ProductGrid";
import Container from "../components/common/Container/Container";
import Breadcrumb from "../components/common/Breadcrumb/Breadcrumb";
import { getProducts } from "../server/product/product";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/features/product/productSlice";
import { useParams, Link } from "react-router-dom";
import { setIsLoading } from "../redux/features/loader/loaderSlice";
import { MapPin, ArrowRight, X, Filter, RotateCcw } from "lucide-react";
import { useProductFilters } from "../hooks/useProductFilters";

const BRANDS = [
  "Nike",
  "Adidas",
  "Puma",
  "New Balance",
  "Reebok",
  "Zara",
  "H&M",
  "Levi's",
  "Tommy Hilfiger",
  "Calvin Klein",
  "Gucci",
  "Ralph Lauren",
  "Uniqlo",
  "Under Armour",
];

const COLORS = [
  { name: "Black", class: "bg-black" },
  { name: "White", class: "bg-white border-2 border-stone-300" },
  { name: "Red", class: "bg-red-600" },
  { name: "Blue", class: "bg-blue-600" },
  { name: "Grey", class: "bg-stone-500" },
  { name: "Green", class: "bg-green-600" },
  { name: "Navy", class: "bg-blue-900" },
  { name: "Beige", class: "bg-amber-100 border border-stone-300" },
  { name: "Yellow", class: "bg-yellow-400" },
  { name: "Brown", class: "bg-amber-800" },
];

const SIZES = ["38", "39", "40", "41", "42", "43", "44", "45", "XS", "S", "M", "L", "XL", "XXL"];

const ShopPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const categoriesTree = useSelector((state) => state.initial.categories || []);

  const params = useParams();
  const { categorySlug: pathCat, subSlug: pathSub } = params;

  // Use URL-driven product filtering hook
  const {
    filters,
    searchParams,
    toggleCategory,
    toggleSubCategory,
    toggleChildCategory,
    toggleBrand,
    toggleColor,
    toggleSize,
    setPriceRange,
    setRating,
    setSort,
    setPage,
    setLimit,
    removeFilterItem,
    clearAllFilters,
  } = useProductFilters();

  // If path params exist (e.g. /products/:categorySlug/:subSlug), merge into filters for backward compatibility
  const effectiveCategorySlug = pathCat || (filters.categories.length === 1 ? filters.categories[0] : null);
  const effectiveSubSlug = pathSub || (filters.subCategories.length === 1 ? filters.subCategories[0] : null);
  const effectiveCategories = filters.categories.length > 0 ? filters.categories : (pathCat ? [pathCat] : []);

  // Guard: if current page exceeds totalPages (e.g., after filtering), reset to page 1
  useEffect(() => {
    if (totalPages >= 1 && filters.page > totalPages) {
      setPage(1);
    }
  }, [totalPages, filters.page, setPage]);

  // Fetch products whenever searchParams or pathParams change
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setIsLoading(true));
      try {
        const result = await getProducts({
          categorySlug: pathCat,
          subSlug: pathSub,
          page: filters.page,
          limit: filters.limit,
          filters: {
            ...filters,
            // If path params are present and not already in filters array, include them
            categories: filters.categories.length > 0 ? filters.categories : (pathCat ? [pathCat] : []),
            subCategories: filters.subCategories.length > 0 ? filters.subCategories : (pathSub ? [pathSub] : []),
          },
        });

        if (result?.data?.success) {
          dispatch(setProducts(result.data.data?.products || []));
          setTotalPages(result.data.data?.totalPages || 1);
          setTotalProductsCount(result.data.data?.total || 0);
        } else {
          dispatch(setProducts([]));
          setTotalPages(1);
          setTotalProductsCount(0);
        }
      } catch (err) {
        console.error("ShopPage fetchProducts error:", err);
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    fetchProducts();
  }, [searchParams, pathCat, pathSub, filters, dispatch]);

  // Compute active filters list for display as chips
  const activeChips = [];

  filters.categories.forEach((cat) => {
    activeChips.push({
      id: `cat-${cat}`,
      type: "category",
      label: `Category: ${cat}`,
      onRemove: () => removeFilterItem("category", cat),
    });
  });

  filters.subCategories.forEach((sub) => {
    activeChips.push({
      id: `sub-${sub}`,
      type: "sub-category",
      label: `Subcategory: ${sub}`,
      onRemove: () => removeFilterItem("sub-category", sub),
    });
  });

  filters.childCategories.forEach((child) => {
    activeChips.push({
      id: `child-${child}`,
      type: "child-category",
      label: `Group: ${child}`,
      onRemove: () => removeFilterItem("child-category", child),
    });
  });

  filters.brands.forEach((brand) => {
    activeChips.push({
      id: `brand-${brand}`,
      type: "brand",
      label: `Brand: ${brand}`,
      onRemove: () => removeFilterItem("brand", brand),
    });
  });

  filters.colors.forEach((color) => {
    activeChips.push({
      id: `color-${color}`,
      type: "color",
      label: `Color: ${color}`,
      onRemove: () => removeFilterItem("color", color),
    });
  });

  filters.sizes.forEach((size) => {
    activeChips.push({
      id: `size-${size}`,
      type: "size",
      label: `Size: ${size}`,
      onRemove: () => removeFilterItem("size", size),
    });
  });

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    let priceLabel = "Price: ";
    if (filters.minPrice !== null && filters.maxPrice !== null) {
      priceLabel += `$${filters.minPrice} - $${filters.maxPrice}`;
    } else if (filters.minPrice !== null) {
      priceLabel += `Min $${filters.minPrice}`;
    } else {
      priceLabel += `Max $${filters.maxPrice}`;
    }

    activeChips.push({
      id: "price-range",
      type: "price",
      label: priceLabel,
      onRemove: () => {
        removeFilterItem("minPrice");
        removeFilterItem("maxPrice");
      },
    });
  }

  if (filters.rating) {
    activeChips.push({
      id: `rating-${filters.rating}`,
      type: "rating",
      label: `Rating: ${filters.rating}★ & Up`,
      onRemove: () => removeFilterItem("rating"),
    });
  }

  if (filters.search) {
    activeChips.push({
      id: `search-${filters.search}`,
      type: "search",
      label: `Search: "${filters.search}"`,
      onRemove: () => removeFilterItem("search"),
    });
  }

  // Page title
  const pageTitle = effectiveSubSlug
    ? effectiveSubSlug.replace(/-/g, " ")
    : effectiveCategorySlug
      ? effectiveCategorySlug.replace(/-/g, " ")
      : "All Products";

  return (
    <Container>
      <Breadcrumb />
      <div className="px-4 py-6" id="shop-products-top">
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0 sticky top-24 self-start">
            <FilterSidebar
              filters={filters}
              categories={categoriesTree}
              selectedCategories={effectiveCategories}
              brands={BRANDS}
              colors={COLORS}
              sizes={SIZES}
              onToggleCategory={toggleCategory}
              onToggleSubCategory={toggleSubCategory}
              onToggleChildCategory={toggleChildCategory}
              onToggleBrand={toggleBrand}
              onToggleColor={toggleColor}
              onToggleSize={toggleSize}
              onPriceRangeChange={setPriceRange}
              onRatingChange={setRating}
              onClearFilters={clearAllFilters}
            />
          </div>

          {/* Main Product Content */}
          <div className="flex-1 min-w-0 w-full">
            {/* Header Title & Active Filter Summary */}
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 capitalize tracking-tight">
                  {pageTitle}
                </h1>
                <span className="text-xs font-semibold text-stone-500">
                  {totalProductsCount} {totalProductsCount === 1 ? "Product" : "Products"} Found
                </span>
              </div>

              {/* Active Filter Chips Bar */}
              {activeChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-stone-200/80">
                  <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    Active Filters:
                  </span>

                  {activeChips.map((chip) => (
                    <span
                      key={chip.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 rounded-full text-xs font-semibold transition"
                    >
                      <span className="capitalize">{chip.label}</span>
                      <button
                        type="button"
                        onClick={chip.onRemove}
                        className="p-0.5 text-stone-400 hover:text-red-600 rounded-full cursor-pointer transition-colors"
                        title="Remove this filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 ml-1 cursor-pointer transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* View Mode & Sort Controls Header */}
            <Header
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onShowFilters={() => setShowMobileFilters(true)}
              sortBy={filters.sort}
              onSortChange={setSort}
              totalResults={totalProductsCount}
              currentCount={products?.length || 0}
              activeFiltersCount={activeChips.length}
            />

            {/* Product Grid / Empty State */}
            {products && products.length > 0 ? (
              <div className="space-y-8 mt-6">
                <ProductGrid products={products} viewMode={viewMode} />
                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  totalItems={totalProductsCount}
                  itemsPerPage={filters.limit}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    const topEl = document.getElementById("shop-products-top");
                    if (topEl) {
                      topEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    } else {
                      window.scrollTo({ top: 120, behavior: "smooth" });
                    }
                  }}
                  onItemsPerPageChange={setLimit}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-stone-50 rounded-2xl border border-stone-200 text-center mt-6">
                <div className="w-12 h-12 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-500 mb-3">
                  <Filter className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-1">No matching products found</h3>
                <p className="text-xs text-stone-500 max-w-sm mb-4">
                  We couldn't find any products matching your selected combination of filters. Try removing some filters or resetting all filters.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        show={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        categories={categoriesTree}
        selectedCategories={effectiveCategories}
        brands={BRANDS}
        colors={COLORS}
        sizes={SIZES}
        onToggleCategory={toggleCategory}
        onToggleSubCategory={toggleSubCategory}
        onToggleChildCategory={toggleChildCategory}
        onToggleBrand={toggleBrand}
        onToggleColor={toggleColor}
        onToggleSize={toggleSize}
        onPriceRangeChange={setPriceRange}
        onRatingChange={setRating}
        onClearFilters={clearAllFilters}
        totalResults={totalProductsCount}
      />

      {/* Outlets Banner */}
      <div className="my-10 p-6 sm:p-8 rounded-2xl bg-stone-900 text-stone-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg border border-stone-800">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="px-3 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[11px] font-semibold uppercase tracking-wider inline-flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>Retail Store Outlets</span>
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white">Prefer to Try On Shoes in Person?</h3>
          <p className="text-xs text-stone-400 max-w-xl leading-relaxed">
            Visit any of our physical outlets in Dhanmondi, Banani, Uttara, or Chittagong GEC for trial fitting & in-person shopping.
          </p>
        </div>
        <Link
          to="/outlets"
          className="px-5 py-3 bg-[var(--color-red,#db4444)] hover:bg-red-600 text-white font-semibold text-xs rounded-xl transition cursor-pointer flex items-center gap-2 flex-shrink-0 shadow-sm hover:shadow"
        >
          <span>View Outlets & Addresses</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Container>
  );
};

export default ShopPage;