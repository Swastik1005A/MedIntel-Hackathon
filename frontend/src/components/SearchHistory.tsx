import { Card, CardContent } from "@/components/ui/card";
import { History, Clock, ArrowRight } from "lucide-react";

interface SearchHistoryProps {
  onReSearch: (query: string) => void;
}

const SearchHistory = ({ onReSearch }: SearchHistoryProps) => {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <History className="w-4 h-4" /> Your Recent Searches
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
            <Card className="min-w-[280px] snap-center hover-card-lift cursor-pointer opacity-70">
              <CardContent className="p-5 flex flex-col h-full justify-between">
                <div>
                  <h4 className="font-bold text-foreground capitalize mb-1">Coming Soon: History Tracking</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    Your analysis history will appear here once cloud sync is ready.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-medium border-t pt-3">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Syncing Module
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
};

export default SearchHistory;
