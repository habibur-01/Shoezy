import api from "../../api/index";
import { ADMIN_COUPONS_ENDPOINT } from "../../endpoint";

/**
 * Fetch all coupons (Admin)
 */
export const getAdminCoupons = async () => {
  try {
    const response = await api.get(ADMIN_COUPONS_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("getAdminCoupons error:", error);
    throw error;
  }
};

/**
 * Create a new coupon (Admin)
 */
export const createAdminCoupon = async (couponData) => {
  try {
    const response = await api.post(`${ADMIN_COUPONS_ENDPOINT}/create`, couponData);
    return response.data;
  } catch (error) {
    console.error("createAdminCoupon error:", error);
    throw error;
  }
};

/**
 * Update an existing coupon (Admin)
 */
export const updateAdminCoupon = async (couponId, couponData) => {
  try {
    const response = await api.put(`${ADMIN_COUPONS_ENDPOINT}/${couponId}`, couponData);
    return response.data;
  } catch (error) {
    console.error("updateAdminCoupon error:", error);
    throw error;
  }
};

/**
 * Toggle coupon active status (Admin)
 */
export const toggleAdminCouponStatus = async (couponId, isActive) => {
  try {
    const response = await api.patch(`${ADMIN_COUPONS_ENDPOINT}/${couponId}/status`, { isActive });
    return response.data;
  } catch (error) {
    console.error("toggleAdminCouponStatus error:", error);
    throw error;
  }
};

/**
 * Delete a coupon (Admin)
 */
export const deleteAdminCoupon = async (couponId) => {
  try {
    const response = await api.delete(`${ADMIN_COUPONS_ENDPOINT}/${couponId}`);
    return response.data;
  } catch (error) {
    console.error("deleteAdminCoupon error:", error);
    throw error;
  }
};

