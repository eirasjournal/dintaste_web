from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import json
from datetime import datetime

# Asigură-te că importurile tale locale sunt corecte
import models, schemas, ml_logic
from database import SessionLocal, engine, Base

# Create DB Tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS SETUP (Neschimbat) ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://dintaste.vercel.app",
    "https://dintaste.me",
    "https://www.dintaste.me",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/dreams/", response_model=schemas.DreamResponse)
def create_dream(dream: schemas.DreamCreate, db: Session = Depends(get_db)):
    
    # 1. Fetch history for context
    previous_dreams = db.query(models.Dream).all()
    
    # 2. CALCULATE AI LOGIC
    # Returneaza: { "interpretation": {...}, "resonance": {...}, "similarity": {...} }
    analysis_result = ml_logic.analyze_new_dream(
        new_dream_text=dream.content,
        all_previous_dreams=previous_dreams,
        current_date_str=dream.date_occurred # Trimitem string-ul original pt logica Python
    )
    
    # 3. Extract parts
    interp_data = analysis_result.get("interpretation", {})
    resonance_data = analysis_result.get("resonance", {})
    similarity_data = analysis_result.get("similarity", {})
    
    # ====================================================
    # ⬇️ FIX PENTRU SQLITE DATE ERROR ⬇️
    # ====================================================
    parsed_date_obj = datetime.now().date() # Default: Azi
    
    if dream.date_occurred:
        try:
            if isinstance(dream.date_occurred, str):
                # Încercăm să convertim string-ul "YYYY-MM-DD" în obiect date
                # Ajustează formatul dacă primești altceva (ex: ISO cu T)
                parsed_date_obj = datetime.strptime(dream.date_occurred, "%Y-%m-%d").date()
            else:
                # Dacă Pydantic a convertit deja în obiect date/datetime
                parsed_date_obj = dream.date_occurred
        except ValueError:
            # Dacă formatul e greșit, rămâne data de azi (fallback)
            print(f"⚠️ Format dată invalid: {dream.date_occurred}. Se folosește azi.")
            pass
    # ====================================================

    # 4. SAVE TO DB (Flat Structure)
    # Salvăm datele în coloanele existente ale bazei de date
    db_dream = models.Dream(
        content=dream.content, 
        
        # FOLOSIM OBIECTUL CONVERTIT, NU STRING-UL!
        date_occurred=parsed_date_obj, 
        
        # Mapăm datele noi la coloanele VECHI din DB
        cluster_label=resonance_data.get("label", "UNIQUE"),
        similarity_percentage=resonance_data.get("percentage", 0),
        similar_count=similarity_data.get("similar_count", 0),
        
        # Salvăm sumarul text
        interpretation=interp_data.get("summary", "Analysis processed."),
        
        # Salvăm tot obiectul JSON bogat în coloana 'analysis_json'
        analysis_json=json.dumps({
            "ai_data": interp_data,
            "temporal_matches": similarity_data.get("temporal_matches", 0),
            "is_sync": resonance_data.get("is_sync", False)
        })
    )
    
    db.add(db_dream)
    db.commit()
    db.refresh(db_dream)
    
    # 5. CONSTRUCT RESPONSE (Nested Structure)
    # Construim un dicționar care se potrivește cu noua schemă `DreamResponse`.
    
    return {
        "id": db_dream.id,
        "content": db_dream.content,
        "date_occurred": str(db_dream.date_occurred), # Convertim înapoi în string pt JSON response
        
        # Construim obiectul 'resonance' cerut de Frontend
        "resonance": {
            "label": db_dream.cluster_label, # Luat din DB
            "percentage": db_dream.similarity_percentage, # Luat din DB
            "is_sync": resonance_data.get("is_sync", False) # Luat din analiza live
        },
        
        # Construim obiectul 'similarity' cerut de Frontend
        "similarity": {
            "similar_count": db_dream.similar_count, # Luat din DB
            "temporal_matches": similarity_data.get("temporal_matches", 0) # Luat din analiza live
        },
        
        # Trimitem obiectul complet de interpretare
        "interpretation": interp_data
    }