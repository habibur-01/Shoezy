import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { RotateCcw, AlertCircle, CheckCircle2, ArrowRight, Package } from "lucide-react";
import { getMyReturns } from "../../server/user/user";
import Pagination from "../Products/Pagination";
import LoadingSpinner from "../common/loader/Loader";

const MyReturns = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const {
    data: returnsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myReturns", page, limit],
    queryFn: async () => {
      const res = await getMyReturns({ page, limit });
      return res?.data?.data;
    },
    keepPreviousData: true,
  });

  const returnsList = returnsData?.data || [];
  const hasReturns = returnsList.length > 0;
  const totalCount = returnsData?.totalOrders || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <h1 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-stone-900" />
          <span>My Returns & Refunds</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            {totalCount}
          </span>
        </h1>
      </div>

      {isLoading && <LoadingSpinner />}

      {/* EMPTY RETURNS STATE */}
      {!isLoading && !hasReturns && (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto">
            <RotateCcw className="w-8 h-8 text-stone-700" />
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-extrabold text-stone-900">No Return Requests Found</h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              You haven't requested any product returns or refunds yet. View your active orders if you need to manage your purchases.
            </p>
          </div>

          <Link
            to="/account/myorders"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>View My Orders</span>
          </Link>
        </div>
      )}

      {/* RETURNED ORDERS LIST */}
      {hasReturns && (
        <div className="space-y-4">
          {returnsList.map((item) => {
            const isCompleted = item.status === "returned" || item.returnDetails?.status === "completed";
            const retReason = item.returnDetails?.reason || "Return requested by customer";
            const refundAmt = item.returnDetails?.refundAmount || item.total_amount;

            const firstItem = item.items?.[0];
            const prod = firstItem?.product;
            const coverImage =
              prod?.images?.cover ||
              (typeof prod?.images === "string" ? prod.images : "/placeholder.jpg");
            const extraCount = (item.items?.length || 1) - 1;

            const dateFormatted = item.returnDetails?.requestedAt
              ? new Date(item.returnDetails.requestedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : new Date(item.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

            return (
              <div
                key={item._id}
                className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4 hover:shadow-md transition duration-300"
              >
                {/* Return Status Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Returned & Refunded</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Return Processing</span>
                      </span>
                    )}

                    <span className="text-[11px] font-mono text-stone-400 font-medium">
                      Order ID: <strong className="text-stone-700">{item._id}</strong>
                    </span>
                  </div>

                  <span className="text-xs text-stone-500 font-medium">
                    Requested on <strong className="text-stone-800">{dateFormatted}</strong>
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={coverImage}
                    alt={prod?.name || "Product"}
                    className="w-16 h-16 object-cover rounded-xl border border-stone-200 bg-stone-50 shrink-0"
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-stone-900 truncate">
                      {prod?.name || firstItem?.name || "Returned Item"}
                    </h4>
                    {extraCount > 0 && (
                      <p className="text-[11px] font-bold text-amber-700">
                        +{extraCount} additional returned item{extraCount > 1 ? "s" : ""}
                      </p>
                    )}
                    <p className="text-xs text-stone-700 font-bold">
                      Refund Amount: <span className="text-stone-900 font-black">Tk {refundAmt}</span>
                    </p>
                  </div>
                </div>

                {/* Return Details Box */}
                <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-xl space-y-1 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Return Reason & Status:
                  </span>
                  <p className="text-stone-800 font-medium leading-relaxed">{retReason}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONDITIONAL PAGINATION */}
      {hasReturns && returnsData?.totalPages > 1 && (
        <Pagination
          currentPage={returnsData?.page || page}
          totalPages={returnsData?.totalPages || 1}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default MyReturns;
