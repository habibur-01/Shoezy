import api from "../../api/index";
import { getAccessToken } from "../../utils/getAccessToken";

export const getUserPaymentOptions = async () => {
  try {
    const res = await api.get("/api/user/payment-options", {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return res;
  } catch (error) {
    console.error("getUserPaymentOptions API error:", error);
    return {
      data: {
        success: false,
        data: [],
      },
    };
  }
};

export const createUserPaymentOption = async (data) => {
  try {
    const res = await api.post("/api/user/payment-options", data, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return res;
  } catch (error) {
    console.error("createUserPaymentOption API error:", error);
    throw error;
  }
};

export const updateUserPaymentOption = async (id, data) => {
  try {
    const res = await api.put(`/api/user/payment-options/${id}`, data, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return res;
  } catch (error) {
    console.error("updateUserPaymentOption API error:", error);
    throw error;
  }
};

export const deleteUserPaymentOption = async (id) => {
  try {
    const res = await api.delete(`/api/user/payment-options/${id}`, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return res;
  } catch (error) {
    console.error("deleteUserPaymentOption API error:", error);
    throw error;
  }
};

export const setDefaultPaymentOption = async (id) => {
  try {
    const res = await api.patch(`/api/user/payment-options/${id}/default`, {}, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return res;
  } catch (error) {
    console.error("setDefaultPaymentOption API error:", error);
    throw error;
  }
};
