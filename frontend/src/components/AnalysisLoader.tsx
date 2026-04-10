import { Loader2, Brain } from "lucide-react";

const AnalysisLoader = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-card rounded-2xl shadow-lg border p-10">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 animate-pulse-gentle">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Analyzing Medicine...</h3>
          <p className="text-muted-foreground text-sm mb-6">Our AI engine is parsing salt composition and finding clinically equivalent alternatives</p>
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Matching salt composition database</span>
          </div>
          <div className="mt-6 w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse-gentle" style={{ width: "65%" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisLoader;
