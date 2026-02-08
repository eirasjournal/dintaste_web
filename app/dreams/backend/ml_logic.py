import json
import os
import bleach
import requests
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from groq import Groq

# =========================
# 1. HELPER FUNCTIONS
# =========================
def sanitize_text(text: str) -> str:
    if not text: return ""
    return bleach.clean(text, tags=[], strip=True)

# =========================
# 2. AI INTERPRETATION (GROQ - TEXT)
# =========================
def interpret_dream_groq(dream_text: str) -> dict:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("❌ EROARE: Lipsă GROQ_API_KEY")
        return None

    client = Groq(api_key=api_key)
    
    # Prompt optimizat
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
            model="llama-3.3-70b-versatile", 
            response_format={"type": "json_object"}, 
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Groq API Error: {e}")
        return None

# =========================
# 3. FALLBACK LOGIC
# =========================
def local_fallback(dream_text: str):
    return {
        "summary": "Analysis unavailable.",
        "motifs": ["System Offline"],
        "emotions": [],
        "themes": [],
        "interpretation": "Could not connect to the AI oracle.",
        "advice": "Please try again later."
    }

# =========================
# 4. SIMILARITY LOGIC (Hugging Face API - MATH)
# =========================
def get_embedding_from_api(text):
    """
    Folosește modelul BAAI/bge-small-en-v1.5 prin noul Router.
    Acest model este strict pentru 'Feature Extraction', deci nu dă eroarea 400.
    """
    hf_token = os.getenv("HF_TOKEN")
    if not hf_token:
        print("❌ Lipsă HF_TOKEN")
        return None
        
    # --- SCHIMBARE MODEL: BAAI BGE SMALL ---
    # Este un model excelent, rapid și gratuit pe HF
    api_url = "https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5"
    headers = {"Authorization": f"Bearer {hf_token}"}
    
    try:
        # TRUC: Trimitem textul ca o listă ["text"]. 
        # Asta forțează API-ul să returneze o listă de vectori.
        payload = {
            "inputs": [text], 
            "options": {"wait_for_model": True}
        }
        
        response = requests.post(api_url, headers=headers, json=payload, timeout=10)
        
        if response.status_code != 200:
            print(f"HF API Error: {response.status_code} - {response.text}")
            return None
            
        # Răspunsul va fi o listă de liste (ex: [[0.1, 0.2...]])
        # Noi vrem doar primul vector.
        data = response.json()
        
        if isinstance(data, list) and len(data) > 0:
            # Uneori API-ul returnează direct vectorul, alteori o listă de vectori.
            # Verificăm structura:
            if isinstance(data[0], list):
                return data[0] # Este [[...]]
            return data # Este [...]
            
        return None

    except Exception as e:
        print(f"Embedding Error: {e}")
        return None
        
def calculate_similarity(new_text: str, previous_dreams: list):
    """
    Logică Hibridă:
    1. Max Similarity = Cât de mult seamănă cu cel mai apropiat vis (Twin).
    2. Count = Câți oameni au visat asta (Collective).
    """
    if not previous_dreams:
        return {"percentage": 0, "count": 0, "label": "ORIGIN_POINT"}

    # 1. Vectorizare
    new_vec = get_embedding_from_api(new_text)
    if not new_vec or isinstance(new_vec, dict) and 'error' in new_vec:
        return {"percentage": 0, "count": 0, "label": "API_LIMIT"}

    # 2. Pregătire date vechi
    old_texts = []
    for d in previous_dreams:
        if hasattr(d, 'content'): old_texts.append(d.content)
        elif isinstance(d, dict): old_texts.append(d.get('content', ''))
        else: old_texts.append(str(d))

    if not old_texts:
         return {"percentage": 0, "count": 0, "label": "ORIGIN_POINT"}

    # Luăm mai multe vise pentru context (ex: ultimele 50)
    recent_texts = old_texts[-50:] 
    
    try:
        old_vecs = get_embedding_from_api(recent_texts)
        
        if not old_vecs or isinstance(old_vecs, dict) and 'error' in old_vecs:
            return {"percentage": 0, "count": 0, "label": "CALC_SKIP"}

        # Calcule matematice
        v1 = np.array(new_vec)
        v2 = np.array(old_vecs)
        
        if v1.ndim == 1: v1 = v1.reshape(1, -1)
        if v2.ndim == 1: v2 = v2.reshape(1, -1)

        scores = cosine_similarity(v1, v2)[0]
        
        # --- LOGICA HIBRIDĂ ---

        # A. INTENSITATEA (Cea mai bună potrivire unică)
        max_score = max(scores) if len(scores) > 0 else 0
        max_percentage = int(max_score * 100)

        # B. DENSITATEA (Câți oameni sunt peste pragul de 50%)
        threshold = 0.50
        matches = [s for s in scores if s > threshold]
        count = len(matches)

        # C. ETICHETAREA INTELIGENTĂ (Labeling)
        label = "UNIQUE_VISION"

        if max_percentage > 85:
            # E foarte similar cu cineva
            if count >= 3:
                label = "COLLECTIVE_ECHO"  # Similar cu mulți (Trend)
            else:
                label = "TWIN_CONNECTION"  # Similar cu unul singur (Suflet pereche)
        
        elif max_percentage > 60:
            label = "SHARED_ARCHETYPE"   # Teme comune
            
        elif max_percentage > 40:
            label = "VAGUE_RESONANCE"    # Ceva familiar, dar nu clar
            
        else:
            label = "UNIQUE_VISION"      # Nimic asemănător

        # Returnăm totul. 
        # Frontend-ul poate alege să afișeze 'max_percentage' ca scor principal.
        return {
            "percentage": max_percentage, 
            "count": count, 
            "label": label
        }

    except Exception as e:
        print(f"Math Error: {e}")
        return {"percentage": 0, "count": 0, "label": "CALC_ERROR"}

# =========================
# 5. MAIN ENTRY POINT
# =========================
def analyze_new_dream(new_dream_text: str, all_previous_dreams: list):
    clean_text = sanitize_text(new_dream_text)
    
    # 1. AI Interpretation (Groq)
    analysis = interpret_dream_groq(clean_text)
    if not analysis:
        analysis = local_fallback(clean_text)

    # 2. Math Stats (HF API)
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