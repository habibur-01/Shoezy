import api from "../../api/index";
import { APPLY_COUPON_CODE_ENDPOINT, COUNT_CART_ITEM_ENDPOINT, GET_CART_ITEM_ENDPOINT, GET_CART_ITEM_UPDATE_ENDPOINT, POST_CART_ITEM_ENDPOINT, REMOVE_CART_ITEM_ENDPOINT } from "../../endpoint";
import { getAccessToken } from "../../utils/getAccessToken";
export const addToCart = async data => {
  try {
    const result = await api.post(POST_CART_ITEM_ENDPOINT, data, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.log('🚀 ~ adBillingAddress ~ error:', error);
    throw(error)
  }
};
// get cart item
export const getCartItem = async () => {
  try {
    const result = await api.get(GET_CART_ITEM_ENDPOINT, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.log('🚀 ~ getCartItem ~ error:', error);
    throw(error)
  }
};

// update cart item quantity and sutitle
export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    const result = await api.put(GET_CART_ITEM_UPDATE_ENDPOINT, { itemId, quantity }, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.log('🚀 ~ getCartItem ~ error:', error);
    throw (error)
  }
};

// remove cart item
export const removeCartItem = async (itemId) => {
  try {
    const result = await api.delete(`${REMOVE_CART_ITEM_ENDPOINT}/${itemId}`, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.log('🚀 ~ getCartItem ~ error:', error);
    throw (error)
  }
};

// clear cart 
export const clearCartItem = async (itemId) => {
  try {
    const result = await api.put(`${REMOVE_CART_ITEM_ENDPOINT}/${itemId}`, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
    return result;
  } catch (error) {
    console.log('🚀 ~ getCartItem ~ error:', error);
    throw(error)
  }
};

export const totalCartItem = async () => {
  try {

    const totalItem = await api.get(`${COUNT_CART_ITEM_ENDPOINT}`, {
      headers: {
        Authorization: await getAccessToken(),
      }
    },)

    return totalItem;
  } catch (error) {
    
    throw (error)
  }
}


export const applyCouponCode = async (couponCode) => {
  try {
    const result = await api.post(APPLY_COUPON_CODE_ENDPOINT, { couponCode }, {
      headers: {
        Authorization: await getAccessToken()
      }
    })
    return result;
  } catch (error) {
    throw error;
  }
}