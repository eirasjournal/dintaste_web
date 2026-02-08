from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, List, Dict, Any

# --- INPUT (What user sends) ---
class DreamCreate(BaseModel):
    content: str = Field(..., min_length=10, max_length=1500)
    date_occurred: date

# --- OUTPUT (What server sends back) ---
class DreamResponse(BaseModel):
    id: int
    content: str
    date_occurred: date
    
    # High-level stats
    cluster_label: str = "Unprocessed"
    similarity_percentage: int = 0
    similar_count: int = 0
    
    # The simple text summary
    interpretation: str = "Pending..."
    
    # The Rich Data (Motifs, Advice, etc.)
    # We type this as a Dictionary so the frontend receives a real JSON object
    analysis: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True