import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from "recharts";
import { Download, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { useReports } from "@/hooks/useTrader";
import { StatCard, StatCardSkeleton } from "@/components/shared/StatCard";

function fmt(n: number) {
  return "₦" + new Intl.NumberFormat("en-NG").format(Math.round(n));
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export function ReportsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const { data, isLoading } = useReports(month, year);
  const current = data?.currentMonth;
  const monthly: any[] = data?.monthly ?? [];

  function downloadCSV() {
    if (!monthly.length) return;
    const rows = [
      ["Month", "Revenue", "Expenses", "Profit"],
      ...monthly.map(m => [m.month, m.revenue, m.expenses, m.profit]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ajo-report-${MONTHS[month]}-${year}.csv`;
    a.click();
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-400 text-sm mt-0.5">Financial summaries and trends</p>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-xl transition-all"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* Period selector */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <select
          value={month}
          onChange={e => setMonth(parseInt(e.target.value))}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <select
          value={year}
          onChange={e => setYear(parseInt(e.target.value))}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {[now.getFullYear() - 1, now.getFullYear()].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Current month stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard index={0} title="Revenue" value={fmt(current?.revenue ?? 0)} icon={<TrendingUp size={18} />} />
            <StatCard index={1} title="Expenses" value={fmt(current?.expenses ?? 0)} icon={<TrendingDown size={18} />} />
            <StatCard
              index={2}
              title="Net Profit"
              value={fmt(current?.profit ?? 0)}
              icon={<BarChart3 size={18} />}
              className={(current?.profit ?? 0) < 0 ? "border-red-200" : "border-emerald-200"}
            />
            <StatCard index={3} title="Transactions" value={current?.transactionCount ?? 0} subtitle="this month" />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <h3 className="font-semibold text-gray-800 mb-1">Revenue vs Expenses</h3>
          <p className="text-xs text-gray-400 mb-4">Last 6 months</p>
          {monthly.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => "₦" + (v >= 1000 ? Math.round(v/1000) + "k" : v)} />
                <Tooltip
                  formatter={(v: number, name: string) => [fmt(v), name === "revenue" ? "Revenue" : "Expenses"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                />
                <Bar dataKey="revenue" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-300 text-sm">No data yet</div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <h3 className="font-semibold text-gray-800 mb-1">Profit Trend</h3>
          <p className="text-xs text-gray-400 mb-4">Net profit per month</p>
          {monthly.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthly} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => "₦" + (v >= 1000 ? Math.round(v/1000) + "k" : v)} />
                <Tooltip
                  formatter={(v: number) => [fmt(v), "Profit"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                />
                <Line
                  type="monotone" dataKey="profit" stroke="#059669" strokeWidth={2.5}
                  dot={{ fill: "#059669", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-300 text-sm">No data yet</div>
          )}
        </motion.div>
      </div>

      {/* Monthly breakdown table */}
      {monthly.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800">Monthly Breakdown</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {[...monthly].reverse().map((row) => (
              <div key={row.month} className="grid grid-cols-4 gap-4 px-5 py-3.5 text-sm">
                <span className="font-medium text-gray-700">{row.month}</span>
                <span className="text-emerald-600 font-medium text-right">{fmt(row.revenue)}</span>
                <span className="text-orange-500 font-medium text-right">{fmt(row.expenses)}</span>
                <span className={`font-semibold text-right ${row.profit >= 0 ? "text-gray-800" : "text-red-500"}`}>
                  {row.profit >= 0 ? "+" : ""}{fmt(row.profit)}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <span>Month</span>
            <span className="text-right">Revenue</span>
            <span className="text-right">Expenses</span>
            <span className="text-right">Profit</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
