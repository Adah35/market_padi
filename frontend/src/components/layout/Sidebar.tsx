import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, ArrowLeftRight, Package, ShoppingBag,
  Users, TrendingUp, BarChart3, MessageSquare, LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/inventory", icon: Package, label: "Inventory" },
  { to: "/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/adashi", icon: Users, label: "Adashi" },
  { to: "/market", icon: TrendingUp, label: "Market Intel" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/assistant", icon: MessageSquare, label: "AI Assistant" },
];

export function Sidebar() {
  const { trader, logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-gray-100 px-4 py-6 fixed top-0 left-0 z-40">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">À</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg leading-none">Àjọ</p>
            <p className="text-xs text-gray-400">Business Dashboard</p>
          </div>
        </div>
      </div>

      {trader && (
        <div className="mb-6 px-3 py-3 bg-emerald-50 rounded-xl">
          <p className="text-xs text-emerald-600 font-medium">Logged in as</p>
          <p className="font-semibold text-gray-800 text-sm truncate">{trader.trader_name}</p>
          {trader.business_name && (
            <p className="text-xs text-gray-500 truncate">{trader.business_name}</p>
          )}
        </div>
      )}

      <nav className="flex-1 flex flex-col gap-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all mt-4"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </aside>
  );
}
