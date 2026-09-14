import api from "../../api/index";
import {
  ADMIN_CATEGORY_ENDPOINT,
  ADMIN_CATEGORY_TREE_ENDPOINT,
  ADMIN_CATEGORY_ADD_ENDPOINT,
  ADMIN_SUBCATEGORY_ENDPOINT,
  ADMIN_SUBCATEGORY_ADD_ENDPOINT,
  ADMIN_CHILDCATEGORY_ENDPOINT,
  ADMIN_CHILDCATEGORY_ADD_ENDPOINT,
} from "../../endpoint";

// ============================================================
// CATEGORY TREE (FULL 3-TIER HIERARCHY)
// ============================================================
export const getAdminCategoryTree = async () => {
  try {
    const response = await api.get(ADMIN_CATEGORY_TREE_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("getAdminCategoryTree error:", error);
    throw error;
  }
};

// ============================================================
// LEVEL 1: CATEGORY CRUD
// ============================================================
export const getAdminCategories = async () => {
  try {
    const response = await api.get(ADMIN_CATEGORY_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("getAdminCategories error:", error);
    throw error;
  }
};

export const createAdminCategory = async (categoryData) => {
  try {
    const response = await api.post(ADMIN_CATEGORY_ADD_ENDPOINT, categoryData);
    return response.data;
  } catch (error) {
    console.error("createAdminCategory error:", error);
    throw error;
  }
};

export const updateAdminCategory = async (categoryId, updateData) => {
  try {
    const response = await api.put(
      `${ADMIN_CATEGORY_ENDPOINT}/${categoryId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("updateAdminCategory error:", error);
    throw error;
  }
};

export const deleteAdminCategory = async (categoryId) => {
  try {
    const response = await api.delete(
      `${ADMIN_CATEGORY_ENDPOINT}/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("deleteAdminCategory error:", error);
    throw error;
  }
};

export const reorderAdminCategories = async (categoryIds) => {
  try {
    const response = await api.put(
      `${ADMIN_CATEGORY_ENDPOINT}/reorder`,
      { categoryIds }
    );
    return response.data;
  } catch (error) {
    console.error("reorderAdminCategories error:", error);
    throw error;
  }
};

// ============================================================
// LEVEL 2: SUBCATEGORY CRUD
// ============================================================
export const createAdminSubCategory = async (subData) => {
  try {
    const response = await api.post(ADMIN_SUBCATEGORY_ADD_ENDPOINT, subData);
    return response.data;
  } catch (error) {
    console.error("createAdminSubCategory error:", error);
    throw error;
  }
};

export const updateAdminSubCategory = async (subId, updateData) => {
  try {
    const response = await api.put(
      `${ADMIN_SUBCATEGORY_ENDPOINT}/${subId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("updateAdminSubCategory error:", error);
    throw error;
  }
};

export const deleteAdminSubCategory = async (subId) => {
  try {
    const response = await api.delete(
      `${ADMIN_SUBCATEGORY_ENDPOINT}/${subId}`
    );
    return response.data;
  } catch (error) {
    console.error("deleteAdminSubCategory error:", error);
    throw error;
  }
};

// ============================================================
// LEVEL 3: CHILDCATEGORY CRUD
// ============================================================
export const createAdminChildCategory = async (childData) => {
  try {
    const response = await api.post(ADMIN_CHILDCATEGORY_ADD_ENDPOINT, childData);
    return response.data;
  } catch (error) {
    console.error("createAdminChildCategory error:", error);
    throw error;
  }
};

export const updateAdminChildCategory = async (childId, updateData) => {
  try {
    const response = await api.put(
      `${ADMIN_CHILDCATEGORY_ENDPOINT}/${childId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("updateAdminChildCategory error:", error);
    throw error;
  }
};

export const deleteAdminChildCategory = async (childId) => {
  try {
    const response = await api.delete(
      `${ADMIN_CHILDCATEGORY_ENDPOINT}/${childId}`
    );
    return response.data;
  } catch (error) {
    console.error("deleteAdminChildCategory error:", error);
    throw error;
  }
};
