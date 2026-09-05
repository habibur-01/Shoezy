import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { XCircle, ShoppingBag, AlertTriangle, Calendar } from "lucide-react";
import { getMyCancellations } from "../../server/user/user";
import Pagination from "../Products/Pagination";
import LoadingSpinner from "../common/loader/Loader";

const MyCancellations = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const {
    data: cancellationsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myCancellations", page, limit],
    queryFn: async () => {
      const res = await getMyCancellations({ page, limit });
      return res?.data?.data;
    },
    keepPreviousData: true,
  });

  const cancellationsList = cancellationsData?.data || [];
  const hasCancellations = cancellationsList.length > 0;
  const totalCount = cancellationsData?.totalOrders || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <h1 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-rose-600" />
          <span>My Cancellations</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            {totalCount}
          </span>
        </h1>
      </div>

      {isLoading && <LoadingSpinner />}

      {/* EMPTY CANCELLATIONS STATE */}
      {!isLoading && !hasCancellations && (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-stone-400" />
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-extrabold text-stone-900">No Cancelled Orders</h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              You haven't cancelled any orders. All your placed orders are processing smoothly!
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Products</span>
          </Link>
        </div>
      )}

      {/* CANCELLED ORDERS LIST */}
      {hasCancellations && (
        <div className="space-y-4">
          {cancellationsList.map((item) => {
            const cancelReason =
              item.cancellationDetails?.reason || "Cancelled by customer request";
            const cancelledAtDate = item.cancellationDetails?.cancelledAt
              ? new Date(item.cancellationDetails.cancelledAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : new Date(item.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

            const firstItem = item.items?.[0];
            const prod = firstItem?.product;
            const coverImage =
              prod?.images?.cover ||
              (typeof prod?.images === "string" ? prod.images : "/placeholder.jpg");
            const extraCount = (item.items?.length || 1) - 1;

            return (
              <div
                key={item._id}
                className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4 hover:shadow-md transition duration-300"
              >
                {/* Header Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-800 border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Order Cancelled</span>
                    </span>

                    <span className="text-[11px] font-mono text-stone-400 font-medium">
                      Order ID: <strong className="text-stone-700">{item._id}</strong>
                    </span>
                  </div>

                  <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Cancelled on <strong className="text-stone-800">{cancelledAtDate}</strong></span>
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={coverImage}
                    alt={prod?.name || "Product"}
                    className="w-16 h-16 object-cover rounded-xl border border-stone-200 bg-stone-50 shrink-0 opacity-80"
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-stone-900 truncate">
                      {prod?.name || firstItem?.name || "Cancelled Product"}
                    </h4>
                    {extraCount > 0 && (
                      <p className="text-[11px] font-bold text-stone-500">
                        +{extraCount} additional cancelled item{extraCount > 1 ? "s" : ""}
                      </p>
                    )}
                    <p className="text-xs text-stone-700 font-bold">
                      Order Value: <span className="text-stone-900 font-black">Tk {item.total_amount}</span>
                    </p>
                  </div>
                </div>

                {/* Cancellation Details Box */}
                <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
                    Cancellation Reason:
                  </span>
                  <p className="text-stone-800 font-medium leading-relaxed">{cancelReason}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONDITIONAL PAGINATION */}
      {hasCancellations && cancellationsData?.totalPages > 1 && (
        <Pagination
          currentPage={cancellationsData?.page || page}
          totalPages={cancellationsData?.totalPages || 1}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default MyCancellations;
