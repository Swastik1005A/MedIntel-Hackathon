import { Shield, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">MedIntel</span>
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-md">
            MedIntel is an informational tool. It does not replace professional medical advice. Always consult a licensed healthcare provider before changing medications.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-destructive" /> for India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
