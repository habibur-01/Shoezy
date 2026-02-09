import React, { useEffect, useState } from "react";
import CartItem from "../../components/Cart/CartItem";
import OrderSummary from "../../components/Cart/OrderSummary";
import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import { getCartItem } from "../../server/cart/cart";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../components/common/loader/Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { decrementCartItem, incrementCartItem, removeItemFromCart } from "../../utils/cartHandler"
import { applyCouponCode as applyCouponAPI } from "../../server/cart/cart";
import { setCarts } from "../../redux/features/cart/cartSlice";


const CartPage = () => {
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const [couponError, setCouponError] = useState("");

    // Fetch Cart
    const { data: cartItems, isLoading } = useQuery({
        queryKey: ["cart"],
        retry: false,
        queryFn: async () => {
            const result = await getCartItem();
            return result?.data?.data;
        },
    });


    // Apply coupon mutation
    const {
        mutate,
        isPending: isApplying,

    } = useMutation({
        mutationFn: ({ couponCode }) => applyCouponAPI(couponCode),
        retry: false,
        onSuccess: (data) => {
            // console.log("🚀 ~ CartPage ~ data:", data)
            setCouponError("");
            // Update cart totals in cache (UI only)
            queryClient.setQueryData(["cart"], (oldCart) => ({
                ...oldCart,
                discount: data.data.data.discount,
                finalPrice: data.data.data.finalPrice,
                appliedCoupon: data.data.data.appliedCoupon
            }));
        },
        onError: (error) => {
            console.log(error.response)
            // Show coupon error message
            setCouponError(
                error.response?.data?.message
            );
        },
    });

    // Handler for applying coupon
    const handleApplyCoupon = (couponCode) => {
        console.log("🚀 ~ handleApplyCoupon ~ couponCode:", couponCode)
        if (!couponCode) return;
        mutate({ couponCode });
    };

    useEffect(() => {
        if (cartItems) {
            dispatch(setCarts({
                items: cartItems?.items,
                totalPrice: cartItems?.totalPrice,
                discount: cartItems?.discount,
                finalPrice: cartItems?.finalPrice,
                appliedCoupon: cartItems.appliedCoupon
            }));
        }
    }, [cartItems]);

    return (
        <Container>
            <Breadcrumb />
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
                <div className="max-w-6xl mx-auto py-10 flex gap-5">
                    <div className="w-2/3 pr-8">

                        <table className="w-full text-left">
                            <thead className="bg-transparent border-b border-gray-200">
                                <tr>
                                    <th className="py-2 px-3 font-medium">PRODUCT</th>
                                    <th className="py-2 px-3 font-medium">PRICE</th>
                                    <th className="py-2 px-3 font-medium">Size</th>
                                    <th className="py-2 px-3 text-center font-medium">QUANTITY</th>
                                    <th className="py-2 px-3 text-center font-medium">TOTAL</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {cartItems?.items?.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-6">
                                            Your cart is empty
                                        </td>
                                    </tr>
                                )}

                                {cartItems?.items?.map((item) => (
                                    <CartItem
                                        key={item._id}
                                        item={item}
                                        onIncrement={() => incrementCartItem(queryClient, item._id, item.quantity, item?.product.variantStock)}
                                        onDecrement={() => decrementCartItem(queryClient, item._id, item.quantity)}
                                        onRemove={() => removeItemFromCart(queryClient, dispatch, item._id)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-1/3 ">
                        <OrderSummary
                            cartItems={{...cartItems}}
                            discount={cartItems?.discount}
                            onApplyCoupon={handleApplyCoupon}
                            couponError={couponError}
                            isApplying={isApplying}
                        />
                    </div>
                </div>
            )}
        </Container>
    );
};

export default CartPage;
