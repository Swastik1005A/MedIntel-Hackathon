import { BadgeCheck, Building2, Pill, HeartPulse } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const programs = [
  {
    icon: Building2,
    title: "Jan Aushadhi Yojana",
    desc: "Government initiative providing quality generic medicines at affordable prices through dedicated stores.",
  },
  {
    icon: Pill,
    title: "Generic Medicine Drive",
    desc: "Doctors are encouraged to prescribe generic medicines which can be 50-90% cheaper than branded equivalents.",
  },
  {
    icon: BadgeCheck,
    title: "CDSCO Approved Generics",
    desc: "All generic medicines are tested and approved by CDSCO ensuring same quality and efficacy as branded versions.",
  },
  {
    icon: HeartPulse,
    title: "Ayushman Bharat",
    desc: "National health protection scheme covering up to ₹5 lakh per family per year for secondary and tertiary care.",
  },
];

const GovernmentAwareness = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 section-bg">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t("govt.title")}</h2>
          <p className="text-muted-foreground text-sm">Know your rights to affordable healthcare</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {programs.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="bg-card rounded-xl border p-6 hover-card-lift">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{p.title}</h4>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GovernmentAwareness;
