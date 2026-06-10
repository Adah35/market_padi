import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, ArrowLeftRight, Package, ShoppingBag, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Sales" },
  { to: "/inventory", icon: Package, label: "Stock" },
  { to: "/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/assistant", icon: MessageSquare, label: "AI" },
];

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-2 pb-safe">
      <div className="flex items-stretch justify-around">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 py-3 px-2 flex-1 text-xs font-medium transition-all",
                isActive ? "text-emerald-600" : "text-gray-400"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
