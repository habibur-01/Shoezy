import api from "../../api/index";
import {
  APPLY_COUPON_CODE_ENDPOINT,
  COUNT_CART_ITEM_ENDPOINT,
  GET_CART_ITEM_ENDPOINT,
  GET_CART_ITEM_UPDATE_ENDPOINT,
  POST_CART_ITEM_ENDPOINT,
  REMOVE_CART_ITEM_ENDPOINT,
} from "../../endpoint";

const GUEST_CART_KEY = "guest_cart";

// Helper: Get local storage guest cart items
export const getLocalGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("getLocalGuestCart error:", err);
    return [];
  }
};

// Helper: Save local storage guest cart items
export const saveLocalGuestCart = (items) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("saveLocalGuestCart error:", err);
  }
};

// Add item to cart (Guest localStorage OR Authenticated Database)
export const addToCart = async (data,isAuthenticated) => {
  

  // If user is authenticated, save directly to database
  if (isAuthenticated) {
    try {
      const result = await api.post(POST_CART_ITEM_ENDPOINT, data);
      return result;
    } catch (error) {
      console.error("addToCart API error:", error);
      throw error;
    }
  }

  // If user is NOT logged in, save to localStorage guest_cart
  const guestItems = getLocalGuestCart();
  const productId = typeof data.product === "object" ? data.product?._id : data.product;
  const quantity = Number(data.quantity) || 1;
  const price = Number(data.price) || 0;
  const selectedSize = data.selectedSize || null;
  const selectedColor = data.selectedColor || null;

  const productObj = typeof data.product === "object" ? data.product : {
    _id: productId,
    name: data.name || data.productObj?.name || "Product",
    image: data.image || data.productObj?.image || data.productObj?.images?.cover || "/placeholder.jpg",
    price: price,
    variantColor: selectedColor,
    variantSize: selectedSize,
    variantStock: 99,
  };

  const normSize = selectedSize ? String(selectedSize).trim().toLowerCase() : "";
  const normColor = selectedColor ? String(selectedColor).trim().toLowerCase() : "";

  const existingIndex = guestItems.findIndex((item) => {
    const itemProdId = typeof item.product === "object" ? item.product?._id : item.product;
    const itemSize = item.selectedSize ? String(item.selectedSize).trim().toLowerCase() : "";
    const itemColor = item.selectedColor ? String(item.selectedColor).trim().toLowerCase() : "";
    return String(itemProdId) === String(productId) && itemSize === normSize && itemColor === normColor;
  });

  if (existingIndex > -1) {
    guestItems[existingIndex].quantity += quantity;
    guestItems[existingIndex].subtotal =
      guestItems[existingIndex].quantity * guestItems[existingIndex].price;
  } else {
    guestItems.push({
      _id: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      product: productObj,
      quantity,
      price,
      subtotal: price * quantity,
      selectedSize,
      selectedColor,
    });
  }

  saveLocalGuestCart(guestItems);

  return {
    data: {
      success: true,
      message: "Item saved to offline cart",
      data: { items: guestItems },
    },
  };
};

// Get cart items (Database OR localStorage fallback)
export const getCartItem = async (isAuthenticated) => {
 

  if (isAuthenticated) {
    try {
      const result = await api.get(GET_CART_ITEM_ENDPOINT);
      return result;
    } catch (error) {
      console.error("getCartItem API error:", error);
      throw error;
    }
  }

  // Fallback to local guest cart
  const guestItems = getLocalGuestCart();
  const total = guestItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  return {
    data: {
      success: true,
      data: {
        items: guestItems,
        totalPrice: total,
        discount: 0,
        finalPrice: total,
        appliedCoupon: "",
      },
    },
  };
};

// Update cart item quantity
export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    const result = await api.put(GET_CART_ITEM_UPDATE_ENDPOINT, {
      itemId,
      quantity,
    });
    return result;
  } catch (error) {
    console.error("updateCartItemQuantity API error:", error);
    throw error;
  }
};

// Remove cart item
export const removeCartItem = async (itemId) => {
  try {
    const result = await api.delete(`${REMOVE_CART_ITEM_ENDPOINT}/${itemId}`);
    return result;
  } catch (error) {
    console.error("removeCartItem API error:", error);
    throw error;
  }
};

// Clear cart
export const clearCartItem = async (itemId) => {
  try {
    const result = await api.put(`${REMOVE_CART_ITEM_ENDPOINT}/${itemId}`, {});
    return result;
  } catch (error) {
    console.error("clearCartItem API error:", error);
    throw error;
  }
};

// Get total cart item count
export const totalCartItem = async (isAuthenticated) => {
  if (isAuthenticated) {
    try {
      const response = await api.get(
        COUNT_CART_ITEM_ENDPOINT
      );

      return response;
    } catch (error) {
      console.error(
        "totalCartItem API error:",
        error
      );

      return {
        data: {
          success: false,
          data: 0,
        },
      };
    }
  }

  // Guest user
  const guestItems = getLocalGuestCart();

  return {
    data: {
      success: true,
      data: guestItems.length,
    },
  };
};

// Apply coupon code
export const applyCouponCode = async (couponCode) => {
  try {
    const result = await api.post(APPLY_COUPON_CODE_ENDPOINT, { couponCode });
    return result;
  } catch (error) {
    console.log("🚀 ~ applyCouponCode ~ error:", error);
    throw error;
  }
};

// Remove applied coupon code

export const removeCouponCode = async () => {
  try {

    const result = await api.delete("/api/user/cart/coupon");
    return result;
  } catch (error) {
    console.log("🚀 ~ removeCouponCode ~ error:", error)
  }
};

// Synchronize guest cart items with server database upon login
export const syncGuestCartWithServer = async () => {
  try {

    const guestItems = getLocalGuestCart();
    if (!guestItems || guestItems.length === 0) return;

    const res = await api.post(
      "/api/user/cart/sync",
      { items: guestItems },

    );

    if (res?.data?.success) {
      localStorage.removeItem(GUEST_CART_KEY);
      console.log("Guest cart synchronized to database successfully");
    }
  } catch (error) {
    console.error("syncGuestCartWithServer error:", error);
  }
};