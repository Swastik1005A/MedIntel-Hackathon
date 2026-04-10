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

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Data structures for the AI to follow
class Alternative(BaseModel):
    alt_name: str
    alt_price: float
    savings: int
    side_effects: List[str]

class MedicationResponse(BaseModel):
    name: str
    salt: str
    price: float
    alternatives: List[Alternative]

class MedicationRequest(BaseModel):
    name: str

def clean_price(price_val):
    """Helper to convert strings like '₹30' or '45.50 INR' to a clean float."""
    if isinstance(price_val, (int, float)):
        return float(price_val)
    # Remove everything except numbers and dots
    cleaned = re.sub(r'[^\d.]', '', str(price_val))
    return float(cleaned) if cleaned else 0.0

@app.post("/analyze-medication", response_model=MedicationResponse)
async def analyze_medication(request: MedicationRequest):
    try:
        prompt = f"""
        Analyze the Indian medication: {request.name}
        Return ONLY a JSON object with this EXACT structure:
        {{
            "name": "Branded Name",
            "salt": "Chemical Composition",
            "price": 0.0,
            "alternatives": [
                {{"alt_name": "Alt1", "alt_price": 0.0, "savings": 0, "side_effects": ["Effect1"]}},
                {{"alt_name": "Alt2", "alt_price": 0.0, "savings": 0, "side_effects": ["Effect2"]}},
                {{"alt_name": "Alt3", "alt_price": 0.0, "savings": 0, "side_effects": ["Effect3"]}}
            ]
        }}
        Provide at least 3 generic alternatives available in India.
        """
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a professional medical pharmacist in India. Output ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        data = json.loads(completion.choices[0].message.content)
        
        # Data Cleaning: Ensure prices are floats and savings are ints
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
            "alternatives": []
        }

@app.post("/analyze-prescription")
async def analyze_prescription(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        base64_image = base64.b64encode(contents).decode('utf-8')
        
        completion = client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Identify medicine names in this prescription. Return ONLY a JSON list of strings under key 'medicines'."},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                    ]
                }
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)