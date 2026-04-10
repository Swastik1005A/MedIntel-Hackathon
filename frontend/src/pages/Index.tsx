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
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [noResult, setNoResult] = useState(false);

  // --- 1. MEDICINE SEARCH LOGIC (Core AI Engine) ---
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setResult(null);
    setNoResult(false);

    try {
        console.log("ANALYZING:", query);
        const response = await axios.post('http://127.0.0.1:8000/analyze-medication', {
            name: query 
        }, { timeout: 15000 });

        const data = response.data;
        
        // Map ALL alternatives from Groq/Llama to the UI Schema
        const analysis: AnalysisResult = {
            original: {
                id: "original-001",
                name: data.name || query,
                manufacturer: "Branded",
                salt: data.salt || 'Medicine',
                price: Math.round(data.price),
                dosage: 'Standard',
                type: 'Medicine'
            },
            alternatives: data.alternatives.map((alt: any, index: number) => ({
                id: `alt-${index}`,
                name: alt.alt_name,
                manufacturer: "Generic",
                salt: data.salt || 'Medicine',
                price: Math.round(alt.alt_price),
                dosage: 'Standard',
                type: 'Medicine'
            })),
            confidence: 98,
            safetyLevel: "safe",
            reasoning: data.alternatives[0]?.side_effects?.length > 0 
                ? "Watch out for: " + data.alternatives[0].side_effects.join(", ") 
                : "Generally safe."
        };

        setResult(analysis);
        setNoResult(false);

    } catch (err: any) {
        console.error("Search Error:", err.message);
        setNoResult(true);
        toast({
          title: "Analysis Failed",
          description: "The AI engine is taking too long or the backend is down.",
          variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };

  // --- 2. PRESCRIPTION VISION LOGIC (The "Magic" Step) ---
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setResult(null);
    toast({ 
        title: "Scanning Prescription", 
        description: "Llama 3.2 Vision is reading the doctor's handwriting..." 
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze-prescription', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log("VISION EXTRACTED:", response.data);

      if (response.data.medicines && response.data.medicines.length > 0) {
        const firstMed = response.data.medicines[0];
        toast({ 
            title: "Success!", 
            description: `Extracted: ${firstMed}. Finding cheaper options...` 
        });
        
        // AUTO-TRIGGER Search
        handleSearch(firstMed); 
      } else {
        toast({ 
            title: "Read Error", 
            description: "Could not identify medicine names. Use a clearer image.", 
            variant: "destructive" 
        });
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Vision Error:", err);
      toast({ 
        title: "Vision AI Error", 
        description: "Upload failed or server is offline.", 
        variant: "destructive" 
      });
      setIsLoading(false);
    }
  };

  // --- 3. CALCULATE SAVINGS ---
  const lowestAltPrice = result && result.alternatives.length > 0 
    ? Math.min(...result.alternatives.map(a => a.price)) 
    : 0;
  
  const savings = result ? result.original.price - lowestAltPrice : 0;
  const savingsPercent = result ? Math.round((savings / result.original.price) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      <InputModule 
        onSearch={handleSearch} 
        onFileUpload={handleFileUpload} 
        isLoading={isLoading} 
      />

      {user && <SearchHistory onReSearch={handleSearch} />}
      {user && <PersonalSavingsTracker />}

      {isLoading && <AnalysisLoader />}

      {noResult && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-card rounded-2xl border p-10 shadow-sm">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-xl font-semibold text-foreground mb-2">Engine Offline</h3>
              <p className="text-sm text-muted-foreground">
                Run 'uvicorn main:app --reload' in your backend folder to start the AI.
              </p>
            </div>
          </div>
        </section>
      )}

      {result && result.alternatives.length > 0 && (
        <div className="animate-fade-in" id="report-content">
          <ComparisonPanel result={result} />
          <SavingsHighlight savings={savings} percentage={savingsPercent} />
          <SafetyIndicator result={result} />
          <ExplainPanel reasoning={result.reasoning} />
          <DownloadReport result={result} />
        </div>
      )}

      <PharmacySection />
      <GovernmentAwareness />
      <Dashboard />
      <Footer />
    </div>
  );
};

export default Index;