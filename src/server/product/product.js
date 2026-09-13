import api from "../../api/index";
import {
  GET_CATEGORIES_ENDPOINT,
  GET_PRODUCTS_ENDPOINT,
  GET_SINGLE_PRODUCT_ENDPOINT,
  GET_SUBCATEGORIES_ENDPOINT,
} from "../../endpoint";

// Fetch products with support for URLSearchParams or structured filters
export const getProducts = async (options = {}) => {
  try {
    let queryString = "";

    if (options instanceof URLSearchParams || typeof options === "string") {
      queryString = options.toString();
    } else if (options.searchParams) {
      queryString = options.searchParams.toString();
    } else {
      const {
        categorySlug,
        subSlug,
        page = 1,
        limit = 12,
        filters = {},
      } = options;

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      // Categories & Subcategories & Child Categories
      if (filters.categories && filters.categories.length > 0) {
        params.append("category", filters.categories.join(","));
      } else if (categorySlug && categorySlug !== "undefined") {
        params.append("category", categorySlug);
      }

      if (filters.subCategories && filters.subCategories.length > 0) {
        params.append("sub-category", filters.subCategories.join(","));
      } else if (subSlug && subSlug !== "undefined") {
        params.append("sub-category", subSlug);
      }

      if (filters.childCategories && filters.childCategories.length > 0) {
        params.append("child-category", filters.childCategories.join(","));
      }

      // Brand, Color, Size
      if (filters.brands && filters.brands.length > 0) {
        params.append("brand", filters.brands.join(","));
      }
      if (filters.colors && filters.colors.length > 0) {
        params.append("color", filters.colors.join(","));
      }
      if (filters.sizes && filters.sizes.length > 0) {
        params.append("size", filters.sizes.join(","));
      }

      // Price Range
      if (filters.minPrice !== null && filters.minPrice !== undefined && filters.minPrice !== "") {
        params.append("minPrice", filters.minPrice);
      }
      if (filters.maxPrice !== null && filters.maxPrice !== undefined && filters.maxPrice !== "") {
        params.append("maxPrice", filters.maxPrice);
      }

      // Rating & Search & Sort
      if (filters.rating && Number(filters.rating) > 0) {
        params.append("rating", filters.rating);
      }
      if (filters.sort && filters.sort !== "default") {
        params.append("sort", filters.sort);
      }
      if (filters.sortBy && filters.sortBy !== "default") {
        params.append("sort", filters.sortBy);
      }
      if (filters.search) {
        params.append("search", filters.search);
      }

      queryString = params.toString();
    }

    const endpoint = queryString
      ? `${GET_PRODUCTS_ENDPOINT}?${queryString}`
      : GET_PRODUCTS_ENDPOINT;

    const result = await api.get(endpoint);
    return result;
  } catch (error) {
    console.error("getProducts error:", error);
    return { data: { success: false, message: error.response?.data?.message, data: [] } };
  }
};

// Get single product by slug
export const getProductsDetails = async (slug) => {
  try {
    const endpoint = `${GET_SINGLE_PRODUCT_ENDPOINT}/${slug}`;
    const result = await api.get(endpoint);
    return result;
  } catch (error) {
    console.error("getProductsDetails error:", error);
    return { data: { success: false, message: error.response?.data?.message, data: [] } };
  }
};

// Get categories
export const getCategories = async (categorySlug) => {
  try {
    const endpoint = categorySlug
      ? `${GET_CATEGORIES_ENDPOINT}/?category=${categorySlug}`
      : GET_CATEGORIES_ENDPOINT;
    const result = await api.get(endpoint);
    return result;
  } catch (error) {
    console.error("getCategories error:", error);
    return { data: { success: false, message: error.response?.data?.message, data: [] } };
  }
};

// Get subcategories
export const getSubCategories = async (categorySlug) => {
  try {
    const endpoint = `${GET_SUBCATEGORIES_ENDPOINT}/${categorySlug}`;
    const result = await api.get(endpoint);
    return result;
  } catch (error) {
    console.error("getSubCategories error:", error);
    return { data: { success: false, message: error.response?.data?.message, data: [] } };
  }
};
