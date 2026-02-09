import api from "../../api/index";
import { CREATE_ORDER_ENDPOINT } from "../../endpoint";
import { getAccessToken } from "../../utils/getAccessToken";

export const createOrder = async data => {
    console.log(data)
  try {
    const result = await api.post(CREATE_ORDER_ENDPOINT, data, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.log('🚀 ~ create order ~ error:', error);
    throw(error)
  }
};