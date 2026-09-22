import api from "../../api/index";
import {
  ADMIN_BRAND_ENDPOINT,
  ADMIN_BRAND_ADD_ENDPOINT,
} from "../../endpoint";

// ============================================================
// BRAND MANAGEMENT CRUD API
// ============================================================

/**
 * Fetch all catalog brands
 */
export const getAdminBrands = async (params = {}) => {
  try {
    const response = await api.get(ADMIN_BRAND_ENDPOINT, { params });
    return response.data;
  } catch (error) {
    console.error("getAdminBrands error:", error);
    throw error;
  }
};

/**
 * Create a new brand
 */
export const createAdminBrand = async (brandData) => {
  try {
    const response = await api.post(ADMIN_BRAND_ADD_ENDPOINT, brandData);
    return response.data;
  } catch (error) {
    console.error("createAdminBrand error:", error);
    throw error;
  }
};

/**
 * Update an existing brand by ID
 */
export const updateAdminBrand = async (brandId, updateData) => {
  try {
    const response = await api.put(
      `${ADMIN_BRAND_ENDPOINT}/${brandId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("updateAdminBrand error:", error);
    throw error;
  }
};

/**
 * Delete a brand by ID
 */
export const deleteAdminBrand = async (brandId) => {
  try {
    const response = await api.delete(
      `${ADMIN_BRAND_ENDPOINT}/${brandId}`
    );
    return response.data;
  } catch (error) {
    console.error("deleteAdminBrand error:", error);
    throw error;
  }
};
