import { motion } from "framer-motion";
import { format } from "date-fns";
import { Package, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useInventory } from "@/hooks/useTrader";
import { EmptyState } from "@/components/shared/EmptyState";

type StockStatus = "ok" | "low" | "out";

const STATUS = {
  ok: { label: "In Stock", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle, dot: "bg-emerald-500" },
  low: { label: "Low Stock", color: "bg-orange-100 text-orange-700", icon: AlertTriangle, dot: "bg-orange-500" },
  out: { label: "Out of Stock", color: "bg-red-100 text-red-600", icon: XCircle, dot: "bg-red-500" },
};

export function InventoryPage() {
  const { data, isLoading } = useInventory();
  const items: any[] = data?.data ?? [];

  const okCount = items.filter(i => i.status === "ok").length;
  const lowCount = items.filter(i => i.status === "low").length;
  const outCount = items.filter(i => i.status === "out").length;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-gray-400 text-sm mt-0.5">Current stock levels</p>
      </motion.div>

      {/* Summary badges */}
      {!isLoading && items.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="flex gap-3 mb-5 flex-wrap"
        >
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-emerald-700">{okCount} in stock</span>
          </div>
          {lowCount > 0 && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-orange-700">{lowCount} low stock</span>
            </div>
          )}
          {outCount > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-red-600">{outCount} out of stock</span>
            </div>
          )}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-28" />
                  <div className="h-3 bg-gray-100 rounded w-20" />
                </div>
                <div className="h-6 bg-gray-100 rounded-full w-20" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<Package size={28} />}
            title="No inventory yet"
            description='Add your first product by sending "restock 10 bags of rice" on WhatsApp.'
          />
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_100px_110px_120px_110px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <span>Product</span>
              <span className="text-center">Qty</span>
              <span className="text-center">Threshold</span>
              <span className="text-center">Status</span>
              <span className="text-right">Last Updated</span>
            </div>
            <div className="divide-y divide-gray-50">
              {items
                .sort((a, b) => {
                  const order = { out: 0, low: 1, ok: 2 };
                  return order[a.status as StockStatus] - order[b.status as StockStatus];
                })
                .map((item: any, i: number) => {
                  const s = STATUS[item.status as StockStatus] ?? STATUS.ok;
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={item.itemName}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {/* Mobile */}
                      <div className="sm:hidden flex items-center gap-3 px-5 py-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          item.status === "ok" ? "bg-emerald-50"
                          : item.status === "low" ? "bg-orange-50" : "bg-red-50"
                        }`}>
                          <Package size={18} className={
                            item.status === "ok" ? "text-emerald-600"
                            : item.status === "low" ? "text-orange-500" : "text-red-500"
                          } />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{item.itemName}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity} · Threshold: {item.threshold}</p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>
                          {s.label}
                        </span>
                      </div>
                      {/* Desktop */}
                      <div className="hidden sm:grid grid-cols-[1fr_100px_110px_120px_110px] gap-4 px-5 py-4 items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            item.status === "ok" ? "bg-emerald-50"
                            : item.status === "low" ? "bg-orange-50" : "bg-red-50"
                          }`}>
                            <Package size={14} className={
                              item.status === "ok" ? "text-emerald-600"
                              : item.status === "low" ? "text-orange-500" : "text-red-500"
                            } />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{item.itemName}</span>
                        </div>
                        <div className="text-center">
                          <span className={`text-sm font-bold ${
                            item.status === "out" ? "text-red-500"
                            : item.status === "low" ? "text-orange-600" : "text-gray-800"
                          }`}>{item.quantity}</span>
                        </div>
                        <div className="text-center text-sm text-gray-500">{item.threshold}</div>
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>
                            <Icon size={11} />
                            {s.label}
                          </span>
                        </div>
                        <div className="text-right text-xs text-gray-400">
                          {item.updatedAt ? format(new Date(item.updatedAt), "MMM d, HH:mm") : "—"}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100"
      >
        <p className="text-sm text-emerald-700 font-medium">💬 Update inventory via WhatsApp</p>
        <p className="text-xs text-emerald-600 mt-1">
          Say "restock 20 bags of rice" or "I have 50 bottles of palm oil" to update stock automatically.
        </p>
      </motion.div>
    </div>
  );
}
