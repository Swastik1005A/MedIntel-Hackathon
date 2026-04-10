import { useEffect, useState } from "react";
import { Wallet, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const PersonalSavingsTracker = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [totalSavings, setTotalSavings] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("user_savings")
        .select("savings_amount")
        .eq("user_id", user.id);
      if (data) {
        const total = data.reduce((sum, r) => sum + Number(r.savings_amount), 0);
        setTotalSavings(total);
        setCount(data.length);
      }
    };
    fetch();
  }, [user]);

  if (!user || totalSavings === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-card rounded-2xl border p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("totalSavings.title")}</p>
            <p className="text-2xl font-extrabold text-savings">₹{totalSavings.toLocaleString()}</p>
          </div>
          <div className="ml-auto text-right">
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">{count} switches</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalSavingsTracker;
