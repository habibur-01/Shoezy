import api from "../../api/index";
import { GET_CATEGORIES_ENDPOINT, GET_PRODUCTS_ENDPOINT, GET_SINGLE_PRODUCT_ENDPOINT, GET_SUBCATEGORIES_ENDPOINT } from "../../endpoint";

export const getProducts = async ({
  categorySlug,
  subSlug,
  page,
  limit,
  filters = {}
}) => {

  const {
    brands = [],
    colors = [],
    priceRange = [],
    sizes = [],
    rating = 0
  } = filters;

  try {
    let params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (brands.length > 0) params.append("brands", brands.join(","));
    if (colors.length > 0) params.append("colors", colors.join(","));

    if (priceRange.length === 2) {
      params.append("minPrice", priceRange[0]);
      params.append("maxPrice", priceRange[1]);
    }

    if (sizes.length > 0) params.append("sizes", sizes.join(","));
    if (rating > 0) params.append("rating", rating);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.search) params.append("search", filters.search);

    const endpoint = (categorySlug && categorySlug !== "undefined")
      ? (subSlug && subSlug !== "undefined"
          ? `${GET_PRODUCTS_ENDPOINT}/${categorySlug}/${subSlug}?${params.toString()}`
          : `${GET_PRODUCTS_ENDPOINT}/${categorySlug}?${params.toString()}`)
      : `${GET_PRODUCTS_ENDPOINT}?${params.toString()}`;

    const result = await api.get(endpoint)

    return result;
  } catch (error) {
    console.error("getProducts error:", error);
    return { data: { success: false, message: error.response?.data?.message, data: [] } };
  }
};


// get single products
export const getProductsDetails = async (slug) => {
  try {
    const endpoint = `${GET_SINGLE_PRODUCT_ENDPOINT}/${slug}`
    const result = await api.get(endpoint);

    return result;
  } catch (error) {
    console.error('getProducts error:', error);
    return { data: { success: false, message: error.response?.data?.message, data: [] } };
  }
};
// get single products
export const getCategories = async (categorySlub) => {
  try {
    const endpoint = `${GET_CATEGORIES_ENDPOINT}/?category=${categorySlub}`
    const result = await api.get(endpoint);

    return result;
  } catch (error) {
    console.error('getCategories error:', error);
    return { data: { success: false, message: error.response?.data?.message, data: [] } };
  }
};
// get single products
export const getSubCategories = async (categorySlub) => {
  try {
    const endpoint = `${GET_SUBCATEGORIES_ENDPOINT}/${categorySlub}`
    const result = await api.get(endpoint);

    return result;
  } catch (error) {
    console.error('getCategories error:', error);
    return { data: { success: false, message: error.response?.data?.message, data: [] } };
  }
};


