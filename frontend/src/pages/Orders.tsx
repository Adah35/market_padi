import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ShoppingBag, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { useOrders } from "@/hooks/useTrader";
import { EmptyState } from "@/components/shared/EmptyState";

function fmt(n: number) {
  return "₦" + new Intl.NumberFormat("en-NG").format(Math.round(n));
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  paid: { label: "Paid", className: "bg-blue-100 text-blue-700" },
  fulfilled: { label: "Fulfilled", className: "bg-emerald-100 text-emerald-700" },
};

export function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data, isLoading } = useOrders({ page, limit: 20, ...(status ? { status } : {}) });
  const orders: any[] = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Orders</h1>
        <p className="text-gray-400 text-sm mt-0.5">Track and manage customer orders</p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {["", "pending", "paid", "fulfilled"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              status === s
                ? "bg-emerald-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "" ? "All" : STATUS_STYLES[s].label}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-28" />
                  <div className="h-3 bg-gray-100 rounded w-40" />
                </div>
                <div className="h-6 bg-gray-100 rounded-full w-16" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={28} />}
            title="No orders yet"
            description="Customer orders placed through WhatsApp will appear here."
          />
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {orders.map((order: any, i: number) => {
                const s = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
                return (
                  <motion.button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="w-full text-left flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag size={18} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Phone size={12} className="text-gray-400 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-800">{order.customerPhone}</p>
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {(order.items as any[]).map((it: any) => `${it.quantity}× ${it.itemName}`).join(", ")}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{fmt(order.totalAmount)}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.className}`}>
                        {s.label}
                      </span>
                    </div>
                    <div className="hidden sm:block text-right text-xs text-gray-400 flex-shrink-0 ml-2 min-w-[70px]">
                      {format(new Date(order.createdAt), "MMM d")}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
                <p className="text-sm text-gray-400">{((page-1)*20)+1}–{Math.min(page*20, pagination.total)} of {pagination.total}</p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft size={15} />
                  </button>
                  <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            onClick={e => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Customer</span>
                <span className="text-sm font-medium text-gray-800">{selectedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-sm font-bold text-gray-900">{fmt(selectedOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[selectedOrder.status]?.className}`}>
                  {STATUS_STYLES[selectedOrder.status]?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-sm text-gray-800">{format(new Date(selectedOrder.createdAt), "MMMM d, yyyy")}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Items</p>
              <div className="space-y-2">
                {(selectedOrder.items as any[]).map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-sm text-gray-700">{item.quantity}× {item.itemName}</span>
                    <span className="text-sm font-medium text-gray-800">{fmt(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setSelectedOrder(null)}
              className="w-full mt-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors">
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
