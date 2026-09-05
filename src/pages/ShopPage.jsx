import { useEffect, useState } from "react";
import FilterSidebar from "../components/Products/FilterSidebar";
import Header from "../components/Products/Header";
import MobileFilterDrawer from "../components/Products/MobileFilterDrawer";
import Pagination from "../components/Products/Pagination";
import ProductGrid from "../components/Products/ProductGrid";
import Container from "../components/common/Container/Container";
import Breadcrumb from "../components/common/Breadcrumb/Breadcrumb";
import { getProducts, getSubCategories } from "../server/product/product";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/features/product/productSlice";
import { useNavigate, useParams, Link, useSearchParams } from "react-router-dom";
import { setIsLoading } from "../redux/features/loader/loaderSlice";
import { MapPin, ArrowRight, X } from "lucide-react";

const ShopPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector(state => state.product.products);
  const params = useParams();
  const { categorySlug, subSlug } = params;
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState(subSlug);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  const [filters, setFilters] = useState({
    colors: [],
    priceRange: [],
    sizes: [],
    brands: [],
    rating: 0,
    sortBy: "default",
    search: urlSearchQuery,
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: urlSearchQuery }));
    setPage(1);
  }, [urlSearchQuery]);

  const handleSortChange = (newSort) => {
    setFilters((prev) => ({ ...prev, sortBy: newSort }));
    setPage(1);
  };

  useEffect(() => {
    setSubCategory(subSlug);
  }, [subSlug]);

  const colors = [
    { name: 'Black', class: 'bg-black' },
    { name: 'Blue', class: 'bg-blue-600' },
    { name: 'Brown', class: 'bg-amber-700' },
    { name: 'Gray', class: 'bg-gray-500' },
    { name: 'Green', class: 'bg-green-600' },
    { name: 'Light Green', class: 'bg-green-300' },
    { name: 'Orange', class: 'bg-orange-500' },
    { name: 'Pink', class: 'bg-pink-300' },
    { name: 'Purple', class: 'bg-purple-600' },
    { name: 'Red', class: 'bg-red-600' },
    { name: 'White', class: 'bg-white border-2 border-gray-300' }
  ];

  const sizes = ['6', '7', '8', '9', '10', '11', '12'];
  const brands = ['Adidas', 'Nike', 'Puma', 'Reebok', 'New Balance'];

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'priceRange' || filterType === 'rating') {
      setFilters(prev => ({ ...prev, [filterType]: value }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType].includes(value)
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value]
      }));
    }
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      colors: [],
      priceRange: [],
      sizes: [],
      brands: [],
      rating: 0
    });
    setPage(1);
  };

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setIsLoading(true));
      const result = await getProducts({
        categorySlug,
        subSlug,
        page,
        limit,
        filters
      });
      if (result?.data?.success) {
        dispatch(setProducts(result.data.data?.products));
        setTotalPages(result.data.data?.totalPages || 1);
        setTotalProductsCount(result.data.data?.total || 0);
      }
      dispatch(setIsLoading(false));
    };
    fetchProducts();
  }, [categorySlug, subSlug, filters, page]);

  useEffect(() => {
    const loadsubCategory = async () => {
      if (categorySlug) {
        const subData = await getSubCategories(categorySlug);
        if (subData?.data?.data) {
          setSubCategories(subData.data.data);
        }
      }
    };

    loadsubCategory();
  }, [categorySlug]);

  const handleCategoryChange = (categoryName) => {
    if (subCategory !== categoryName) {
      setSubCategory(categoryName);
      navigate(`/products/${categorySlug}/${categoryName}`);
      setPage(1);
    }
  };

  return (
    <Container>
      <Breadcrumb />
      <div className="px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          {/* Sidebar - Desktop (Sticky Top with Pinned Clear All Filters Button) */}
          <div className="hidden lg:block w-80 flex-shrink-0 sticky top-24 self-start">
            <FilterSidebar
              filters={filters}
              handleCategoryChange={handleCategoryChange}
              subCategory={subCategory}
              onFilterChange={handleFilterChange}
              onClearFilters={clearAllFilters}
              categories={subCategories}
              brands={brands}
              colors={colors}
              sizes={sizes}
            />
          </div>

          {/* Main Product Content (Scrolls naturally alongside sticky filter) */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[var(--color-black)] font-medium text-2xl capitalize mb-4">
              {subSlug ? subSlug : categorySlug || "All Products"}
            </h1>

            {urlSearchQuery && (
              <div className="flex items-center justify-between bg-stone-100 border border-stone-200 px-4 py-3 rounded-xl mb-4 text-xs font-semibold text-stone-800">
                <span>Search results for: <strong className="text-stone-900 font-extrabold text-sm">"{urlSearchQuery}"</strong></span>
                <button
                  onClick={() => {
                    searchParams.delete("search");
                    setSearchParams(searchParams);
                  }}
                  className="flex items-center gap-1 text-stone-500 hover:text-red-600 font-bold transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Search</span>
                </button>
              </div>
            )}

            <Header
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onShowFilters={() => setShowMobileFilters(true)}
              sortBy={filters.sortBy}
              onSortChange={handleSortChange}
              totalResults={totalProductsCount}
              currentCount={products?.length || 0}
            />
            {products && products.length > 0 ? (
              <div className="space-y-8">
                <ProductGrid products={products} viewMode={viewMode} />
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            ) : (
              <div className="flex justify-center py-8 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-stone-600 text-sm font-medium">No products found in this selection.</p>
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
        onFilterChange={handleFilterChange}
        onClearFilters={clearAllFilters}
        categories={subCategories}
        brands={brands}
        colors={colors}
        sizes={sizes}
        subCategory={subCategory}
        handleCategoryChange={handleCategoryChange}
        totalResults={totalProductsCount}
      />

      {/* Convenient Store Outlets Callout Banner */}
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