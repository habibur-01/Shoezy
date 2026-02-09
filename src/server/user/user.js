import api from "../../api/index";
import { GET_ORDER_ENDPOINT } from "../../endpoint";
import { getAccessToken } from "../../utils/getAccessToken";

export const getMyOrders = async data => {
  console.log("🚀 ~ getMyOrders ~ data:", data)
  const {page, limit} = data
  try {
    const result = await api.get(`${GET_ORDER_ENDPOINT}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.log('🚀 ~ adBillingAddress ~ error:', error);
    throw(error)
  }
};