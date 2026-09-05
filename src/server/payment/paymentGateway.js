import api from "../../api/index";

// Customer active gateways call
export const getActivePaymentGateways = async () => {
  try {
    const res = await api.get("/api/user/payment-gateways");
    return res;
  } catch (error) {
    console.error("getActivePaymentGateways API error:", error);
    return {
      data: {
        success: true,
        data: [],
      },
    };
  }
};
export const getActivePaymentMethods = async () => {
  try {
    const res = await api.get("/api/user/payment-gateways");
    return res;
  } catch (error) {
    console.error("getActivePaymentGateways API error:", error);
    return {
      data: {
        success: true,
        data: [],
      },
    };
  }
};

// Admin list all gateways & sub-methods
export const getAllPaymentGateways = async () => {
  try {
    const res = await api.get("/api/admin/payment-gateways");
    return res;
  } catch (error) {
    console.error("getAllPaymentGateways API error:", error);
    throw error;
  }
};

// Admin create new gateway category
export const createPaymentGateway = async (data) => {
  try {
    const res = await api.post("/api/admin/payment-gateways", data);
    return res;
  } catch (error) {
    console.error("createPaymentGateway API error:", error);
    throw error;
  }
};

// Admin update gateway category
export const updatePaymentGateway = async (id, data) => {
  try {
    const res = await api.put(`/api/admin/payment-gateways/${id}`, data);
    return res;
  } catch (error) {
    console.error("updatePaymentGateway API error:", error);
    throw error;
  }
};

// Admin delete gateway category
export const deletePaymentGateway = async (id) => {
  try {
    const res = await api.delete(`/api/admin/payment-gateways/${id}`);
    return res;
  } catch (error) {
    console.error("deletePaymentGateway API error:", error);
    throw error;
  }
};

// Admin add payment method under gateway
export const addPaymentMethod = async (gatewayId, data) => {
  try {
    const res = await api.post(`/api/admin/payment-gateways/${gatewayId}/methods`, data);
    return res;
  } catch (error) {
    console.error("addPaymentMethod API error:", error);
    throw error;
  }
};

// Admin update payment method under gateway
export const updatePaymentMethod = async (gatewayId, methodId, data) => {
  try {
    const res = await api.put(`/api/admin/payment-gateways/${gatewayId}/methods/${methodId}`, data);
    return res;
  } catch (error) {
    console.error("updatePaymentMethod API error:", error);
    throw error;
  }
};

// Admin delete payment method under gateway
export const deletePaymentMethod = async (gatewayId, methodId) => {
  try {
    const res = await api.delete(`/api/admin/payment-gateways/${gatewayId}/methods/${methodId}`);
    return res;
  } catch (error) {
    console.error("deletePaymentMethod API error:", error);
    throw error;
  }
};
