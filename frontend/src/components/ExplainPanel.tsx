import { useState, useEffect } from "react";
import { Volume2, Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExplainPanelProps {
  reasoning: string;
  medicineName?: string;
  salt?: string;
}

const ExplainPanel = ({ reasoning, medicineName, salt }: ExplainPanelProps) => {
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(true);

  useEffect(() => {
    // Simulate AI typing/thinking delay for UI effect
    setIsThinking(true);
    const timer = setTimeout(() => setIsThinking(false), 1200);
    return () => clearTimeout(timer);
  }, [reasoning]);

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      if (speaking) {
        speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(reasoning);
      utterance.rate = 0.9;
      utterance.onend = () => setSpeaking(false);
      speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-card rounded-2xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Explanation
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSpeak}
                className="text-xs"
              >
                <Volume2 className={`w-4 h-4 mr-1 ${speaking ? "text-primary animate-pulse-gentle" : ""}`} />
                {speaking ? "Stop" : "Listen"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent((salt || medicineName || 'medicine') + ' clinical evidence side effects')}`, '_blank')}
                className="text-xs flex items-center"
              >
                More <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
          
          {isThinking ? (
            <div className="flex items-center gap-2 text-sm text-primary font-medium py-3 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating clinical summary...
            </div>
          ) : (
            <p className="text-sm text-foreground leading-relaxed animate-fade-in">{reasoning}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExplainPanel;
