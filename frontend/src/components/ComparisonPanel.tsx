import { ArrowRight, TrendingDown, BadgeCheck, Info } from "lucide-react";
import type { AnalysisResult } from "@/data/medicines";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import RegulatoryBadge from "@/components/RegulatoryBadge";

interface ComparisonPanelProps {
  result: AnalysisResult;
}

const ComparisonPanel = ({ result }: ComparisonPanelProps) => {
  const cheapest = result.alternatives[0];
  const savings = result.original.price - cheapest.price;
  const savingsPercent = Math.round((savings / result.original.price) * 100);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Comparison Results</h2>
          <div className="flex items-center justify-center gap-2">
            <BadgeCheck className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Confidence Score: <span className="font-bold text-primary">{result.confidence}%</span>
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

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-start">
          {/* Original */}
          <div className="bg-card rounded-2xl border-2 border-destructive/20 p-6 shadow-sm">
            <span className="text-xs font-semibold text-destructive bg-destructive/10 px-3 py-1 rounded-full">Original Medicine</span>
            <h3 className="text-xl font-bold text-foreground mt-4">{result.original.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{result.original.manufacturer}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Salt Composition</span>
                <span className="font-medium text-foreground">{result.original.salt}</span>
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
            <div className="mt-6 pt-4 border-t">
              <p className="text-3xl font-extrabold text-foreground">₹{result.original.price}<span className="text-sm font-normal text-muted-foreground">/strip</span></p>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center justify-center py-8">
            <ArrowRight className="w-8 h-8 text-primary" />
            <span className="text-xs text-primary font-semibold mt-2">SWITCH</span>
          </div>

          {/* Alternatives */}
          <div className="space-y-4">
            {result.alternatives.map((alt, i) => {
              const altSavings = result.original.price - alt.price;
              const altPercent = Math.round((altSavings / result.original.price) * 100);
              const isCheapest = i === 0;
              return (
                <div
                  key={alt.id}
                  className={`bg-card rounded-2xl border-2 p-6 shadow-sm hover-card-lift ${
                    isCheapest ? "border-primary ring-2 ring-primary/20" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {isCheapest && (
                        <span className="text-xs font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full">
                          💰 Best Value
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-foreground mt-2">{alt.name}</h3>
                      <p className="text-sm text-muted-foreground">{alt.manufacturer}</p>
                      <RegulatoryBadge medicineName={alt.name} />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-foreground">₹{alt.price}</p>
                      <span className="text-xs font-semibold text-savings bg-savings/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        Save {altPercent}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Salt: {alt.salt} • {alt.dosage} • {alt.type}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonPanel;
