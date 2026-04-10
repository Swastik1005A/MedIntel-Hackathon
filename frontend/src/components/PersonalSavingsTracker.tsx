import { TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const PersonalSavingsTracker = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce-in opacity-80 cursor-not-allowed">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-emerald-50 tracking-wide uppercase">Total Dashboard Savings</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSavingsTracker;
