import { toast } from "react-toastify";
import { removeCartItem, updateCartItemQuantity } from "../server/cart/cart";
import { removeOneFromCount } from "../redux/features/initial/initialSlice";



export const incrementCartItem = async (queryClient, itemId, currentQuantity, stock) => {
  if (stock === currentQuantity) return;

  const newQuantity = currentQuantity + 1;

  const res = await updateCartItemQuantity(itemId, newQuantity);

  if (res?.data?.success) {
    // 🔥 Refresh cart
    queryClient.invalidateQueries(["cart"]);
  }

  return res;
};

export const decrementCartItem = async (queryClient, itemId, currentQuantity) => {
  if (currentQuantity <= 1) return;

  const newQuantity = currentQuantity - 1;

  const res = await updateCartItemQuantity(itemId, newQuantity);

  if (res?.data?.success) {
    queryClient.invalidateQueries(["cart"]);
  }

  return res;
};

export const removeItemFromCart = async (queryClient, dispatch, itemId) => {
  const res = await removeCartItem(itemId);

  if (res?.data?.success) {
    dispatch(removeOneFromCount())
    toast.success("Item removed");
    queryClient.invalidateQueries(["cart"]);
  }

  return res;
};



