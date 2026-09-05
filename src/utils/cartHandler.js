import { toast } from "react-toastify";
import { removeCartItem, updateCartItemQuantity } from "../server/cart/cart";
import { removeOneFromCount } from "../redux/features/initial/initialSlice";

export const incrementCartItem = async (queryClient, itemId, currentQuantity, stock, setIsUpdating) => {
  if (stock && currentQuantity >= stock) {
    toast.warning(`Maximum available stock reached (${stock})`);
    return;
  }

  const newQuantity = currentQuantity + 1;

  if (setIsUpdating) setIsUpdating(true);

  try {
    const res = await updateCartItemQuantity(itemId, newQuantity);
    if (res?.data?.success) {
      await queryClient.invalidateQueries(["cart"]);
    } else {
      toast.error(res?.data?.message || "Failed to update quantity");
    }
    return res;
  } catch (error) {
    console.error("incrementCartItem error:", error);
    toast.error("Error updating cart quantity");
  } finally {
    if (setIsUpdating) setIsUpdating(false);
  }
};

export const decrementCartItem = async (queryClient, itemId, currentQuantity, setIsUpdating) => {
  if (currentQuantity <= 1) return;

  const newQuantity = currentQuantity - 1;

  if (setIsUpdating) setIsUpdating(true);

  try {
    const res = await updateCartItemQuantity(itemId, newQuantity);
    if (res?.data?.success) {
      await queryClient.invalidateQueries(["cart"]);
    } else {
      toast.error(res?.data?.message || "Failed to update quantity");
    }
    return res;
  } catch (error) {
    console.error("decrementCartItem error:", error);
    toast.error("Error updating cart quantity");
  } finally {
    if (setIsUpdating) setIsUpdating(false);
  }
};

export const removeItemFromCart = async (queryClient, dispatch, itemId, setIsUpdating) => {
  if (setIsUpdating) setIsUpdating(true);

  try {
    const res = await removeCartItem(itemId);
    if (res?.data?.success) {
      if (dispatch) dispatch(removeOneFromCount());
      toast.success("Item removed from cart");
      await queryClient.invalidateQueries(["cart"]);
    } else {
      toast.error(res?.data?.message || "Failed to remove item");
    }
    return res;
  } catch (error) {
    console.error("removeItemFromCart error:", error);
    toast.error("Error removing item from cart");
  } finally {
    if (setIsUpdating) setIsUpdating(false);
  }
};
