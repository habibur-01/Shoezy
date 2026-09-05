import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  AlertTriangle,
  Loader2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { trackOrder } from "../../server/user/user";

const OrderTrackingPage = () => {
  const { orderId: paramOrderId } = useParams();
  const navigate = useNavigate();

  const [inputOrderId, setInputOrderId] = useState(paramOrderId || "");
  const [activeOrderId, setActiveOrderId] = useState(paramOrderId || "");
  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTrackingDetails = async (id) => {
    if (!id || !id.trim()) return;
    try {
      setIsLoading(true);
      setErrorMsg("");
      setTrackingData(null);

      const res = await trackOrder(id.trim());
      if (res?.data?.success) {
        setTrackingData(res.data.data);
      } else {
        setErrorMsg(res?.data?.message || "Order tracking details not found");
      }
    } catch (err) {
      console.error("fetchTrackingDetails error:", err);
      const msg = err?.response?.data?.message || "Invalid Order ID or order not found";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (paramOrderId) {
      setInputOrderId(paramOrderId);
      setActiveOrderId(paramOrderId);
      fetchTrackingDetails(paramOrderId);
    }
  }, [paramOrderId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputOrderId.trim()) return;
    setActiveOrderId(inputOrderId.trim());
    navigate(`/account/track-order/${inputOrderId.trim()}`);
    fetchTrackingDetails(inputOrderId.trim());
  };

  const order = trackingData?.order;
  const timeline = trackingData?.timeline || [];
  const isCancelled = trackingData?.isCancelled;
  const isFailed = trackingData?.isFailed;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-stone-900" />
              <span>Track Your Order</span>
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Enter your Order ID below to view real-time status and delivery timeline
            </p>
          </div>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputOrderId}
              onChange={(e) => setInputOrderId(e.target.value)}
              placeholder="Enter 24-character Order ID (e.g. 67c52a...)"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Tracking...</span>
              </>
            ) : (
              <>
                <span>Track Progress</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 flex flex-col items-center justify-center gap-3 text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin text-stone-900" />
          <p className="text-xs font-semibold uppercase tracking-widest">
            Retrieving Order Status & Courier Details...
          </p>
        </div>
      )}

      {/* Error / Not Found State */}
      {!isLoading && errorMsg && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-6 flex items-start gap-4 text-amber-900">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
              Tracking Info Not Found
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Empty State before search */}
      {!isLoading && !trackingData && !errorMsg && (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6 text-stone-700" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">Enter an Order ID to Track</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You can find your Order ID in your <strong>My Orders</strong> page or in your order confirmation email.
          </p>
        </div>
      )}

      {/* TRACKING DETAILS CONTENT */}
      {!isLoading && trackingData && order && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Order Header Summary Banner */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">
                  Order ID:
                </span>
                <span className="font-mono font-extrabold text-stone-900 text-xs sm:text-sm">
                  {order._id}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Placed on:{" "}
                <span className="font-semibold text-stone-800">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>

            {/* Status Badge */}
            <div>
              {isCancelled ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                  <AlertTriangle className="w-3.5 h-3.5" /> Order Cancelled
                </span>
              ) : isFailed ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5" /> Payment Failed
                </span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold capitalize ${order.status === "delivered"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : order.status === "processing"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-stone-100 text-stone-800 border border-stone-200"
                    }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                  <span>{order.status}</span>
                </span>
              )}
            </div>
          </div>

          {/* VISUAL TIMELINE PROGRESS BAR */}
          {!isCancelled && !isFailed && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                  Delivery Timeline & Status Progress
                </h3>
                <span className="text-xs font-bold text-stone-700 font-mono">
                  {order.status === "delivered"
                    ? "100%"
                    : order.status === "shipped"
                      ? "75%"
                      : order.status === "processing"
                        ? "50%"
                        : "25%"} Completed
                </span>
              </div>

              {/* Top Linear Progress Bar */}
              {/* <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/80 p-0.5">
                <div
                  className="h-full bg-stone-900 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      order.status === "delivered"
                        ? 100
                        : order.status === "shipped"
                        ? 75
                        : order.status === "processing"
                        ? 50
                        : 25
                    }%`,
                  }}
                />
              </div> */}

              {/* Connected Step Nodes */}
              <div className="relative pt-2">
                {/* Connecting Track Line for Desktop */}
                <div className="hidden sm:block absolute top-7 left-[12.5%] right-[12.5%] h-1 bg-stone-200 rounded-full z-0 overflow-hidden">
                  <div
                    className="h-full bg-stone-900 transition-all duration-500 rounded-full"
                    style={{
                      width: `${order.status === "delivered"
                          ? 100
                          : order.status === "shipped"
                            ? 66.6
                            : order.status === "processing"
                              ? 33.3
                              : 0
                        }%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
                  {timeline.map((step, idx) => {
                    const isDone = step.completed;
                    const isCurrent = step.current;

                    return (
                      <div key={idx} className="flex sm:flex-col items-start sm:items-center gap-3 relative group">
                        {/* Step Circle Icon */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${isDone
                              ? "bg-stone-900 text-white shadow-md"
                              : isCurrent
                                ? "bg-amber-500 text-white ring-4 ring-amber-100 shadow-md"
                                : "bg-stone-100 text-stone-400 border border-stone-200"
                            }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isCurrent ? (
                            <Clock className="w-5 h-5 animate-spin" />
                          ) : idx === 0 ? (
                            <ShoppingBag className="w-4 h-4" />
                          ) : idx === 1 ? (
                            <Package className="w-4 h-4" />
                          ) : idx === 2 ? (
                            <Truck className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </div>

                        {/* Step Text Info */}
                        <div className="sm:text-center space-y-0.5">
                          <p
                            className={`text-xs font-bold ${isDone || isCurrent ? "text-stone-900" : "text-stone-400"
                              }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-[11px] text-stone-500 leading-tight">
                            {step.description}
                          </p>
                          {step.date && (
                            <span className="text-[10px] text-stone-400 font-semibold block pt-1">
                              {new Date(step.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SHIPPING & PAYMENT DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-xs">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-700" />
                <span>Shipping Address</span>
              </h3>
              {order.shipping ? (
                <div className="text-xs text-stone-700 space-y-1 font-medium bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                  <p className="font-bold text-stone-900">{order.shipping.address}</p>
                  <p>
                    {order.shipping.city}, {order.shipping.state || ""} {order.shipping.postal_code}
                  </p>
                  <p className="text-stone-500 font-semibold">{order.shipping.country}</p>
                </div>
              ) : (
                <p className="text-xs text-stone-500">Address information not available</p>
              )}
            </div>

            {/* Payment Details Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-xs">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-stone-700" />
                <span>Payment Information</span>
              </h3>

              <div className="text-xs text-stone-700 space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Payment Status:</span>
                  <span
                    className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-md ${order.payment?.status === "paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                      }`}
                  >
                    {order.payment?.status || "Pending"}
                  </span>
                </div>

                {order.payment?.paymentMethod && (
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Selected Method:</span>
                    <span className="font-bold text-stone-900">
                      {order.payment.paymentMethod.name} ({order.payment.paymentMethod.code})
                    </span>
                  </div>
                )}

                {order.payment?.transaction_id && (
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Transaction ID:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {order.payment.transaction_id}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-stone-200 pt-2">
                  <span className="text-stone-500 font-semibold">Total Paid Amount:</span>
                  <span className="font-extrabold text-stone-900 text-sm">
                    Tk {order.total_amount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER ITEMS TABLE */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              Ordered Items ({order.items?.length || 0})
            </h3>

            <div className="divide-y divide-stone-100">
              {order.items?.map((item, idx) => {
                const prod = item.product;
                const coverImage =
                  prod?.images?.cover ||
                  (typeof prod?.images === "string" ? prod.images : "/placeholder.jpg");
                const itemTotal = item.subtotal || (item.price || 0) * (item.quantity || 1);

                return (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={coverImage}
                        alt={item.name || prod?.name}
                        className="w-14 h-14 object-cover rounded-xl border border-stone-200 bg-stone-50"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-stone-900">{item.name || prod?.name}</p>
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-[11px] text-stone-500 font-medium">
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                            {item.selectedColor && item.selectedSize && " | "}
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                          </p>
                        )}
                        <p className="text-[11px] text-stone-500 font-semibold">
                          Tk {item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-stone-900">
                        Tk {itemTotal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
