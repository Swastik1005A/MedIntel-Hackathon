import { useEffect, useState } from "react";
import { TrendingDown, Sparkles } from "lucide-react";

interface SavingsHighlightProps {
  savings: number;
  percentage: number;
}

const SavingsHighlight = ({ savings, percentage }: SavingsHighlightProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = savings / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= savings) {
        setDisplayValue(savings);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [savings]);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="gradient-primary rounded-2xl p-8 md:p-10 text-center text-primary-foreground shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 w-24 h-24 rounded-full bg-primary-foreground/20" />
            <div className="absolute bottom-4 right-12 w-32 h-32 rounded-full bg-primary-foreground/10" />
          </div>
          <div className="relative z-10">
            <Sparkles className="w-8 h-8 mx-auto mb-4 opacity-80" />
            <p className="text-sm font-medium opacity-90 mb-2">Your Estimated Savings</p>
            <p className="text-5xl md:text-6xl font-extrabold mb-2 animate-count-up">
              ₹{displayValue}
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5" />
              <span className="text-lg font-semibold">{percentage}% lower cost</span>
            </div>
            <p className="text-sm opacity-80 max-w-md mx-auto">
              Save up to 70% with clinically equivalent alternatives. Same composition, same effectiveness, lower price.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SavingsHighlight;
