import api from "../../api/index";
import { ADDRESS_ENDPOINT, BILLING_ADDRESS_ENDPOINT, HAS_ADDRESS_ENDPOINT } from "../../endpoint";

// Get all saved addresses for current user
export const getUserAddresses = async () => {
  try {
    const result = await api.get(ADDRESS_ENDPOINT);
    return result;
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw error;
  }
};

// Add new address
export const addBillingAddress = async (data) => {
  try {
    const result = await api.post(ADDRESS_ENDPOINT, data);
    return result;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

// Update existing address
export const updateAddress = async (id, data) => {
  try {
    const result = await api.put(`${ADDRESS_ENDPOINT}/${id}`, data);
    return result;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

// Delete address
export const deleteAddress = async (id) => {
  try {
    const result = await api.delete(`${ADDRESS_ENDPOINT}/${id}`);
    return result;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};

// Set address as default
export const setDefaultAddress = async (id) => {
  try {
    const result = await api.patch(`${ADDRESS_ENDPOINT}/${id}/default`);
    return result;
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
};

// Get default billing / shipping address
export const getBillingAddress = async () => {
  try {
    const result = await api.get("/api/user/billing-address");
    return result;
  } catch (error) {
    console.error("Error getting billing address:", error);
    throw error;
  }
};

// Check if user has billing address
export const hasBillingAddress = async () => {
  try {
    const result = await api.get(HAS_ADDRESS_ENDPOINT);
    return result;
  } catch (error) {
    console.error("Error checking billing address:", error);
    throw error;
  }
};