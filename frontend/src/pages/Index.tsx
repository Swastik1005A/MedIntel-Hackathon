import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InputModule from "@/components/InputModule";
import AnalysisLoader from "@/components/AnalysisLoader";
import ComparisonPanel from "@/components/ComparisonPanel";
import SavingsHighlight from "@/components/SavingsHighlight";
import SafetyIndicator from "@/components/SafetyIndicator";
import ExplainPanel from "@/components/ExplainPanel";
import PharmacySection from "@/components/PharmacySection";
import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import SearchHistory from "@/components/SearchHistory";
import PersonalSavingsTracker from "@/components/PersonalSavingsTracker";
import GovernmentAwareness from "@/components/GovernmentAwareness";
import DownloadReport from "@/components/DownloadReport";
import { type AnalysisResult } from "@/data/medicines";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const Index = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [noResult, setNoResult] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setResult(null);
    setNoResult(false);

    try {
        const response = await axios.post('http://localhost:8000/analyze-medication', {
            med_name: query,
            user_id: user ? user.uid : 'anonymous'
        });

        const data = response.data;
        const cheapestAlt = data.cheaper_alternatives[0];

        // Deduce original price from savings geometry
        const savingsPercent = cheapestAlt.percent_savings;
        let originalPrice = cheapestAlt.estimated_price_inr;
        if (savingsPercent < 100) {
            originalPrice = cheapestAlt.estimated_price_inr / (1 - (savingsPercent / 100));
        }

        // Map Gemini JSON to Lovable's UI Schema
        const analysis: AnalysisResult = {
            original: {
                id: "original-001",
                name: query,
                manufacturer: "Branded Manufacturer",
                salt: data.active_ingredient,
                price: Math.round(originalPrice),
                dosage: data.dosage_form,
                type: data.therapeutic_purpose
            },
            alternatives: data.cheaper_alternatives.map((alt: any, i: number) => ({
                id: `alt-${i}`,
                name: alt.brand_name,
                manufacturer: "Generic Manufacturer",
                salt: data.active_ingredient,
                price: alt.estimated_price_inr,
                dosage: data.dosage_form,
                type: data.therapeutic_purpose
            })),
            confidence: 96,
            safetyLevel: data.safety_indicator.toLowerCase().includes("consult") ? "consult" : "safe",
            reasoning: data.safety_indicator
        };

        setResult(analysis);
        setNoResult(false);

    } catch (err: any) {
        console.error("API Error", err);
        setNoResult(true);
    } finally {
        setIsLoading(false);
    }
  };

  const savings = result ? result.original.price - result.alternatives[0].price : 0;
  const savingsPercent = result ? Math.round((savings / result.original.price) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <InputModule onSearch={handleSearch} isLoading={isLoading} />

      {user && <SearchHistory onReSearch={handleSearch} />}
      {user && <PersonalSavingsTracker />}

      {isLoading && <AnalysisLoader />}

      {noResult && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-card rounded-2xl border p-10 shadow-sm">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Alternatives Found</h3>
              <p className="text-sm text-muted-foreground">
                We couldn't reach the intelligence engine or no options are available. Ensure backend is running.
              </p>
            </div>
          </div>
        </section>
      )}

      {result && (
        <div className="animate-fade-in" id="report-content">
          <ComparisonPanel result={result} />
          <SavingsHighlight savings={savings} percentage={savingsPercent} />
          <SafetyIndicator result={result} />
          <ExplainPanel reasoning={result.reasoning} />
        </div>
      )}
      
      {result && <DownloadReport result={result} />}

      <PharmacySection />
      <GovernmentAwareness />
      <Dashboard />
      <Footer />
    </div>
  );
};

export default Index;
