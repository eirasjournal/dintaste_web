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
    Calculează similaritatea folosind vectori descărcați din cloud.
    """
    if not previous_dreams:
        return {"percentage": 0, "count": 0, "label": "ORIGIN_POINT"}

    # 1. Obținem vectorul pentru visul NOU
    new_vec = get_embedding_from_api(new_text)
    if not new_vec:
        return {"percentage": 0, "count": 0, "label": "API_LIMIT"}

    # 2. Obținem textele vechi
    old_texts = []
    for d in previous_dreams:
        if hasattr(d, 'content'): old_texts.append(d.content)
        elif isinstance(d, dict): old_texts.append(d.get('content', ''))
        else: old_texts.append(str(d))

    if not old_texts:
         return {"percentage": 0, "count": 0, "label": "ORIGIN_POINT"}

    # 3. Obținem vectorii pentru visele VECHI
    # NOTĂ: În producție reală, acești vectori ar trebui salvați în baza de date ca să nu-i cerem mereu.
    # Pentru acest demo, luăm doar ultimele 5 vise ca să nu blocăm API-ul gratuit.
    recent_texts = old_texts[-5:] 
    
    try:
        # HuggingFace acceptă o listă de string-uri
        old_vecs = get_embedding_from_api(recent_texts)
        
        if not old_vecs or isinstance(old_vecs, dict): # Check for error response
            return {"percentage": 0, "count": 0, "label": "CALC_SKIP"}

        # Convertim la numpy array pentru viteză
        v1 = np.array(new_vec)
        v2 = np.array(old_vecs)
        
        # Dacă dimensiunile nu se potrivesc (API error), ieșim
        if v1.ndim == 1: v1 = v1.reshape(1, -1)
        if v2.ndim == 1: v2 = v2.reshape(1, -1)

        scores = cosine_similarity(v1, v2)[0]
        
        # Statistici
        threshold = 0.50
        matches = [s for s in scores if s > threshold]
        count = len(matches)
        max_score = max(scores) if len(scores) > 0 else 0
        percentage = int(max_score * 100)

        label = "UNIQUE_VISION"
        if percentage > 80: label = "COLLECTIVE_ECHO"
        elif percentage > 50: label = "SHARED_ARCHETYPE"

        return {"percentage": percentage, "count": count, "label": label}

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