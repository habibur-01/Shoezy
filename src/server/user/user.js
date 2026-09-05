import api from "../../api/index";
import { GET_ORDER_ENDPOINT } from "../../endpoint";
import { getAccessToken } from "../../utils/getAccessToken";

export const getMyOrders = async (data) => {
  const { page = 1, limit = 10 } = data || {};
  try {
    const result = await api.get(`${GET_ORDER_ENDPOINT}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.error("getMyOrders error:", error);
    throw error;
  }
};

export const getMyReturns = async (data) => {
  const { page = 1, limit = 10 } = data || {};
  try {
    const result = await api.get(`/api/user/order/returns?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.error("getMyReturns API error:", error);
    throw error;
  }
};

export const getMyCancellations = async (data) => {
  const { page = 1, limit = 10 } = data || {};
  try {
    const result = await api.get(`/api/user/order/cancelled?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.error("getMyCancellations API error:", error);
    throw error;
  }
};

export const trackOrder = async (orderId) => {
  try {
    const result = await api.get(`/api/user/order/track/${orderId}`, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.error("trackOrder API error:", error);
    throw error;
  }
};