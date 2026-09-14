import api from "../../api/index";
import { ADMIN_ORDERS_ENDPOINT } from "../../endpoint";

/**
 * Fetch all orders for admin operations
 */
export const getAdminOrders = async () => {
  try {
    const response = await api.get(ADMIN_ORDERS_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("getAdminOrders error:", error);
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

