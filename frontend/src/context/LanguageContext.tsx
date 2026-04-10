import { createContext, useContext, useState, type ReactNode } from "react";

type Lang = "en" | "hi";

const translations: Record<string, Record<Lang, string>> = {
  "nav.search": { en: "Search", hi: "खोजें" },
  "nav.howItWorks": { en: "How It Works", hi: "कैसे काम करता है" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "hero.badge": { en: "🏥 Government-Grade Healthcare Intelligence", hi: "🏥 सरकारी-स्तरीय स्वास्थ्य बुद्धिमत्ता" },
  "hero.title1": { en: "Save up to", hi: "बचाएं" },
  "hero.title2": { en: "on Your Medicines", hi: "अपनी दवाओं पर" },
  "hero.subtitle": { en: "Millions of people unknowingly overpay for medicines despite cheaper alternatives with the same composition.", hi: "लाखों लोग अनजाने में दवाओं के लिए अधिक भुगतान करते हैं।" },
  "search.title": { en: "Find Affordable Alternatives", hi: "सस्ते विकल्प खोजें" },
  "search.subtitle": { en: "Upload a prescription image or enter medicine name to begin", hi: "शुरू करने के लिए प्रिस्क्रिप्शन अपलोड करें या दवा का नाम दर्ज करें" },
  "search.placeholder": { en: "Enter medicine name (e.g., Crocin, Azithral)", hi: "दवा का नाम दर्ज करें (जैसे, क्रोसिन, एज़िथ्रल)" },
  "search.analyze": { en: "Analyze", hi: "विश्लेषण" },
  "comparison.title": { en: "Comparison Results", hi: "तुलना परिणाम" },
  "savings.title": { en: "Your Estimated Savings", hi: "आपकी अनुमानित बचत" },
  "pharmacy.title": { en: "Nearby Pharmacies", hi: "नज़दीकी फार्मेसी" },
  "dashboard.title": { en: "Platform Insights", hi: "प्लेटफ़ॉर्म अंतर्दृष्टि" },
  "download.title": { en: "Download Report", hi: "रिपोर्ट डाउनलोड करें" },
  "govt.title": { en: "Government Affordable Medicine Programs", hi: "सरकारी सस्ती दवा कार्यक्रम" },
  "history.title": { en: "Recent Searches", hi: "हाल की खोजें" },
  "totalSavings.title": { en: "Your Total Savings", hi: "आपकी कुल बचत" },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");
  const t = (key: string) => translations[key]?.[lang] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
