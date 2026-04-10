import { Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" width={1920} height={600} />
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <div className="animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-accent text-sm font-semibold mb-6">
            🏥 Government-Grade Healthcare Intelligence
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
            Save up to <span className="text-primary">70%</span> on Your Medicines
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed">
            Millions of people unknowingly overpay for medicines despite cheaper alternatives with the same composition.{" "}
            <span className="font-semibold text-foreground">MedIntel</span> empowers users with intelligent insights to make smarter, cost-effective healthcare decisions.
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            Trusted by 50,000+ users across India • Powered by AI-simulated intelligence
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gradient-primary text-primary-foreground px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow">
              <Search className="w-5 h-5 mr-2" />
              Search Medicine
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-base border-primary/30 text-accent hover:bg-muted">
              <Upload className="w-5 h-5 mr-2" />
              Upload Prescription
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
