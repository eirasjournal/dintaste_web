import json
import re
import os
import bleach
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from groq import Groq  # Asigură-te că ai `pip install groq` în requirements.txt

# =========================
# 1. LOAD LOCAL BRAIN (Pentru Statistici Matematice)
# =========================
# Render are memorie puțină, dar modelul 'all-MiniLM-L6-v2' este mic și ar trebui să meargă.
print("🧠 Loading embedding model...")
try:
    # Setăm timeout mai mare pentru download pe server
    os.environ["HF_HUB_DOWNLOAD_TIMEOUT"] = "120.0"
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
    print("✅ Embedding model loaded.")
except Exception as e:
    print(f"❌ Failed to load embedding model: {e}")
    embedder = None

# =========================
# 2. HELPER FUNCTIONS
# =========================

def sanitize_text(text: str) -> str:
    if not text: return ""
    return bleach.clean(text, tags=[], strip=True)

def interpret_dream_groq(dream_text: str) -> dict:
    """
    Folosește Groq API (Llama 3 in Cloud) pentru interpretare.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("❌ EROARE: Lipsă GROQ_API_KEY în Environment Variables!")
        return None

    client = Groq(api_key=api_key)

    prompt = f"""
    You are a Jungian dream analyst.
    Return ONLY valid JSON. Do not write an introduction.

    Schema:
    {{
      "summary": "1 sentence summary",
      "motifs": ["3-10 key symbols found in the dream"],
      "emotions": ["0-6 emotions felt"],
      "themes": ["2-6 psychological themes"],
      "interpretation": "3-5 sentences, specific to the dream, focusing on archetypes",
      "advice": "1 sentence reflection question for the dreamer"
    }}

    Dream:
    {dream_text}
    """.strip()

    try:
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192", 
            response_format={"type": "json_object"}, 
        )
        
        response_content = completion.choices[0].message.content
        return json.loads(response_content)

    except Exception as e:
        print(f"Groq API Error: {e}")
        return None

# =========================
# 3. FALLBACK LOGIC
# =========================
def local_fallback(dream_text: str):
    return {
        "summary": "AI Analysis unavailable.",
        "motifs": ["System Offline"],
        "emotions": ["Error"],
        "themes": ["Connection Issue"],
        "interpretation": "Could not connect to the AI oracle. Please check API Keys.",
        "advice": "Try again later."
    }

# =========================
# 4. SIMILARITY LOGIC (Math)
# =========================
def calculate_similarity(new_text: str, previous_dreams: list):
    if embedder is None or not previous_dreams:
        return {"percentage": 0, "count": 0, "label": "ORIGIN_POINT"}

    try:
        old_texts = []
        for d in previous_dreams:
            if hasattr(d, 'content'): old_texts.append(d.content)
            elif isinstance(d, dict): old_texts.append(d.get('content', ''))
            else: old_texts.append(str(d))

        if not old_texts:
            return {"percentage": 0, "count": 0, "label": "ORIGIN_POINT"}

        new_vec = embedder.encode([new_text])
        old_vecs = embedder.encode(old_texts)
        scores = cosine_similarity(new_vec, old_vecs)[0]
        
        threshold = 0.55
        matches = [s for s in scores if s > threshold]
        count = len(matches)
        max_score = max(scores) if len(scores) > 0 else 0
        percentage = int(max_score * 100)

        label = "UNIQUE_VISION"
        if percentage > 85: label = "COLLECTIVE_ECHO"
        elif percentage > 60: label = "SHARED_ARCHETYPE"

        return {"percentage": percentage, "count": count, "label": label}
    except Exception as e:
        print(f"Similarity Error: {e}")
        return {"percentage": 0, "count": 0, "label": "CALC_ERROR"}

# =========================
# 5. MAIN ENTRY POINT (Funcția lipsă!)
# =========================
def analyze_new_dream(new_dream_text: str, all_previous_dreams: list):
    """
    Funcția principală apelată de main.py
    """
    clean_text = sanitize_text(new_dream_text)
    
    # 1. AI Interpretation (Groq)
    analysis = interpret_dream_groq(clean_text)
    if not analysis:
        analysis = local_fallback(clean_text)

    # 2. Math Stats
    stats = calculate_similarity(clean_text, all_previous_dreams)

    return {
        "interpretation": analysis, 
        "resonance": {
            "percentage": stats['percentage'],
            "label": stats['label']
        },
        "similarity": {
            "similar_count": stats['count']
        }
    }