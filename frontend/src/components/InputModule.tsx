import { useState, useRef } from "react";
import { Search, Upload, X, FileImage, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputModuleProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const InputModule = ({ onSearch, isLoading }: InputModuleProps) => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (!query.trim()) {
      setError("Please enter a medicine name");
      return;
    }
    if (query.trim().length < 2) {
      setError("Please enter at least 2 characters");
      return;
    }
    setError("");
    onSearch(query.trim());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
      // Simulate OCR
      setTimeout(() => {
        setQuery("Crocin Advance");
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  const suggestions = ["Crocin Advance", "Azithral 500", "Pan 40", "Lipitor", "Dolo 650", "Glucophage"];

  return (
    <section id="search" className="py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Find Affordable Alternatives</h2>
          <p className="text-muted-foreground">Upload a prescription image or enter medicine name to begin</p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border p-6 md:p-8">
          {/* Search Input */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter medicine name (e.g., Crocin, Azithral)"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-base"
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading} className="gradient-primary text-primary-foreground px-6 py-3.5 h-auto rounded-xl font-semibold">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
            </Button>
          </div>
          {error && <p className="text-destructive text-sm mt-2 flex items-center gap-1">⚠️ {error}</p>}

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-muted-foreground mr-1 self-center">Try:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); setError(""); }}
                className="text-xs px-3 py-1.5 rounded-full bg-muted text-accent hover:bg-primary/10 transition-colors font-medium"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Upload */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/60 hover:bg-muted/50 transition-all"
          >
            {preview ? (
              <div className="relative inline-block">
                <img src={preview} alt="Prescription" className="max-h-40 rounded-lg mx-auto" />
                <button
                  onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <>
                <FileImage className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">Click to upload</span> or drag & drop prescription image
                </p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </div>
      </div>
    </section>
  );
};

export default InputModule;
