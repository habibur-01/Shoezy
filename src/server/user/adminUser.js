import api from "../../api/index";
import { ADMIN_USERS_ENDPOINT } from "../../endpoint";

/**
 * Fetch all registered users (Admin only)
 */
export const getAllAdminUsers = async () => {
  try {
    const response = await api.get(ADMIN_USERS_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("getAllAdminUsers error:", error);
    throw error;
  }
};

/**
 * Fetch single user by ID (Admin only)
 */
export const getAdminUserById = async (userId) => {
  try {
    const response = await api.get(`${ADMIN_USERS_ENDPOINT}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("getAdminUserById error:", error);
    throw error;
  }
};

/**
 * Update user role (admin, customer, user, manager)
 */
export const updateAdminUserRole = async (userId, role) => {
  try {
    const response = await api.patch(`${ADMIN_USERS_ENDPOINT}/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error("updateAdminUserRole error:", error);
    throw error;
  }
};

/**
 * Update user account status (active, inactive, suspended, pending)
 */
export const updateAdminUserStatus = async (userId, status) => {
  try {
    const response = await api.patch(`${ADMIN_USERS_ENDPOINT}/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("updateAdminUserStatus error:", error);
    throw error;
  }
};

/**
 * Update user profile details (name, email, phone, role, status)
 */
export const updateAdminUser = async (userId, userData) => {
  try {
    const response = await api.put(`${ADMIN_USERS_ENDPOINT}/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("updateAdminUser error:", error);
    throw error;
  }
};

/**
 * Create a new user from Admin console
 */
export const createAdminUser = async (userData) => {
  try {
    const response = await api.post(ADMIN_USERS_ENDPOINT, userData);
    return response.data;
  } catch (error) {
    console.error("createAdminUser error:", error);
    throw error;
  }
};

/**
 * Delete a user account (Admin only)
 */
export const deleteAdminUser = async (userId) => {
  try {
    const response = await api.delete(`${ADMIN_USERS_ENDPOINT}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("deleteAdminUser error:", error);
    throw error;
  }
};
