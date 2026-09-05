import api from "../../api/index";

export const getWishlist = async () => {
  try {
    const res = await api.get("/api/wishlist");
    return res;
  } catch (error) {
    console.error("getWishlist API error:", error);
    return error.response;
  }
};

export const addToWishlist = async (productId) => {
  try {
    const res = await api.post("/api/wishlist", { productId });
    return res;
  } catch (error) {
    console.error("addToWishlist API error:", error);
    return error.response;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const res = await api.delete(`/api/wishlist/${productId}`);
    return res;
  } catch (error) {
    console.error("removeFromWishlist API error:", error);
    return error.response;
  }
};

export const getWishlistCount = async () => {
  try {
    const res = await api.get("/api/wishlist/count");
    return res;
  } catch (error) {
    console.error("getWishlistCount API error:", error);
    return error.response;
  }
};

export const checkWishlistStatus = async (productId) => {
  try {
    const res = await api.get(`/api/wishlist/check/${productId}`);
    return res;
  } catch (error) {
    console.error("checkWishlistStatus API error:", error);
    return error.response;
  }
};
