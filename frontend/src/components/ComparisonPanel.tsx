import { ArrowRight, TrendingDown, BadgeCheck, Info } from "lucide-react";
import type { AnalysisResult } from "@/data/medicines";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import RegulatoryBadge from "@/components/RegulatoryBadge";

interface ComparisonPanelProps {
  result: AnalysisResult;
}

const ComparisonPanel = ({ result }: ComparisonPanelProps) => {
  const cheapest = result.alternatives && result.alternatives.length > 0 ? result.alternatives[0] : null;
  const savings = cheapest ? result.original.price - cheapest.price : 0;
  const savingsPercent = cheapest ? Math.round((savings / result.original.price) * 100) : 0;
  return (
    <>
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Options for {result.original.name}</h2>
          <div className="flex items-center justify-center gap-2">
            <BadgeCheck className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Confidence Score: <span className={`font-bold ${result.confidence >= 95 ? 'text-emerald-500' : 'text-primary'}`}>{result.confidence}%</span>
            </span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px]">Matched based on identical active salt composition</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="w-full clear-both block mb-24">
          <div className="flex flex-col gap-[50px] w-full">
            {/* Original */}
            <div className="w-full xl:w-[350px] shrink-0">
              <div className="bg-card/40 backdrop-blur-xl rounded-3xl border-2 border-destructive/30 p-6 shadow-lg w-full flex flex-col justify-between h-[500px]">
                <div>
                  <span className="text-xs font-semibold text-destructive bg-destructive/10 px-3 py-1 rounded-full w-max">Original Medicine</span>
                  <h3 className="text-xl font-bold text-foreground mt-4">{result.original.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{result.original.manufacturer}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Salt</span>
                      <span className="font-medium text-foreground text-right max-w-[150px] truncate">{result.original.salt}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dosage</span>
                      <span className="font-medium text-foreground">{result.original.dosage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium text-foreground">{result.original.type}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-6 border-t border-border/50">
                  <p className="text-3xl font-extrabold text-primary">₹{result.original.price}<span className="text-sm font-normal text-muted-foreground">/strip</span></p>
                </div>
              </div>
            </div>

          {/* Alternatives Grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[30px] w-full">
            {result.alternatives.map((alt, i) => {
              const altSavings = result.original.price - alt.price;
              const altPercent = Math.round((altSavings / result.original.price) * 100);
              const isCheapest = i === 0;
              return (
                <div
                  key={alt.id}
                  className={`bg-card/70 backdrop-blur-md rounded-3xl border-2 shadow-md flex flex-col justify-between h-full w-full min-w-0 overflow-hidden ${
                    isCheapest ? "border-primary ring-4 ring-primary/20 shadow-primary/20" : "border-border/50"
                  }`}
                >
                  <div className="p-6 pb-8 flex-grow flex flex-col justify-between">
                    <div className="flex items-start flex-wrap gap-2 mb-3">
                       {isCheapest && (
                        <span className="text-xs font-semibold text-primary-foreground bg-primary px-2 py-0.5 rounded-full inline-block">
                          💰 Best Match
                        </span>
                      )}
                      
                      {alt.salt && result.original.salt && alt.salt.toLowerCase().trim() === result.original.salt.toLowerCase().trim() && (
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-emerald-200">
                          <BadgeCheck className="w-3 h-3" />
                          Verified Generic
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground leading-tight">{alt.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{alt.manufacturer || "Generic Provider"}</p>
                    
                    <div className="space-y-1 mt-2 mb-4 text-sm text-muted-foreground">
                        <p className="truncate">Salt: <span className="font-medium text-foreground">{alt.salt}</span></p>
                    </div>
                  </div>

                  <div className="bg-gray-50/30 p-4 border-t border-border mt-auto">
                    <div className="flex justify-between items-end">
                        <RegulatoryBadge medicineName={alt.name} />
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-extrabold text-primary">₹{alt.price}</p>
                          <span className="text-xs font-bold text-savings bg-savings/10 px-2.5 py-1 rounded-full flex items-center gap-1 border border-savings/20">
                            <TrendingDown className="w-3 h-3" />
                            {altPercent}%
                          </span>
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </div>
    </>
  );
};

export default ComparisonPanel;
