import api from "../../api/index";
import { ADMIN_ORDERS_ENDPOINT } from "../../endpoint";

/**
 * Fetch all orders for admin operations with optional query parameters (status, search, page, limit, etc.)
 */
export const getAdminOrders = async (params = {}) => {
  try {
    const response = await api.get(ADMIN_ORDERS_ENDPOINT, { params });
    return response.data;
  } catch (error) {
    console.error("getAdminOrders error:", error);
    throw error;
  }
};

/**
 * Fetch single order by ID with populated details
 */
export const getAdminOrderById = async (orderId) => {
  try {
    const response = await api.get(`${ADMIN_ORDERS_ENDPOINT}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("getAdminOrderById error:", error);
    throw error;
  }
};

export const updateAdminOrderStatus = async (orderId, status, details = {}) => {
  try {
    const response = await api.put(`${ADMIN_ORDERS_ENDPOINT}/${orderId}/status`, {
      status,
      ...details,
    });
    return response.data;
  } catch (error) {
    console.error("updateAdminOrderStatus error:", error);
    throw error;
  }
};

/**
 * Fetch activity audit trail for an order
 */
export const getOrderActivities = async (orderId) => {
  try {
    const response = await api.get(`${ADMIN_ORDERS_ENDPOINT}/${orderId}/activities`);
    return response.data;
  } catch (error) {
    console.error("getOrderActivities error:", error);
    throw error;
  }
};

