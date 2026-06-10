import { motion } from "framer-motion";
import { Users, Wallet, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { useAdashi } from "@/hooks/useTrader";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatCard, StatCardSkeleton } from "@/components/shared/StatCard";

function fmt(n: number) {
  return "₦" + new Intl.NumberFormat("en-NG").format(Math.round(n));
}

export function AdashiPage() {
  const { data, isLoading } = useAdashi();
  const groups: any[] = data?.groups ?? [];
  const summary = data?.summary;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Adashi Groups</h1>
        <p className="text-gray-400 text-sm mt-0.5">Your savings circles and contributions</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard index={0} title="Total Groups" value={summary?.totalGroups ?? 0} icon={<Users size={18} />} />
            <StatCard index={1} title="Total Contributed" value={fmt(summary?.totalContributed ?? 0)} icon={<Wallet size={18} />} />
            <StatCard index={2} title="Contributions Due" value={fmt(summary?.totalDue ?? 0)}
              icon={<AlertCircle size={18} />}
              className={(summary?.totalDue ?? 0) > 0 ? "border-orange-200" : ""}
            />
          </>
        )}
      </div>

      {/* Group cards */}
      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-5 bg-gray-100 rounded w-40 mb-3" />
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-10 bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <EmptyState
            icon={<Users size={28} />}
            title="No Adashi groups yet"
            description='Join or create a savings group by messaging us on WhatsApp: "create adashi group"'
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {groups.map((group: any, i: number) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{group.groupName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {group.type === "rotating" ? "Rotating" : "Goal Based"}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium capitalize">
                      {group.frequency}
                    </span>
                  </div>
                </div>
                {group.pendingContributions > 0 && (
                  <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-xl px-3 py-1.5">
                    <AlertCircle size={13} className="text-orange-500" />
                    <span className="text-xs text-orange-600 font-medium">{group.pendingContributions} due</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Contribution", value: fmt(group.contributionAmount), icon: Wallet },
                  { label: "Members", value: group.memberCount, icon: Users },
                  { label: "Current Round", value: `#${group.currentRound}`, icon: TrendingUp },
                  { label: "Total Contributed", value: fmt(group.totalContributed), icon: Calendar },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="text-sm font-bold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>

              {group.goalAmount && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Progress to goal</span>
                    <span>{Math.round((group.totalContributed / group.goalAmount) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (group.totalContributed / group.goalAmount) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {fmt(group.totalContributed)} of {fmt(group.goalAmount)} goal
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100"
      >
        <p className="text-sm text-emerald-700 font-medium">💬 Manage Adashi via WhatsApp</p>
        <p className="text-xs text-emerald-600 mt-1">
          Send "adashi" on WhatsApp to create groups, add members, or record contributions.
        </p>
      </motion.div>
    </div>
  );
}
