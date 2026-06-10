import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/pages/Login";
import { DashboardTokenPage } from "@/pages/DashboardToken";
import { DashboardHome } from "@/pages/DashboardHome";
import { TransactionsPage } from "@/pages/Transactions";
import { InventoryPage } from "@/pages/Inventory";
import { OrdersPage } from "@/pages/Orders";
import { AdashiPage } from "@/pages/Adashi";
import { MarketIntelPage } from "@/pages/MarketIntel";
import { ReportsPage } from "@/pages/Reports";
import { AIAssistantPage } from "@/pages/AIAssistant";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/d/:token" element={<DashboardTokenPage />} />
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/adashi" element={<AdashiPage />} />
        <Route path="/market" element={<MarketIntelPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/assistant" element={<AIAssistantPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
