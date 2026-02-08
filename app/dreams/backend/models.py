from sqlalchemy import Column, Integer, String, Date, Text
from database import Base

class Dream(Base):
    __tablename__ = "dreams"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    date_occurred = Column(Date, nullable=False)
    
    # --- ANALYSIS DATA ---
    # We store the "Cluster Label" (e.g., "COLLECTIVE_ECHO")
    cluster_label = Column(String, default="PROCESSING")
    
    # We store the Resonance Score (e.g., 85)
    similarity_percentage = Column(Integer, default=0)
    
    # We store the count of similar dreams
    similar_count = Column(Integer, default=0)
    
    # We store the main text interpretation for easy access
    interpretation = Column(Text, default="Pending...")
    
    # NEW: We store the full rich data (Motifs, Emotions, Advice) as a JSON string
    # This allows us to save lists like ["water", "flying"] without creating 10 new tables.
    analysis_json = Column(Text, nullable=True)