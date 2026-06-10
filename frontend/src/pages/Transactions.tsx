import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Search, Filter, TrendingUp, ShoppingBag, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTransactions } from "@/hooks/useTrader";
import { EmptyState } from "@/components/shared/EmptyState";

function fmt(n: number) {
  return "₦" + new Intl.NumberFormat("en-NG").format(Math.round(n));
}

const SOURCE_LABELS: Record<string, string> = {
  voice: "🎤 Voice",
  manual: "✏️ Manual",
  order: "📦 Order",
};

export function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const params: Record<string, string | number> = { page, limit: 20 };
  if (search) params.search = search;
  if (type) params.type = type;
  if (from) params.from = from;
  if (to) params.to = to;

  const { data, isLoading } = useTransactions(params);
  const transactions = data?.data ?? [];
  const pagination = data?.pagination;

  function clearFilters() {
    setSearch(""); setType(""); setFrom(""); setTo(""); setPage(1);
  }

  const hasFilters = search || type || from || to;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-400 text-sm mt-0.5">All your sales and expenses</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search product..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            value={type}
            onChange={e => { setType(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[120px]"
          >
            <option value="">All Types</option>
            <option value="sale">Sales Only</option>
            <option value="expense">Expenses Only</option>
          </select>
          <input
            type="date"
            value={from}
            onChange={e => { setFrom(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="date"
            value={to}
            onChange={e => { setTo(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 text-sm transition-colors px-2">
              <X size={15} /> Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4 animate-pulse">
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-32" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
                <div className="text-right space-y-1.5">
                  <div className="h-4 bg-gray-100 rounded w-20 ml-auto" />
                  <div className="h-3 bg-gray-100 rounded w-16 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon="💸"
            title="No transactions found"
            description={hasFilters ? "Try adjusting your filters." : "Record your first transaction through WhatsApp."}
          />
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_80px_100px_110px_90px_90px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <span>Product</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Unit Price</span>
              <span className="text-right">Total</span>
              <span className="text-center">Source</span>
              <span className="text-right">Date</span>
            </div>
            <div className="divide-y divide-gray-50">
              {transactions.map((tx: any) => (
                <motion.button
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left hover:bg-gray-50 transition-colors"
                >
                  {/* Mobile row */}
                  <div className="sm:hidden flex items-center gap-3 px-5 py-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tx.transactionType === "sale" ? "bg-emerald-50" : "bg-orange-50"
                    }`}>
                      {tx.transactionType === "sale"
                        ? <TrendingUp size={15} className="text-emerald-600" />
                        : <ShoppingBag size={15} className="text-orange-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{tx.itemName}</p>
                      <p className="text-xs text-gray-400">{tx.quantity} × {fmt(tx.unitPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${tx.transactionType === "sale" ? "text-emerald-600" : "text-orange-500"}`}>
                        {tx.transactionType === "sale" ? "+" : "-"}{fmt(tx.totalAmount)}
                      </p>
                      <p className="text-xs text-gray-400">{format(new Date(tx.createdAt), "MMM d")}</p>
                    </div>
                  </div>
                  {/* Desktop row */}
                  <div className="hidden sm:grid grid-cols-[1fr_80px_100px_110px_90px_90px] gap-4 px-5 py-3.5 items-center">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        tx.transactionType === "sale" ? "bg-emerald-50" : "bg-orange-50"
                      }`}>
                        {tx.transactionType === "sale"
                          ? <TrendingUp size={13} className="text-emerald-600" />
                          : <ShoppingBag size={13} className="text-orange-500" />
                        }
                      </div>
                      <span className="text-sm font-medium text-gray-800 truncate">{tx.itemName}</span>
                    </div>
                    <span className="text-sm text-gray-600 text-center">{tx.quantity}</span>
                    <span className="text-sm text-gray-600 text-right">{fmt(tx.unitPrice)}</span>
                    <span className={`text-sm font-semibold text-right ${tx.transactionType === "sale" ? "text-emerald-600" : "text-orange-500"}`}>
                      {tx.transactionType === "sale" ? "+" : "-"}{fmt(tx.totalAmount)}
                    </span>
                    <span className="text-xs text-gray-400 text-center">{SOURCE_LABELS[tx.source] ?? tx.source}</span>
                    <span className="text-xs text-gray-400 text-right">{format(new Date(tx.createdAt), "MMM d, HH:mm")}</span>
                  </div>
                </motion.button>
              ))}
            </div>
            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
                <p className="text-sm text-gray-400">
                  {((page - 1) * 20) + 1}–{Math.min(page * 20, pagination.total)} of {pagination.total}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    disabled={page >= pagination.pages}
                    onClick={() => setPage(p => p + 1)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Transaction Detail Drawer */}
      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="fixed inset-0 bg-black/30 z-50"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Transaction Details</h2>
                <button onClick={() => setSelectedTx(null)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                  <X size={16} />
                </button>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                selectedTx.transactionType === "sale" ? "bg-emerald-100" : "bg-orange-100"
              }`}>
                {selectedTx.transactionType === "sale"
                  ? <TrendingUp size={24} className="text-emerald-600" />
                  : <ShoppingBag size={24} className="text-orange-500" />
                }
              </div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-1">
                {selectedTx.transactionType === "sale" ? "Sale" : "Expense"}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-5">{selectedTx.itemName}</h3>
              {[
                ["Quantity", selectedTx.quantity],
                ["Unit Price", fmt(selectedTx.unitPrice)],
                ["Total Amount", fmt(selectedTx.totalAmount)],
                ["Source", SOURCE_LABELS[selectedTx.source] ?? selectedTx.source],
                ["Date", format(new Date(selectedTx.createdAt), "MMMM d, yyyy · HH:mm")],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
