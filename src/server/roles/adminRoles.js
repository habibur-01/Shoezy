import api from "../../api/index";
import { ADMIN_ROLES_ENDPOINT, ADMIN_ROLES_STAFF_ENDPOINT } from "../../endpoint";

/**
 * Fetch all roles (Admin)
 */
export const getAdminRoles = async () => {
  try {
    const response = await api.get(ADMIN_ROLES_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("getAdminRoles error:", error);
    throw error;
  }
};

/**
 * Create a new custom role (Admin)
 */
export const createAdminRole = async (roleData) => {
  try {
    const response = await api.post(ADMIN_ROLES_ENDPOINT, roleData);
    return response.data;
  } catch (error) {
    console.error("createAdminRole error:", error);
    throw error;
  }
};

/**
 * Update capability permissions for a role (Admin)
 */
export const updateRolePermissionsApi = async (roleId, permissions) => {
  try {
    const response = await api.patch(`${ADMIN_ROLES_ENDPOINT}/${roleId}/permissions`, { permissions });
    return response.data;
  } catch (error) {
    console.error("updateRolePermissionsApi error:", error);
    throw error;
  }
};

/**
 * Update role metadata (Admin)
 */
export const updateAdminRole = async (roleId, roleData) => {
  try {
    const response = await api.put(`${ADMIN_ROLES_ENDPOINT}/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    console.error("updateAdminRole error:", error);
    throw error;
  }
};

/**
 * Delete a custom role (Admin)
 */
export const deleteAdminRole = async (roleId) => {
  try {
    const response = await api.delete(`${ADMIN_ROLES_ENDPOINT}/${roleId}`);
    return response.data;
  } catch (error) {
    console.error("deleteAdminRole error:", error);
    throw error;
  }
};

/**
 * Fetch all administrative staff members (Admin)
 */
export const getAdminStaffMembers = async () => {
  try {
    const response = await api.get(ADMIN_ROLES_STAFF_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("getAdminStaffMembers error:", error);
    throw error;
  }
};

/**
 * Assign role to staff member (Admin)
 */
export const assignStaffRoleApi = async (userId, roleId) => {
  try {
    const response = await api.patch(`${ADMIN_ROLES_STAFF_ENDPOINT}/${userId}/role`, { roleId });
    return response.data;
  } catch (error) {
    console.error("assignStaffRoleApi error:", error);
    throw error;
  }
};

/**
 * Update staff account status (Admin)
 */
export const updateStaffStatusApi = async (userId, status) => {
  try {
    const response = await api.patch(`${ADMIN_ROLES_STAFF_ENDPOINT}/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("updateStaffStatusApi error:", error);
    throw error;
  }
};

/**
 * Invite / register new staff member (Admin)
 */
export const inviteStaffMemberApi = async (staffData) => {
  try {
    const response = await api.post(`${ADMIN_ROLES_STAFF_ENDPOINT}/invite`, staffData);
    return response.data;
  } catch (error) {
    console.error("inviteStaffMemberApi error:", error);
    throw error;
  }
};
