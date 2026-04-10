import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai

load_dotenv()

# --- Firebase Initialization ---
# Check if Firebase is already initialized to avoid errors during server reloads
if not firebase_admin._apps:
    key_path = "serviceAccountKey.json"
    if not os.path.exists(key_path):
        key_path = "backend/serviceAccountKey.json" # Fallback if run from root
    
    if os.path.exists(key_path):
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred)
        print("Firebase initialized successfully.")
    else:
        print("WARNING: serviceAccountKey.json not found. Firebase features will fail.")

try:
    # Use default Firestore database
    db = firestore.client()
except Exception as e:
    db = None
    print(f"Failed to initialize Firestore client: {e}")

# --- Gemini Initialization ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("Gemini initialized successfully.")
else:
    print("WARNING: GEMINI_API_KEY not found in environment.")

app = FastAPI(title="Affordable Medicine Intelligence Platform Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class MedicationRequest(BaseModel):
    med_name: str
    user_id: str

class Alternative(BaseModel):
    brand_name: str = Field(description="Include the manufacturer's name (e.g., 'Advent by Cipla')")
    estimated_price_inr: float
    percent_savings: float

class AnalysisResponse(BaseModel):
    active_ingredient: str
    therapeutic_purpose: str
    dosage_form: str = Field(description="Must match the exact strength of the original if applicable")
    safety_indicator: str = Field(description="Explicitly state if it is a 'therapeutic equivalent' or requires a specific dosage adjustment notice")
    cheaper_alternatives: List[Alternative]

# --- Endpoints ---
@app.get("/")
def read_root():
    return {"status": "Affordable Medicine Intelligence API is running"}

@app.post("/analyze-medication", response_model=AnalysisResponse)
async def analyze_medication(req: MedicationRequest):
    if not db:
        raise HTTPException(status_code=500, detail="Firestore is not initialized. Check serviceAccountKey.json.")
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is missing. Check .env file.")

    # Format the mediation name to use as a consistent Document ID
    med_name_formatted = req.med_name.strip().lower()
    
    # 1. Caching Layer: Check Firestore first
    # Path: users/{user_id}/medications/{med_name}
    doc_ref = db.collection("users").document(req.user_id).collection("medications").document(med_name_formatted)
    doc_snap = doc_ref.get()
    
    if doc_snap.exists:
        print(f"CACHE HIT: Returning existing analysis for {med_name_formatted}")
        return doc_snap.to_dict()

    print(f"CACHE MISS: Calling Gemini for {med_name_formatted}")
    
    # 2. Call Gemini 3 Flash if not in cache
    model = genai.GenerativeModel('gemini-3-flash-preview')
    
    prompt = f"""
    You are an expert pharmaceutical assistant and doctor specializing in the Indian healthcare market and CDSCO pharmaceutical regulations.
    Analyze the following medication: '{req.med_name}'.
    
    Provide a detailed pharmaceutical analysis strictly as JSON.
    Only suggest brands/generics commonly approved for sale in India.
    
    Crux Requirements:
    1. Dosage Compatibility: Verify that suggested alternatives have the EXACT SAME strength (e.g., 625mg) as the original.
    2. Comparison Depth: Include the manufacturer's name in the 'brand_name' (e.g., 'Advent by Cipla').
    3. Decision Support: In the 'safety_indicator', explicitly state if the alternative is a 'therapeutic equivalent' or if it requires a specific dosage adjustment notice. Also include any critical side effects in ALL CAPS.
    4. Provide realistic estimated prices in INR (₹) for the alternatives and the calculated percentage savings compared to '{req.med_name}'.
    """
    
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema={
                    "type": "object",
                    "properties": {
                        "active_ingredient": {"type": "string"},
                        "therapeutic_purpose": {"type": "string"},
                        "dosage_form": {"type": "string"},
                        "safety_indicator": {"type": "string"},
                        "cheaper_alternatives": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "brand_name": {"type": "string"},
                                    "estimated_price_inr": {"type": "number"},
                                    "percent_savings": {"type": "number"}
                                },
                                "required": ["brand_name", "estimated_price_inr", "percent_savings"]
                            }
                        }
                    },
                    "required": ["active_ingredient", "therapeutic_purpose", "dosage_form", "safety_indicator", "cheaper_alternatives"]
                }
            )
        )
        
        # 3. Parse Gemini Result
        analysis_result = json.loads(response.text)
        
        # 4. Save to Firestore (Cache it)
        doc_ref.set(analysis_result)
        print(f"Analysis saved to Firestore for {med_name_formatted}")
        
        return analysis_result
        
    except Exception as e:
        print(f"Error calling Gemini or Firestore: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze medication: {str(e)}")
