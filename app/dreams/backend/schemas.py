from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, List, Dict, Any

# --- INPUT (Ce trimite userul) ---
class DreamCreate(BaseModel):
    content: str = Field(..., min_length=10, max_length=1500)
    date_occurred: str  # Am schimbat in str pentru a evita erori de parsuare, il convertim noi

# --- OUTPUT SUB-MODELS (Piese pentru raspuns) ---
class ResonanceInfo(BaseModel):
    label: str
    percentage: int
    is_sync: bool = False

class SimilarityInfo(BaseModel):
    similar_count: int
    temporal_matches: int = 0

# --- OUTPUT FINAL (Ce primeste Frontend-ul) ---
class DreamResponse(BaseModel):
    id: int
    content: str
    date_occurred: str # sau date
    
    # Aici e schimbarea majoră: folosim obiecte, nu string-uri plate
    resonance: ResonanceInfo
    similarity: SimilarityInfo
    
    # Interpretation va conține obiectul bogat (motifs, advice, etc.)
    interpretation: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True