import { ShieldCheck, AlertTriangle, XCircle, Info } from "lucide-react";
import type { AnalysisResult } from "@/data/medicines";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SafetyIndicatorProps {
  result: AnalysisResult;
}

const safetyConfig = {
  safe: {
    icon: ShieldCheck,
    label: "Safe Equivalent",
    color: "text-savings",
    bg: "bg-savings/10",
    border: "border-savings/30",
    description: "Same salt composition — clinically equivalent.",
  },
  consult: {
    icon: AlertTriangle,
    label: "Consult Doctor",
    color: "text-warning-custom",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    description: "Slight variation — consult a doctor before switching.",
  },
  "not-equivalent": {
    icon: XCircle,
    label: "Not Equivalent",
    color: "text-destructive",
    bg: "bg-destructive/5",
    border: "border-destructive/20",
    description: "Different composition — not interchangeable.",
  },
};

const SafetyIndicator = ({ result }: SafetyIndicatorProps) => {
  const config = safetyConfig[result.safetyLevel];
  const Icon = config.icon;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className={`rounded-2xl border-2 ${config.border} ${config.bg} p-6`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${config.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-bold ${config.color}`}>{config.label}</h3>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-[220px]">{config.description}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
              <div className="mt-4 p-3 rounded-lg bg-background/60 border">
                <p className="text-xs text-muted-foreground italic">
                  ⚕️ <strong>Disclaimer:</strong> Always consult a medical professional before switching medicines. MedIntel provides data-driven suggestions, not medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetyIndicator;
