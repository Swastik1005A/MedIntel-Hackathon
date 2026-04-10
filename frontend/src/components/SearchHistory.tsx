import { useEffect, useState } from "react";
import { Clock, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface SearchHistoryProps {
  onReSearch: (query: string) => void;
}

interface HistoryItem {
  id: string;
  medicine_name: string;
  created_at: string;
}

const SearchHistory = ({ onReSearch }: SearchHistoryProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("search_history")
      .select("id, medicine_name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8);
    if (data) setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleDelete = async (id: string) => {
    await supabase.from("search_history").delete().eq("id", id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  if (!user || history.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          {t("history.title")}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {history.map((h) => (
            <div key={h.id} className="bg-card rounded-xl border p-3 flex items-center justify-between group hover-card-lift">
              <button onClick={() => onReSearch(h.medicine_name)} className="text-sm font-medium text-foreground hover:text-primary flex items-center gap-1.5 truncate">
                <RotateCcw className="w-3 h-3 text-muted-foreground" />
                {h.medicine_name}
              </button>
              <button onClick={() => handleDelete(h.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchHistory;
