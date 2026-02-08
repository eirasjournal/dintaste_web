from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import json

import models, schemas, ml_logic
from database import SessionLocal, engine, Base

# Create DB Tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS Setup
origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
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
    
    # 2. Run your NEW powerful logic
    # This returns { "interpretation": {...}, "resonance": {...}, ... }
    analysis_result = ml_logic.analyze_new_dream(
        new_dream_text=dream.content,
        all_previous_dreams=previous_dreams
    )
    
    # 3. Extract parts for storage
    interp_data = analysis_result.get("interpretation", {})
    resonance_data = analysis_result.get("resonance", {})
    similarity_data = analysis_result.get("similarity", {})
    
    # 4. Save to DB
    db_dream = models.Dream(
        content=dream.content, 
        date_occurred=dream.date_occurred,
        
        # Save flat fields
        cluster_label=resonance_data.get("label", "UNIQUE"),
        similarity_percentage=resonance_data.get("percentage", 0),
        similar_count=similarity_data.get("similar_count", 0),
        interpretation=interp_data.get("interpretation", ""),
        
        # Save the full rich object as a JSON string
        analysis_json=json.dumps(interp_data) 
    )
    
    db.add(db_dream)
    db.commit()
    db.refresh(db_dream)
    
    # 5. Attach the dictionary back to the response object 
    # (so the frontend gets JSON, not a string)
    if db_dream.analysis_json:
        db_dream.analysis = json.loads(db_dream.analysis_json)
        
    return db_dream