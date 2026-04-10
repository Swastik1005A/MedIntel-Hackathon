import os
import base64
import json
import re
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from groq import Groq
import google.generativeai as genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY"))

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
        
        model = genai.GenerativeModel("gemini-1.5-flash-latest")
        # STRICT PROMPT to avoid extra text or markdown
        prompt = """Identify medications in this Indian prescription. 
        Return ONLY a raw JSON object with NO markdown or code blocks.
        Example format: {"medicines": ["Medicine Name 1", "Medicine Name 2"]}
        If no medicines are found, return {"medicines": []}."""
        
        response = await model.generate_content_async([image_part, prompt])
        
        # Enhanced text cleaning
        result_text = response.text.strip()
        result_text = re.sub(r'```json|```', '', result_text).strip()
        
        print(f"GEMINI RAW OUTPUT: {result_text}")
        return json.loads(result_text)

    except Exception as e:
        print(f"Vision AI Error: {e}")
        # FIXED: Removed hardcoded Ciprofloxacin/Paracetamol fallback
        return {
            "error": "Prescription analysis failed. Please try typing the name manually.", 
            "medicines": [], 
            "status": "error"
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)