import { CircleDollarSign, CreditCard } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getBillingAddress } from "../../server/billing/billing";
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
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("");
  const [trxId, setTrxId] = useState("");
  const [addressType, setAddressType] = useState('home')
  const cartItems = useSelector(state => { return state.cart.carts })
  const hasAddress = useSelector(state => { return state.initial.hasAddress })
  const user = useSelector(state => { return state.auth.user; })
  const [errorMsg, setErrorMsg] = useState({ addressErr: null, paymentErr: null })
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const wasReloaded =
    window.performance.getEntriesByType("navigation")[0].type === "reload"

  // Fetch Address
  const { data: address } = useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const result = await getBillingAddress(user?.user_id);

      return result?.data?.data;
    },
  });


  const products = cartItems?.items
  const deliveryFee = 34;
  const serviceFee = 14;
  const vat = 35;
  const shipping = address?.billingAddresses?.shippingAddress

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true)
      if (!hasAddress) {
        return (setErrorMsg({ addressErr: "Add delivery address", paymentErr: null }))
      }
      if (!paymentMethod) {

        return (setErrorMsg({ addressErr: null, paymentErr: "Select a payment method" }));
      }
      if (cartItems?.items?.length === 0) {

        return toast.error("Please add some product");
      }

      if (
        ["bkash", "nagad", "rocket"].includes(paymentMethod) &&
        trxId.trim() === ""
      ) {
        setErrorMsg({ addressErr: null, paymentErr:`Please enter your ${paymentMethod} transaction ID`});
        return;
      }

      const orderPayload = {
        appliedCoupon: cartItems?.appliedCoupon,
        paymentMethod,
        transactionId: trxId,
        items: cartItems?.items,
        finalPrice: cartItems.finalPrice,
      };
      

      const order = await createOrder(orderPayload)
      if (order.data?.success) {
        setShowConfirmation(true)
        localStorage.setItem("checkoutConfirm", "true")
        setOrderData(cartItems)
        dispatch(setCarts({}))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)

    } finally {
      setIsLoading(false)
    }

  };
  
  const closeModal = async() => {
    const isModal = localStorage.getItem("checkoutConfirm")
    console.log("🚀 ~ closeModal ~ isModal:", isModal)
    if (isModal === "true" && cartItems.items?.length === 0) {
      navigate("/");
      localStorage.removeItem("checkoutConfirm");
    }
  };

  useEffect(() => {
    closeModal()
  }, [cartItems])

  return (
    <Container>

      <div className="min-h-screen ">
        <Breadcrumb />
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Review and place your order
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SECTION */}
            <div className="lg:col-span-2">
              {/* ADDRESS CARD */}
              <div>
                <DeliveryAddress {...{ address: shipping?.address, city: shipping?.city, state: shipping?.state, country: shipping?.country, zipCode: shipping?.zip, hasAddress, addressType }} />

                <div className="mt-2 ml-1">
                  {errorMsg.addressErr && <p className="text-[var(--color-danger)]">{errorMsg?.addressErr}</p>}
                </div>
              </div>

              {/* PERSONAL INFO */}
              <div className="bg-white rounded-lg shadow-sm p-6 my-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h2>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-1">
                  <p className="text-sm text-gray-800">{address?.billingAddresses?.firstName}  {address?.billingAddresses?.lastName}</p>
                  <p className="text-sm text-gray-800">
                    {address?.user?.email}
                  </p>
                  <p className="text-sm text-gray-800">{address?.billingAddresses?.phone}</p>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div>
                <PaymentMethod {...{ paymentMethod, trxId, setPaymentMethod, setTrxId, setErrorMsg }} />
                <div className="mt-2 ml-1">
                  {errorMsg?.paymentErr && <p className="text-[var(--color-danger)]">{errorMsg?.paymentErr}</p>}
                </div>
              </div>


              {/* PLACE ORDER BUTTON */}
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white my-4 py-3 rounded-lg font-semibold text-lg shadow hover:cursor-pointer"
              >
                {isLoading ? <LoadingSpin /> : " Place Order"}
              </button>
            </div>

            {/* RIGHT SECTION (Order Summary) */}
            <div className="lg:col-span-1">
              <CheckoutSummary {...{
                products,
                totalPrice: cartItems?.totalPrice,
                finalPrice: cartItems?.finalPrice,
                deliveryFee,
                vat,
                serviceFee
              }} />

            </div>
          </div>

          {showConfirmation && (
            <OrderConfirmation
              showConfirmation={showConfirmation}
              orderData={orderData}
              onClose={() => { setShowConfirmation(false); setOrderData(null) }}
            />
          )}

        </div>
      </div>
    </Container >
  );
};

export default CheckoutPage;
