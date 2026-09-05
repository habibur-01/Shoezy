import api from "../../api/index";

export const getProductReviews = async (productId) => {
  try {
    const res = await api.get(`/api/user/review/${productId}`);
    return res;
  } catch (error) {
    console.error("getProductReviews API error:", error);
    return {
      data: {
        success: false,
        data: [],
      },
    };
  }
};

export const checkCanUserReview = async (productId) => {
  try {
    const res = await api.get(`/api/user/review/can-review/${productId}`);
    return res;
  } catch (error) {
    console.error("checkCanUserReview API error:", error);
    return {
      data: {
        success: false,
        data: { canReview: false, hasReviewed: false },
      },
    };
  }
};

export const createOrUpdateReview = async (reviewData) => {
  try {
    const res = await api.post("/api/user/review/add", reviewData);
    return res;
  } catch (error) {
    console.error("createOrUpdateReview API error:", error);
    throw error;
  }
};

export const deleteReview = async (productId) => {
  try {
    const res = await api.delete(`/api/user/review/delete/${productId}`);
    return res;
  } catch (error) {
    console.error("deleteReview API error:", error);
    throw error;
  }
};
