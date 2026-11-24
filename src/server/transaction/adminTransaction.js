import api from "../../api/index";
import { ADMIN_TRANSACTIONS_ENDPOINT } from "../../endpoint";

/**
 * Fetch all transactions for admin operations with optional filters (status, gateway, search, date range, pagination)
 */
export const getAdminTransactions = async (params = {}) => {
  try {
    const response = await api.get(ADMIN_TRANSACTIONS_ENDPOINT, { params });
    return response.data;
  } catch (error) {
    console.error("getAdminTransactions error:", error);
    throw error;
  }
};

/**
 * Fetch single transaction details by ID or transaction ID
 */
export const getAdminTransactionById = async (id) => {
  try {
    const response = await api.get(`${ADMIN_TRANSACTIONS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("getAdminTransactionById error:", error);
    throw error;
  }
};

/**
 * Fetch aggregated ledger statistics
 */
export const getAdminTransactionStats = async () => {
  try {
    const response = await api.get(`${ADMIN_TRANSACTIONS_ENDPOINT}/stats`);
    return response.data;
  } catch (error) {
    console.error("getAdminTransactionStats error:", error);
    throw error;
  }
};

export const verifyManualPayment = async (id) => {
  const response = await api.patch(`${ADMIN_TRANSACTIONS_ENDPOINT}/${id}/verify`);
  return response.data;
};
