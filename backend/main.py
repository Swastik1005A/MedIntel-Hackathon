import os
import base64
import json
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from groq import Groq
import google.generativeai as genai

app = FastAPI()

# Configure CORS for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Clients
# Pinned to groq==0.5.0 to avoid the 'proxies' TypeError
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY"))

# Data structures
class Alternative(BaseModel):
    alt_name: str
    alt_price: float
    savings: int
    side_effects: List[str]

class MedicationResponse(BaseModel):
    name: str
    salt: str
    price: float
    description: str
    alternatives: List[Alternative]

class MedicationRequest(BaseModel):
    name: str

def clean_price(price_val):
    """Helper to convert currency strings to floats."""
    if isinstance(price_val, (int, float)):
        return float(price_val)
    cleaned = re.sub(r'[^\d.]', '', str(price_val))
    return float(cleaned) if cleaned else 0.0

@app.post("/analyze-medication", response_model=MedicationResponse)
async def analyze_medication(request: MedicationRequest):
    try:
        prompt = f"""
        You are a licensed Indian Pharmacist. Identify the active chemical salt of {request.name}. 
        Only suggest generic alternatives that share the EXACT same chemical salt and dosage.
        
        Include a 2-sentence summary of what this medicine does and 3 common side effects in 'description'.
        
        Analyze: {request.name}
        Return ONLY a JSON object:
        {{
            "name": "Branded Name",
            "salt": "Chemical Composition",
            "price": 0.0,
            "description": "Summary...",
            "alternatives": [
                {{"alt_name": "Alt1", "alt_price": 0.0, "savings": 0, "side_effects": ["Effect1"]}}
            ]
        }}
        """
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a professional pharmacist. Output ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        data = json.loads(completion.choices[0].message.content)
        data["price"] = clean_price(data.get("price", 0))
        for alt in data.get("alternatives", []):
            alt["alt_price"] = clean_price(alt.get("alt_price", 0))
            alt["savings"] = int(clean_price(alt.get("savings", 0)))
            
        return data

    except Exception as e:
        print(f"AI Error: {e}")
        return {
            "name": request.name,
            "salt": "Analysis Unavailable",
            "price": 0.0,
            "description": "The AI Engine is currently rate-limited. Please try again in 60 seconds.",
            "alternatives": []
        }

@app.post("/analyze-prescription")
async def analyze_prescription(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image_part = {
            "mime_type": file.content_type if file.content_type else "image/jpeg",
            "data": contents
        }
        
        # Using Gemini 1.5 Pro for superior handwriting recognition
        model = genai.GenerativeModel("gemini-1.5-pro-latest") 
        
        prompt = """You are a senior Pharmacy OCR Expert. 
Decipher the handwriting in this Indian prescription image.

INSTRUCTIONS:
1. FOCUS: Look for brand names or generic salts.
2. CONTEXT: Doctors often use prefixes like 'Tab', 'Cap', or 'Syr'. 
3. CLEANING: Ignore quantity calculations (like 1x2 or total counts like =30).
4. RECOGNITION: If a word is partially legible (e.g., 'Asca...'), use your medical knowledge of the Indian market to identify the most likely medication.

Return ONLY a JSON object: 
{"medicines": ["Detected Name 1", "Detected Name 2"]}
If no medicines are found, return {"medicines": []}."""
        
        response = await model.generate_content_async([image_part, prompt])
        
        # Robust cleaning for markdown garbage
        result_text = response.text.strip()
        result_text = re.sub(r'```json\s*|```\s*', '', result_text)
        
        print(f"GEMINI PRO OUTPUT: {result_text}")
        return json.loads(result_text)

    except Exception as e:
        print(f"Vision AI Error: {e}")
        return {
            "error": "Handwriting too messy for AI. Please enter manually.", 
            "medicines": [], 
            "status": "error"
        }

if __name__ == "__main__":
    import uvicorn
    # Important for Render deployment
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)