import { User, ShieldCheck } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddresses, getBillingAddress } from "../../server/billing/billing";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import Container from "../../components/common/Container/Container";
import CheckoutSummary from "../../components/checkout/CheckoutSummary";
import { createOrder } from "../../server/checkout/checkout";
import LoadingSpin from "../../components/common/loader/LoadingSpin";
import { toast } from "react-toastify";
import DeliveryAddress from "../../components/checkout/DeliveryAddress";
import { setCarts } from "../../redux/features/cart/cartSlice";
import PaymentMethod from "./PaymentMethod";
import OrderConfirmation from "../../components/checkout/OrderConfirmation";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [trxId, setTrxId] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const cartItems = useSelector((state) => state.cart.carts);
  const user = useSelector((state) => state.auth.user);
  const [errorMsg, setErrorMsg] = useState({ addressErr: null, paymentErr: null });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Fetch All User Saved Addresses
  const { data: addresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const result = await getUserAddresses();
      return result?.data?.data || [];
    },
  });
  console.log("🚀 ~ CheckoutPage ~ addresses:", addresses)
 

 

  // Set default active selected address
  useEffect(() => {
    if (addresses?.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addresses, selectedAddress]);

  const activeAddr = selectedAddress;
  console.log("🚀 ~ CheckoutPage ~ activeAddr:", activeAddr)
  const hasAddress = Boolean(activeAddr && (activeAddr.addressLine || activeAddr.shippingAddress?.address));

  const products = cartItems?.items || [];
  const deliveryFee = 0;
  const serviceFee = 0;
  const vat = 0;

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      setErrorMsg({ addressErr: null, paymentErr: null });

      if (!hasAddress || !activeAddr) {
        setErrorMsg({ addressErr: "Please add or select a delivery address before placing an order", paymentErr: null });
        toast.warning("Delivery address required");
        return;
      }

      if (!paymentMethod) {
        setErrorMsg({ addressErr: null, paymentErr: "Please select a payment method" });
        toast.warning("Select a payment method");
        return;
      }

      if (!products || products.length === 0) {
        toast.error("Your cart is empty");
        navigate("/products");
        return;
      }

      if (["bkash", "nagad", "rocket", "bank"].includes(paymentMethod) && !trxId.trim()) {
        setErrorMsg({
          addressErr: null,
          paymentErr: `Please enter your valid ${paymentMethod.toUpperCase()} transaction ID or reference number`,
        });
        return;
      }

      const orderPayload = {
        appliedCoupon: cartItems?.appliedCoupon || null,
        paymentMethod,
        transactionId: trxId.trim(),
        items: products,
        finalPrice: cartItems?.finalPrice !== undefined ? cartItems.finalPrice : cartItems?.totalPrice,
      };

      const res = await createOrder(orderPayload);

      if (res?.data?.success) {
        toast.success("Order placed successfully!");
        setShowConfirmation(true);
        setOrderData(res?.data?.data?.order || cartItems);
        dispatch(setCarts({ items: [], totalPrice: 0, discount: 0, finalPrice: 0 }));
        queryClient.invalidateQueries(["cart"]);
      } else {
        toast.error(res?.data?.message || "Failed to place order");
      }
    } catch (error) {
      console.error("handlePlaceOrder error:", error);
      toast.error(error?.response?.data?.message || "Order creation failed. Please check your items and address.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="min-h-screen pb-16">
        <Breadcrumb />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="border-b border-stone-200 pb-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
              Review & Complete Your Order
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Select your delivery address, check order details, and choose your payment method.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN — Address & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* ADDRESS SELECTION CARD */}
              <div>
                <DeliveryAddress
                  addresses={addresses}
                  selectedAddress={activeAddr}
                  onSelectAddress={setSelectedAddress}
                  isLoadingAddresses={isLoadingAddresses}
                />
                {errorMsg.addressErr && (
                  <p className="text-xs font-semibold text-red-600 mt-2 pl-1">
                    {errorMsg.addressErr}
                  </p>
                )}
              </div>

              {/* PERSONAL INFO CARD */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-stone-800" />
                  <h2 className="text-base font-bold text-stone-900">
                    Contact Information
                  </h2>
                </div>

                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-1.5">
                  <p className="text-xs font-bold text-stone-900">
                    {activeAddr?.firstName
                      ? `${activeAddr.firstName} ${activeAddr.lastName}`
                      : user?.name || "Customer Name"}
                  </p>
                  <p className="text-xs text-stone-600 font-medium">
                    {user?.email || "customer@example.com"}
                  </p>
                  <p className="text-xs text-stone-600 font-medium">
                    Phone: {activeAddr?.phone || user?.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div>
                <PaymentMethod
                  paymentMethod={paymentMethod}
                  trxId={trxId}
                  setPaymentMethod={setPaymentMethod}
                  setTrxId={setTrxId}
                  setErrorMsg={setErrorMsg}
                />
                {errorMsg?.paymentErr && (
                  <p className="text-xs font-semibold text-red-600 mt-2 pl-1">
                    {errorMsg.paymentErr}
                  </p>
                )}
              </div>

              {/* PLACE ORDER BUTTON */}
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading || !products || products.length === 0}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white font-bold text-sm py-4 rounded-xl shadow-md transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <LoadingSpin />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>CONFIRM & PLACE ORDER</span>
                  </>
                )}
              </button>
            </div>

            {/* RIGHT COLUMN — Order Summary */}
            <div className="lg:col-span-1">
              <CheckoutSummary
                products={products}
                totalPrice={cartItems?.totalPrice || 0}
                finalPrice={cartItems?.finalPrice !== undefined ? cartItems.finalPrice : cartItems?.totalPrice || 0}
                discount={cartItems?.discount || 0}
                appliedCoupon={cartItems?.appliedCoupon || ""}
                deliveryFee={deliveryFee}
                vat={vat}
                serviceFee={serviceFee}
                isCalculating={isLoadingAddresses || isLoading}
              />
            </div>
          </div>

          {/* Confirmation Modal */}
          {showConfirmation && (
            <OrderConfirmation
              showConfirmation={showConfirmation}
              orderData={orderData}
              onClose={() => {
                setShowConfirmation(false);
                setOrderData(null);
                navigate("/");
              }}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default CheckoutPage;
