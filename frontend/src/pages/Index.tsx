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
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [analyzingMeds, setAnalyzingMeds] = useState<string[]>([]);
  const [noResult, setNoResult] = useState(false);

  // --- 1. MEDICINE SEARCH LOGIC (Core AI Engine) ---
  const handleSearch = async (queryInput: string | string[]) => {
    setIsLoading(true);
    setResults([]);
    setNoResult(false);

    const queries = Array.isArray(queryInput) ? queryInput : [queryInput];
    setAnalyzingMeds(queries);

    try {
        console.log("ANALYZING:", queries);

        const allAnalyses = await Promise.all(queries.map(async (query, qIndex) => {
            const response = await axios.post(`${API_URL}/analyze-medication`, {
                name: query 
            }, { timeout: 15000 });

            const data = response.data;
            
            return {
                original: {
                    id: `original-${qIndex}`,
                    name: data.name || query,
                    manufacturer: "Branded",
                    salt: data.salt || 'Medicine',
                    price: Math.round(data.price),
                    dosage: 'Standard',
                    type: 'Medicine'
                },
                alternatives: data.alternatives.map((alt: any, index: number) => ({
                    id: `alt-${qIndex}-${index}`,
                    name: alt.alt_name,
                    manufacturer: "Generic",
                    salt: data.salt || 'Medicine',
                    price: Math.round(alt.alt_price),
                    dosage: 'Standard',
                    type: 'Medicine'
                })),
                confidence: 98,
                safetyLevel: "safe",
                reasoning: data.description || "Waiting for detailed clinical analysis..."
            } as AnalysisResult;
        }));

        setResults(allAnalyses);
        setNoResult(allAnalyses.length === 0);

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
        setAnalyzingMeds([]);
    }
  };

  // --- 2. PRESCRIPTION VISION LOGIC (The "Magic" Step) ---
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setResults([]);
    setNoResult(false);
    toast({ 
        title: "Scanning Prescription", 
        description: "Llama 3.2 Vision is reading the doctor's handwriting..." 
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/analyze-prescription`, formData);


      console.log("VISION EXTRACTED:", response.data);

      if (response.data.medicines && response.data.medicines.length > 0) {
        const meds = response.data.medicines;
        toast({ 
            title: "Success!", 
            description: `Extracted ${meds.length} medicines. Finding cheaper options...` 
        });
        
        // AUTO-TRIGGER Search with full array
        handleSearch(meds); 
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
  let totalOriginalPrice = 0;
  let totalCheapestPrice = 0;

  results.forEach(res => {
     if (res.alternatives.length > 0) {
         totalOriginalPrice += res.original.price;
         totalCheapestPrice += Math.min(...res.alternatives.map(a => a.price));
     }
  });

  const savings = totalOriginalPrice - totalCheapestPrice;
  const savingsPercent = totalOriginalPrice > 0 ? Math.round((savings / totalOriginalPrice) * 100) : 0;

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

      {isLoading && analyzingMeds.length > 0 ? (
        <div className="animate-fade-in" id="loading-content">
          <div className="space-y-12">
            {analyzingMeds.map((med, index) => (
                <div key={index} className="bg-muted/30 backdrop-blur-sm rounded-[40px] border border-border/50 relative shadow-sm mt-4">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-background border-2 border-primary/20 text-primary px-8 py-2 rounded-full text-sm font-black uppercase tracking-widest -mt-5 shadow-lg">
                     Processing {index + 1} of {analyzingMeds.length}
                  </div>
                  <AnalysisLoader medicineName={med} />
                </div>
            ))}
          </div>
        </div>
      ) : (
        isLoading && <AnalysisLoader />
      )}

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

      {results && results.length > 0 && (
        <div className="animate-fade-in block w-full overflow-x-hidden max-w-full xl:max-w-[1500px] mx-auto px-2 md:px-8 py-8" id="report-content">
            {results.map((res, index) => (
               <div key={res.original.id} className="bg-muted/30 backdrop-blur-sm rounded-[40px] p-6 md:p-10 border border-border/50 relative shadow-sm mb-20 w-full overflow-x-auto lg:overflow-x-visible">
                   {results.length > 1 && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-background border-2 border-primary/20 text-primary px-8 py-2 rounded-full text-sm font-black uppercase tracking-widest -mt-5 shadow-lg">
                         Medicine {index + 1} of {results.length}
                      </div>
                   )}
                   <ComparisonPanel result={res} />
                   <SafetyIndicator result={res} />
                   <ExplainPanel reasoning={res.reasoning} medicineName={res.original.name} salt={res.original.salt} />
               </div>
            ))}
          
          <div className="flex flex-col gap-8 w-full mt-4">
            <SavingsHighlight savings={savings} percentage={savingsPercent} />
            <DownloadReport results={results} result={results[0]} />
          </div>
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