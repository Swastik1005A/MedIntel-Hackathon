import { useState } from "react";
import { Volume2, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExplainPanelProps {
  reasoning: string;
}

const ExplainPanel = ({ reasoning }: ExplainPanelProps) => {
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);

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
              <MessageSquareText className="w-5 h-5 text-primary" />
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
                onClick={() => setExpanded(!expanded)}
                className="text-xs"
              >
                {expanded ? "Less" : "More"}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{reasoning}</p>
          {expanded && (
            <div className="mt-4 p-4 bg-muted rounded-xl text-sm text-muted-foreground animate-fade-in">
              <p className="mb-2"><strong>How it works:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>We parse the active salt composition of your medicine</li>
                <li>Our database matches medicines with identical active ingredients</li>
                <li>Alternatives are ranked by price while maintaining clinical equivalence</li>
                <li>Confidence scores reflect the accuracy of salt-based matching</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExplainPanel;
