import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { PackageOpen, ShoppingBag } from "lucide-react";
import { getMyOrders } from "../../server/user/user";
import OrderCard from "../Order/OrderCard";
import Pagination from "../Products/Pagination";
import LoadingSpinner from "../common/loader/Loader";

const MyOrders = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders", page, limit],
    queryFn: async () => {
      const result = await getMyOrders({ page, limit });
      return result?.data?.data;
    },
    keepPreviousData: true,
  });

  const hasOrders = orders?.data && orders.data.length > 0;
  const totalOrdersCount = orders?.totalOrders || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <h1 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
          <span>My Orders</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            {totalOrdersCount}
          </span>
        </h1>
      </div>

      {isLoading && <LoadingSpinner />}

      {/* EMPTY ORDERS STATE WITH ICON & SHOPPING LINK */}
      {!isLoading && !hasOrders && (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto">
            <PackageOpen className="w-8 h-8 text-stone-700" />
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-extrabold text-stone-900">No Orders Found</h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              You haven't placed any orders yet. Explore our latest collection and start shopping today!
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Start Shopping</span>
          </Link>
        </div>
      )}

      {/* ORDERS LIST */}
      {hasOrders && (
        <div className="space-y-4">
          {orders.data.map((item) => (
            <OrderCard key={item?._id} item={item} />
          ))}
        </div>
      )}

      {/* PAGINATION (ONLY SHOWN IF DATA EXISTS AND TOTAL PAGES > 1) */}
      {hasOrders && orders?.totalPages > 1 && (
        <Pagination
          currentPage={orders?.page || page}
          totalPages={orders?.totalPages || 1}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default MyOrders;