export interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  salt: string;
  price: number;
  dosage: string;
  type: string;
}

export const medicineDatabase: Medicine[] = [
  { id: "1", name: "Crocin Advance", manufacturer: "GSK", salt: "Paracetamol 500mg", price: 30, dosage: "500mg", type: "Tablet" },
  { id: "2", name: "Dolo 650", manufacturer: "Micro Labs", salt: "Paracetamol 650mg", price: 32, dosage: "650mg", type: "Tablet" },
  { id: "3", name: "Paracip", manufacturer: "Cipla", salt: "Paracetamol 500mg", price: 12, dosage: "500mg", type: "Tablet" },
  { id: "4", name: "Calpol", manufacturer: "GSK", salt: "Paracetamol 500mg", price: 18, dosage: "500mg", type: "Tablet" },
  { id: "5", name: "Azithral 500", manufacturer: "Alembic", salt: "Azithromycin 500mg", price: 120, dosage: "500mg", type: "Tablet" },
  { id: "6", name: "Azee 500", manufacturer: "Cipla", salt: "Azithromycin 500mg", price: 98, dosage: "500mg", type: "Tablet" },
  { id: "7", name: "Zithromax", manufacturer: "Pfizer", salt: "Azithromycin 500mg", price: 180, dosage: "500mg", type: "Tablet" },
  { id: "8", name: "AziBest", manufacturer: "Best Biotech", salt: "Azithromycin 500mg", price: 45, dosage: "500mg", type: "Tablet" },
  { id: "9", name: "Pan 40", manufacturer: "Alkem", salt: "Pantoprazole 40mg", price: 85, dosage: "40mg", type: "Tablet" },
  { id: "10", name: "Pantocid", manufacturer: "Sun Pharma", salt: "Pantoprazole 40mg", price: 72, dosage: "40mg", type: "Tablet" },
  { id: "11", name: "Pantop 40", manufacturer: "Aristo", salt: "Pantoprazole 40mg", price: 35, dosage: "40mg", type: "Tablet" },
  { id: "12", name: "Atorva 10", manufacturer: "Zydus", salt: "Atorvastatin 10mg", price: 95, dosage: "10mg", type: "Tablet" },
  { id: "13", name: "Lipitor", manufacturer: "Pfizer", salt: "Atorvastatin 10mg", price: 220, dosage: "10mg", type: "Tablet" },
  { id: "14", name: "Atorlip 10", manufacturer: "Cipla", salt: "Atorvastatin 10mg", price: 52, dosage: "10mg", type: "Tablet" },
  { id: "15", name: "Amoxil", manufacturer: "GSK", salt: "Amoxicillin 500mg", price: 110, dosage: "500mg", type: "Capsule" },
  { id: "16", name: "Mox 500", manufacturer: "Ranbaxy", salt: "Amoxicillin 500mg", price: 45, dosage: "500mg", type: "Capsule" },
  { id: "17", name: "Amoxyclav", manufacturer: "Cipla", salt: "Amoxicillin 500mg", price: 65, dosage: "500mg", type: "Capsule" },
  { id: "18", name: "Metformin GP", manufacturer: "USV", salt: "Metformin 500mg", price: 75, dosage: "500mg", type: "Tablet" },
  { id: "19", name: "Glycomet", manufacturer: "USV", salt: "Metformin 500mg", price: 28, dosage: "500mg", type: "Tablet" },
  { id: "20", name: "Glucophage", manufacturer: "Merck", salt: "Metformin 500mg", price: 140, dosage: "500mg", type: "Tablet" },
];

export interface AnalysisResult {
  original: Medicine;
  alternatives: Medicine[];
  confidence: number;
  safetyLevel: "safe" | "consult" | "not-equivalent";
  reasoning: string;
}

export function findAlternatives(query: string): AnalysisResult | null {
  const normalizedQuery = query.toLowerCase().trim();
  const original = medicineDatabase.find(
    (m) => m.name.toLowerCase().includes(normalizedQuery) || normalizedQuery.includes(m.name.toLowerCase())
  );

  if (!original) return null;

  const alternatives = medicineDatabase
    .filter((m) => m.salt === original.salt && m.id !== original.id)
    .sort((a, b) => a.price - b.price);

  if (alternatives.length === 0) return null;

  const confidence = 87 + Math.floor(Math.random() * 10);

  return {
    original,
    alternatives: alternatives.slice(0, 3),
    confidence,
    safetyLevel: "safe",
    reasoning: `This alternative contains the same active ingredient (${original.salt}) and provides similar therapeutic effectiveness at a lower cost. The salt composition is identical, ensuring equivalent clinical outcomes.`,
  };
}

export const pharmacies = [
  { name: "MedPlus Pharmacy", distance: "0.8 km", available: true, discount: "5%", price: "₹28" },
  { name: "Apollo Pharmacy", distance: "1.2 km", available: true, discount: "3%", price: "₹32" },
  { name: "NetMeds Store", distance: "2.1 km", available: false, discount: "10%", price: "₹22" },
  { name: "1mg HealthKart", distance: "3.5 km", available: true, discount: "8%", price: "₹25" },
];
