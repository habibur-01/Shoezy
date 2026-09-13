import api from "../../api/index";
import { ADMIN_DASHBOARD_ENDPOINT } from "../../endpoint";

// Fetch full consolidated dashboard payload (overview, revenueTrend, criticalInventory, topSellingProducts, recentOrders, etc.)
export const getDashboardData = async (timeframe = "7d") => {
  try {
    const response = await api.get(ADMIN_DASHBOARD_ENDPOINT, {
      params: { timeframe: timeframe.toLowerCase() },
    });
    return response.data;
  } catch (error) {
    console.error("getDashboardData error:", error);
    throw error;
  }
};

// Fetch overview KPIs separately if needed
export const getDashboardOverview = async (timeframe = "7d") => {
  try {
    const response = await api.get(`${ADMIN_DASHBOARD_ENDPOINT}/overview`, {
      params: { timeframe: timeframe.toLowerCase() },
    });
    return response.data;
  } catch (error) {
    console.error("getDashboardOverview error:", error);
    throw error;
  }
};

// Fetch revenue velocity chart series
export const getRevenueTrend = async (timeframe = "7d") => {
  try {
    const response = await api.get(`${ADMIN_DASHBOARD_ENDPOINT}/revenue-trend`, {
      params: { timeframe: timeframe.toLowerCase() },
    });
    return response.data;
  } catch (error) {
    console.error("getRevenueTrend error:", error);
    throw error;
  }
};

// Fetch top selling products
export const getTopProducts = async (limit = 5, timeframe = "7d") => {
  try {
    const response = await api.get(`${ADMIN_DASHBOARD_ENDPOINT}/top-products`, {
      params: { limit, timeframe: timeframe.toLowerCase() },
    });
    return response.data;
  } catch (error) {
    console.error("getTopProducts error:", error);
    throw error;
  }
};

// Fetch critical stock / inventory alerts
export const getCriticalInventory = async (limit = 10) => {
  try {
    const response = await api.get(`${ADMIN_DASHBOARD_ENDPOINT}/inventory-alerts`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("getCriticalInventory error:", error);
    throw error;
  }
};
