import { motion } from "framer-motion";
import { TrendingUp, RefreshCw, Lightbulb, AlertCircle } from "lucide-react";
import { useMarketIntel } from "@/hooks/useTrader";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export function MarketIntelPage() {
  const { data, isLoading, isFetching, dataUpdatedAt } = useMarketIntel();
  const queryClient = useQueryClient();
  const { trader } = useAuth();

  const insights: string = data?.insights ?? "";
  const lines = insights
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["market-intel", trader?.trader_id] });
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Market Intelligence</h1>
            <p className="text-gray-400 text-sm mt-0.5">AI-powered business insights for your market</p>
          </div>
          <button
            onClick={refresh}
            disabled={isFetching}
            className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                <div className="h-5 bg-gray-100 rounded w-48" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : lines.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-semibold mb-1">No insights available</p>
          <p className="text-gray-400 text-sm">Click refresh to get the latest market intelligence.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lines.map((line, i) => {
            const isBullet = line.startsWith("•") || line.startsWith("-") || line.startsWith("*") || /^\d+\./.test(line);
            const clean = line.replace(/^[•\-*]\s*/, "").replace(/^\d+\.\s*/, "");
            const isBold = clean.startsWith("**") && clean.includes("**");
            const text = clean.replace(/\*\*/g, "");

            if (isBold && !isBullet) {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="pt-2"
                >
                  <p className="text-base font-bold text-gray-800">{text}</p>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb size={16} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 leading-relaxed">{text || line}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {dataUpdatedAt > 0 && (
        <p className="text-center text-xs text-gray-300 mt-6">
          Updated {new Date(dataUpdatedAt).toLocaleTimeString()}
        </p>
      )}

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="mt-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={18} />
          <p className="font-semibold">Ask for specific insights</p>
        </div>
        <p className="text-emerald-100 text-sm">
          Go to the AI Assistant page to ask targeted questions like "What's the price of rice in Kano this week?" or "What products should I stock for the next month?"
        </p>
      </motion.div>
    </div>
  );
}
