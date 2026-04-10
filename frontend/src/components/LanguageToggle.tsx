import { useLanguage } from "@/context/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-full border bg-muted p-0.5 text-xs">
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
          lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("hi")}
        className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
          lang === "hi" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
        }`}
      >
        हिं
      </button>
    </div>
  );
};

export default LanguageToggle;
