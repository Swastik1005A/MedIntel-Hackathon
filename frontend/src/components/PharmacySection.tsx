import { MapPin, Clock, Check, X, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pharmacies } from "@/data/medicines";
import { useLanguage } from "@/context/LanguageContext";

const PharmacySection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 section-bg">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t("pharmacy.title")}</h2>
          <p className="text-muted-foreground text-sm">Find your medicine at the best price near you</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pharmacies.map((p, i) => {
            const isCheapest = p.discount === "10%";
            return (
              <div key={i} className={`bg-card rounded-xl border p-5 hover-card-lift ${isCheapest ? "ring-2 ring-primary/30" : ""}`}>
                {isCheapest && (
                  <span className="text-[10px] font-bold text-primary-foreground bg-primary px-2 py-0.5 rounded-full mb-2 inline-block">
                    Cheapest
                  </span>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    p.available ? "bg-savings/10 text-savings" : "bg-destructive/10 text-destructive"
                  }`}>
                    {p.available ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {p.available ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground text-sm">{p.name}</h4>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {p.distance} away
                </div>
                {p.price && (
                  <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-foreground">
                    <IndianRupee className="w-3 h-3" />
                    {p.price}
                  </div>
                )}
                {p.discount && (
                  <p className="text-xs text-primary font-medium mt-2">🏷️ {p.discount} off online</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 text-xs"
                  disabled={!p.available}
                >
                  Check Availability
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PharmacySection;
