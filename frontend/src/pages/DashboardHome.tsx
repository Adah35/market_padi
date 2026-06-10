import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  TrendingUp, Package, Users, ArrowLeftRight,
  ShoppingBag, Calendar
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useSummary, useProfile, useInventory, useAdashi, useTransactions } from "@/hooks/useTrader";
import { StatCard, StatCardSkeleton } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";

function fmt(n: number) {
  return "₦" + new Intl.NumberFormat("en-NG").format(Math.round(n));
}

const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];

export function DashboardHome() {
  const { trader } = useAuth();
  const { data: profile } = useProfile();
  const { data: summary, isLoading: summaryLoading } = useSummary();
  const { data: inventory } = useInventory();
  const { data: adashi } = useAdashi();
  const { data: recentTx } = useTransactions({ limit: 8, page: 1 });

  const lowStockCount = inventory?.data?.filter((i: any) => i.status !== "ok").length ?? 0;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">
              <Calendar size={13} className="inline mr-1 mb-0.5" />
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              Good {getTimeOfDay()}, {trader?.trader_name?.split(" ")[0]} 👋
            </h1>
            {profile?.businessName && (
              <p className="text-gray-500 text-sm mt-0.5">{profile.businessName}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              index={0}
              title="Today's Sales"
              value={fmt(summary?.todaySales?.total ?? 0)}
              subtitle={`${summary?.todaySales?.count ?? 0} transactions`}
              icon={<TrendingUp size={18} />}
            />
            <StatCard
              index={1}
              title="This Week"
              value={fmt(summary?.weekSales?.total ?? 0)}
              subtitle={`${summary?.weekSales?.count ?? 0} transactions`}
              icon={<ArrowLeftRight size={18} />}
            />
            <StatCard
              index={2}
              title="Inventory Items"
              value={inventory?.data?.length ?? 0}
              subtitle={lowStockCount > 0 ? `${lowStockCount} low/out` : "All stocked"}
              icon={<Package size={18} />}
              className={lowStockCount > 0 ? "border-orange-200" : ""}
            />
            <StatCard
              index={3}
              title="Adashi Groups"
              value={adashi?.summary?.totalGroups ?? 0}
              subtitle={adashi?.summary?.totalGroups ? `₦${new Intl.NumberFormat("en-NG").format(adashi.summary.totalContributed)} saved` : "No groups yet"}
              icon={<Users size={18} />}
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <h3 className="font-semibold text-gray-800 mb-1">Revenue (Last 7 Days)</h3>
          <p className="text-xs text-gray-400 mb-4">Sales vs expenses</p>
          {summary?.dailyRevenue?.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={summary.dailyRevenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => "₦" + (v >= 1000 ? Math.round(v/1000) + "k" : v)} />
                <Tooltip
                  formatter={(v: any, name: any) => [fmt(Number(v ?? 0)), name === "revenue" ? "Revenue" : "Expenses"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#f97316" strokeWidth={2} fill="url(#colorExpenses)" strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-300 text-sm">No sales data yet</div>
          )}
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <h3 className="font-semibold text-gray-800 mb-1">Top Products</h3>
          <p className="text-xs text-gray-400 mb-4">Last 30 days by revenue</p>
          {summary?.topProducts?.length ? (
            <div className="space-y-3">
              {summary.topProducts.map((p: any, i: number) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{p.name}</p>
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: COLORS[i % COLORS.length],
                          width: `${Math.round((p.revenue / summary.topProducts[0].revenue) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-medium flex-shrink-0">
                    {fmt(p.revenue)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-300 text-sm">No product data yet</div>
          )}
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          <a href="/transactions" className="text-emerald-600 text-xs font-medium hover:underline">
            View all
          </a>
        </div>
        {recentTx?.data?.length ? (
          <div className="divide-y divide-gray-50">
            {recentTx.data.map((tx: any) => (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  tx.transactionType === "sale" ? "bg-emerald-50" : "bg-orange-50"
                }`}>
                  {tx.transactionType === "sale"
                    ? <TrendingUp size={16} className="text-emerald-600" />
                    : <ShoppingBag size={16} className="text-orange-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{tx.itemName}</p>
                  <p className="text-xs text-gray-400">
                    {tx.quantity} × {fmt(tx.unitPrice)} · {tx.source}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold ${tx.transactionType === "sale" ? "text-emerald-600" : "text-orange-500"}`}>
                    {tx.transactionType === "sale" ? "+" : "-"}{fmt(tx.totalAmount)}
                  </p>
                  <p className="text-xs text-gray-400">{format(new Date(tx.createdAt), "MMM d")}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="💬"
            title="No transactions yet"
            description="Record your first transaction through WhatsApp to see it here."
          />
        )}
      </motion.div>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
