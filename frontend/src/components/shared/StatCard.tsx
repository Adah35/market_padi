import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: number;
  className?: string;
  index?: number;
}

export function StatCard({ title, value, subtitle, icon, trend, className, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className={cn(
        "bg-white rounded-2xl p-5 shadow-sm border border-gray-100",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {(subtitle || trend !== undefined) && (
        <div className="flex items-center gap-2">
          {trend !== undefined && (
            <span className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded-full",
              trend >= 0 ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"
            )}>
              {trend >= 0 ? "+" : ""}{trend}%
            </span>
          )}
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      )}
    </motion.div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="w-9 h-9 bg-gray-100 rounded-xl" />
      </div>
      <div className="h-8 bg-gray-100 rounded w-32 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-20" />
    </div>
  );
}
