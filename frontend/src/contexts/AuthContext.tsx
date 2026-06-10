import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

interface Trader {
  trader_id: string;
  trader_name: string;
  business_name?: string;
}

interface AuthContextType {
  trader: Trader | null;
  token: string | null;
  login: (token: string, trader: Trader) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [trader, setTrader] = useState<Trader | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ajo_token");
    const storedTrader = localStorage.getItem("ajo_trader");
    if (stored && storedTrader) {
      setToken(stored);
      setTrader(JSON.parse(storedTrader));
    }
    setIsLoading(false);
  }, []);

  function login(newToken: string, newTrader: Trader) {
    localStorage.setItem("ajo_token", newToken);
    localStorage.setItem("ajo_trader", JSON.stringify(newTrader));
    setToken(newToken);
    setTrader(newTrader);
  }

  function logout() {
    localStorage.removeItem("ajo_token");
    localStorage.removeItem("ajo_trader");
    setToken(null);
    setTrader(null);
  }

  return (
    <AuthContext.Provider value={{ trader, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Verify a dashboard token from URL params
export async function verifyDashboardToken(token: string): Promise<{ trader_id: string; trader_name: string } | null> {
  try {
    const res = await api.get("/auth/verify-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch {
    return null;
  }
}
