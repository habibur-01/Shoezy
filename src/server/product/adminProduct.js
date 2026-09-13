import api from "../../api/index";
import {
  ADMIN_PRODUCTS_ENDPOINT,
  ADMIN_PRODUCT_ADD_ENDPOINT,
  ADMIN_PRODUCT_UPDATE_ENDPOINT,
  ADMIN_PRODUCT_DELETE_ENDPOINT,
  ADMIN_PRODUCT_STOCK_ENDPOINT,
} from "../../endpoint";

// Fetch admin products with optional filters (search, category, stockFilter, page, limit, sortBy)
export const getAdminProducts = async (params = {}) => {
  try {
    const response = await api.get(ADMIN_PRODUCTS_ENDPOINT, { params });
    return response.data;
  } catch (error) {
    console.error("getAdminProducts error:", error);
    throw error;
  }
};

// Create a new catalog product
export const createAdminProduct = async (productData) => {
  try {
    const response = await api.post(ADMIN_PRODUCT_ADD_ENDPOINT, productData);
    return response.data;
  } catch (error) {
    console.error("createAdminProduct error:", error);
    throw error;
  }
};

// Update product specs
export const updateAdminProduct = async (productId, updateData) => {
  try {
    const response = await api.put(
      `${ADMIN_PRODUCT_UPDATE_ENDPOINT}/${productId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("updateAdminProduct error:", error);
    throw error;
  }
};

// Real-time stock update
export const updateAdminProductStock = async (productId, stock) => {
  try {
    const response = await api.patch(
      `${ADMIN_PRODUCT_STOCK_ENDPOINT}/${productId}/stock`,
      { stock }
    );
    return response.data;
  } catch (error) {
    console.error("updateAdminProductStock error:", error);
    throw error;
  }
};

// Delete product
export const deleteAdminProduct = async (productId) => {
  try {
    const response = await api.delete(
      `${ADMIN_PRODUCT_DELETE_ENDPOINT}/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("deleteAdminProduct error:", error);
    throw error;
  }
};
