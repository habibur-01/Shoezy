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
import { useNavigate, useParams } from "react-router-dom";
import { setIsLoading } from "../redux/features/loader/loaderSlice";

const ShopPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const dispatch = useDispatch()
  const products = useSelector(state => state.product.products)
  const params = useParams()
  const { categorySlug, subSlug } = params;
  const [subCategories, setSubCategories] = useState([])
  const [subCategory, setSubCategory] = useState(subSlug)
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // or 8, or 20
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    colors: [],
    priceRange: [],
    sizes: [],
    brands: [],
    rating: 0
  });

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
        setTotalPages(result.data.data.totalPages);
      }
      dispatch(setIsLoading(false));
    };
    fetchProducts();
  }, [categorySlug, subSlug, filters, page]);

  useEffect(() => {
    const loadsubCategory = async () => {
      const subData = await getSubCategories(categorySlug);

      setSubCategories(subData.data.data);
    };

    loadsubCategory();
  }, [categorySlug]);
  const handleCategoryChange = (categoryName) => {
    if (subCategory !== categoryName) {
      setSubCategory(categoryName); // update state

      // update URL param
      navigate(`/products/${categorySlug}/${categoryName}`);

      // reset page
      setPage(1);
    }
  };

  return (
    <Container >
      <Breadcrumb />
      <div className=" px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0 max-h-max sticky">
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

          {/* Main Content */}
          <div className="flex-1 sticky ">
            <h1 className="text-[var(--color-black)] font-medium text-2xl capitalize mb-4">
              {subSlug ? subSlug : categorySlug}
            </h1>
            <Header
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onShowFilters={() => setShowMobileFilters(true)}
            />
            {products.length > 0 ? (
              <div>
                <ProductGrid products={products} viewMode={viewMode} />
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            ) : (
              <div className="flex justify-center py-5">
                <p>Sorry, this category has no product</p>
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
      />
    </Container>
  );
};

export default ShopPage;