import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyDashboardToken, useAuth } from "@/contexts/AuthContext";

export function DashboardTokenPage() {
  const { token } = useParams<{ token: string }>();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { navigate("/login"); return; }

    verifyDashboardToken(token).then((result) => {
      if (result) {
        login(token, {
          trader_id: result.trader_id,
          trader_name: result.trader_name,
        });
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login?error=link_expired", { replace: true });
      }
    });
  }, [token]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-xl">À</span>
        </div>
        <p className="text-gray-500">Signing you in...</p>
      </div>
    </div>
  );
}
