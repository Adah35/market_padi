import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function useProfile() {
  const { trader } = useAuth();
  return useQuery({
    queryKey: ["profile", trader?.trader_id],
    queryFn: () => api.get(`/traders/${trader!.trader_id}/profile`).then(r => r.data),
    enabled: !!trader?.trader_id,
  });
}

export function useSummary() {
  const { trader } = useAuth();
  return useQuery({
    queryKey: ["summary", trader?.trader_id],
    queryFn: () => api.get(`/traders/${trader!.trader_id}/transactions/summary`).then(r => r.data),
    enabled: !!trader?.trader_id,
    staleTime: 60_000,
  });
}

export function useTransactions(params: Record<string, string | number>) {
  const { trader } = useAuth();
  return useQuery({
    queryKey: ["transactions", trader?.trader_id, params],
    queryFn: () => api.get(`/traders/${trader!.trader_id}/transactions`, { params }).then(r => r.data),
    enabled: !!trader?.trader_id,
  });
}

export function useInventory() {
  const { trader } = useAuth();
  return useQuery({
    queryKey: ["inventory", trader?.trader_id],
    queryFn: () => api.get(`/traders/${trader!.trader_id}/inventory`).then(r => r.data),
    enabled: !!trader?.trader_id,
    staleTime: 30_000,
  });
}

export function useOrders(params: Record<string, string | number> = {}) {
  const { trader } = useAuth();
  return useQuery({
    queryKey: ["orders", trader?.trader_id, params],
    queryFn: () => api.get(`/traders/${trader!.trader_id}/orders`, { params }).then(r => r.data),
    enabled: !!trader?.trader_id,
  });
}

export function useAdashi() {
  const { trader } = useAuth();
  return useQuery({
    queryKey: ["adashi", trader?.trader_id],
    queryFn: () => api.get(`/traders/${trader!.trader_id}/adashi`).then(r => r.data),
    enabled: !!trader?.trader_id,
  });
}

export function useReports(month?: number, year?: number) {
  const { trader } = useAuth();
  return useQuery({
    queryKey: ["reports", trader?.trader_id, month, year],
    queryFn: () => api.get(`/traders/${trader!.trader_id}/reports`, { params: { month, year } }).then(r => r.data),
    enabled: !!trader?.trader_id,
  });
}

export function useMarketIntel() {
  const { trader } = useAuth();
  return useQuery({
    queryKey: ["market-intel", trader?.trader_id],
    queryFn: () => api.get(`/traders/${trader!.trader_id}/market-intel`).then(r => r.data),
    enabled: !!trader?.trader_id,
    staleTime: 10 * 60_000,
  });
}
