import json
import os
import bleach
import requests
import numpy as np
from datetime import datetime, timedelta  # <--- IMPORT NOU
from sklearn.metrics.pairwise import cosine_similarity
from groq import Groq
import traceback # Import necesar pentru a vedea eroarea exactă

# =========================
# 1. HELPER FUNCTIONS
# =========================
def sanitize_text(text: str) -> str:
    if not text: return ""
    return bleach.clean(text, tags=[], strip=True)

def parse_date(date_input):
    """
    Încearcă să convertească inputul (string sau datetime) în obiect datetime.
    Presupunem format ISO dacă e string.
    """
    if isinstance(date_input, datetime):
        return date_input
    if isinstance(date_input, str):
        try:
            # Încearcă formatul standard ISO (ex: "2023-10-27T10:00:00")
            return datetime.fromisoformat(date_input.replace('Z', '+00:00'))
        except ValueError:
            return datetime.now() # Fallback
    return datetime.now()

# =========================
# 2. AI INTERPRETATION (GROQ - TEXT)
# =========================
# (Această funcție rămâne neschimbată)
def interpret_dream_groq(dream_text: str) -> dict:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("❌ EROARE: Lipsă GROQ_API_KEY")
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
# 4. SIMILARITY LOGIC (Hugging Face API - MATH + TIME)
# =========================
def get_embedding_from_api(text_or_list):
    hf_token = os.getenv("HF_TOKEN")
    if not hf_token:
        print("❌ Lipsă HF_TOKEN")
        return None
        
    api_url = "https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5"
    headers = {"Authorization": f"Bearer {hf_token}"}
    
    # --- FIX 1: Gestionare corectă a input-ului (List vs String) ---
    if isinstance(text_or_list, list):
        payload_inputs = text_or_list  # Trimitem lista direct, nu [lista]
    else:
        payload_inputs = [text_or_list] # Trimitem lista cu un element
    
    try:
        payload = {
            "inputs": payload_inputs, 
            "options": {"wait_for_model": True}
        }
        
        response = requests.post(api_url, headers=headers, json=payload, timeout=20) # Timeout mai mare pt batch
        
        if response.status_code != 200:
            print(f"HF API Error: {response.status_code} - {response.text}")
            return None
            
        data = response.json()
        
        # Verificăm dacă avem eroare în JSON
        if isinstance(data, dict) and 'error' in data:
            print(f"HF API Error Message: {data['error']}")
            return None

        # --- FIX 2: Gestionare corectă a output-ului ---
        # Dacă am trimis un singur string, vrem un vector 1D (listă de float).
        # Dacă am trimis o listă de string-uri, vrem o matrice (listă de liste).
        
        if isinstance(text_or_list, str):
            # API returnează de obicei [[0.1, ...]] pentru un singur input
            if isinstance(data, list) and len(data) > 0 and isinstance(data[0], list):
                return data[0] # Returnăm vectorul plat
            return data
            
        # Pentru liste multiple, returnăm tot răspunsul (lista de vectori)
        return data

    except Exception as e:
        print(f"Embedding Error: {e}")
        return None
        
def calculate_similarity(new_text: str, previous_dreams: list, current_date_obj: datetime = None):
    print(f"--- START MATH: '{new_text[:20]}...' ---")
    
    if not current_date_obj:
        current_date_obj = datetime.now()

    # 1. Verificare Istoric
    if not previous_dreams:
        print(" -> Primul vis din baza de date.")
        return {"percentage": 0, "count": 0, "label": "ORIGIN_POINT", "days_diff_best_match": 999, "temporal_matches": 0}

    # 2. Vectorizare Text NOU
    new_vec = get_embedding_from_api(new_text)
    if not new_vec:
        print(" -> Eroare API Vectorizare (Nou).")
        return {"percentage": 0, "count": 0, "label": "API_LIMIT"}

    # 3. Pregătire Date VECHI
    recent_dreams = previous_dreams[-100:] 
    old_data = []

    for d in recent_dreams:
        content = ""
        if hasattr(d, 'content'): content = d.content
        elif isinstance(d, dict): content = d.get('content', '')
        
        raw_date = None
        if hasattr(d, 'date_occurred'): raw_date = d.date_occurred
        elif isinstance(d, dict): raw_date = d.get('date_occurred')
        
        # Parsare simplificată a datei
        try:
            if isinstance(raw_date, str):
                parsed_date = parse_date(raw_date) # Folosim helper-ul tău
            elif isinstance(raw_date, datetime):
                parsed_date = raw_date
            elif hasattr(raw_date, 'date'): # date object
                 parsed_date = datetime(raw_date.year, raw_date.month, raw_date.day)
            else:
                parsed_date = datetime.now()
        except:
            parsed_date = datetime.now()

        if content and len(content) > 1:
            old_data.append({
                "text": content,
                "date": parsed_date
            })

    if not old_data:
         return {"percentage": 0, "count": 0, "label": "ORIGIN_POINT"}

    old_texts = [x['text'] for x in old_data]
    print(f" -> Comparăm cu {len(old_texts)} vise anterioare.")

    try:
        # 4. Vectorizare Date VECHI (Batch Request)
        old_vecs = get_embedding_from_api(old_texts)
        
        if not old_vecs or not isinstance(old_vecs, list):
            print(" -> Eroare API Vectorizare (Vechi) sau format incorect.")
            return {"percentage": 0, "count": 0, "label": "CALC_SKIP"}

        # 5. MATEMATICĂ & RESHAPE
        v1 = np.array(new_vec)
        v2 = np.array(old_vecs) # Aici ar trebui să fie matrice (N, 384)
        
        # Corecții dimensiuni pentru Scikit-Learn
        if v1.ndim == 1: 
            v1 = v1.reshape(1, -1)
            
        # Corecție Critică: Dacă v2 a ieșit 1D (un singur vis vechi), îl facem 2D
        if v2.ndim == 1: 
            v2 = v2.reshape(1, -1)

        print(f" -> Dimensiuni Vectori: New={v1.shape}, Old={v2.shape}")

        # Dacă dimensiunile nu se potrivesc (de ex. old_vecs a eșuat parțial), oprim
        if v1.shape[1] != v2.shape[1]:
            print(f"❌ Mismatch dimensiuni vectori: {v1.shape[1]} vs {v2.shape[1]}")
            return {"percentage": 0, "count": 0, "label": "DIM_ERROR"}

        # Calcul Cosine Similarity
        scores = cosine_similarity(v1, v2)[0]
        
        # --- LOGICA DE SCORING ---
        raw_max_score = float(max(scores))
        print(f" -> Scor Maxim Brut: {raw_max_score}")

        # Calibrare
        NOISE_FLOOR = 0.60
        
        if raw_max_score < NOISE_FLOOR:
            max_percentage = 0
            # Scalăm doar pentru afișare dacă e foarte mic, dar procentul efectiv e 0
        else:
            # Scalare de la 0.60 la 1.00 -> 0% la 100%
            adjusted_score = (raw_max_score - NOISE_FLOOR) / (1.0 - NOISE_FLOOR)
            max_percentage = int(adjusted_score * 100)
            if max_percentage > 100: max_percentage = 100

        # ==========================================
        # ⬇️ BLOCUL LIPSĂ (Adaugă-l aici) ⬇️
        # ==========================================
        
        # 1. Găsim indexul celui mai bun match (chiar dacă e visul curent)
        best_match_idx = int(np.argmax(scores))
        
        # 2. Inițializăm days_diff cu o valoare mare (default)
        days_diff = 999 
        
        # 3. Calculăm diferența reală de zile
        if best_match_idx < len(old_data):
            best_date = old_data[best_match_idx]['date']
            
            # Asigurăm compatibilitatea tipurilor de dată
            if isinstance(best_date, str):
                 try:
                    best_date = datetime.fromisoformat(best_date)
                 except:
                    pass
            
            # Calcul diferență
            if isinstance(current_date_obj, datetime) and isinstance(best_date, datetime):
                days_diff = abs((current_date_obj - best_date).days)
            elif hasattr(current_date_obj, 'date') and hasattr(best_date, 'date'):
                 days_diff = abs((current_date_obj.date() - best_date.date()).days)
        
        print(f" -> Diferență Zile (Best Match): {days_diff}")
        
        # ==========================================
        # ⬆️ GATA BLOCUL LIPSĂ ⬆️
        # ==========================================

        # Găsim indexul celui mai bun match
        best_match_idx = int(np.argmax(scores))
        
        # --- DEBUG & NUMĂRARE DUALĂ ---
        count = 0        # Numărătoare largă (> 45%) - Pentru afișare Frontend (Archetypes)
        strict_count = 0 # Numărătoare strictă (> 82%) - Pentru logica de Twin/Sync
        temporal_matches = 0
        
        # Praguri
        BROAD_THRESHOLD = 0.45   # Prag pentru Arhetipuri
        STRICT_THRESHOLD = 0.82  # Prag pentru Identice

        print(f"\n--- ANALIZĂ DETALIATĂ ---")

        for idx, score in enumerate(scores):
            # 1. Calculăm COUNT (Pentru afișare - include și arhetipurile)
            if score > BROAD_THRESHOLD:
                count += 1
            
            # 2. Calculăm STRICT_COUNT (Pentru logica de etichetare)
            if score > STRICT_THRESHOLD:
                strict_count += 1
                
                # Debug doar pentru cele stricte
                match_text = old_data[idx]['text']
                match_date = old_data[idx]['date']
                print(f"   [STRICT MATCH #{strict_count}] Scor: {score:.4f} | Data: {match_date}")

                # Verificăm sincronicitatea (timp)
                if isinstance(match_date, datetime):
                     delta = abs((current_date_obj - match_date).days)
                     if delta <= 2: 
                         temporal_matches += 1
        
        print(f"--- TOTAL BROAD: {count} | TOTAL STRICT: {strict_count} ---\n")

        # --- LOGICA ETICHETELOR FINALĂ (Folosim strict_count pentru decizii majore) ---
        label = "UNIQUE_VISION"

        # CAZ 1: IDENTIC SAU EXTREM DE SIMILAR (> 95%)
        if max_percentage >= 95:
             # Folosim STRICT_COUNT aici pentru a nu activa Synchronicity la vise vagi
             if strict_count >= 2:
                 label = "SYNCHRONICITY" 
             else:
                 label = "TWIN_CONNECTION"

        # CAZ 2: SINCRONICITATE TEMPORALĂ
        elif max_percentage > 85 and days_diff <= 2:
             label = "SYNCHRONICITY" 

        # CAZ 3: REZONANȚĂ PUTERNICĂ
        elif max_percentage > 80:
             # Folosim STRICT_COUNT pentru a garanta calitatea ecoului
             if strict_count >= 3:
                label = "COLLECTIVE_ECHO"
             else:
                label = "COLLECTIVE_ECHO" # Putem lăsa Echo și la 1-2 matches dacă scorul e mare

        # CAZ 4: ARHETIPURI (Aici e modificarea importantă)
        elif max_percentage > 45:
            label = "SHARED_ARCHETYPE"
            # Aici Frontend-ul va primi variabila 'count' (care e > 0), deci va afișa corect.

        # CAZ 5: VAG
        elif max_percentage > 15:
            label = "VAGUE_RESONANCE"

        # DEFAULT
        else:
            label = "UNIQUE_VISION"
            count = 0 # Forțăm 0 dacă e unic

        print(f" -> REZULTAT FINAL: {max_percentage}% | {label} | Count Afișat: {count}")

        return {
            "percentage": max_percentage, 
            "count": count, # Returnăm numărătoarea largă pentru Frontend
            "label": label,
            "days_diff_best_match": days_diff,
            "temporal_matches": temporal_matches
        }

    except Exception as e:
        print("❌ CRITICAL ERROR IN MATH LOGIC:")
        traceback.print_exc()
        return {"percentage": 0, "count": 0, "label": "CALC_ERROR"}

# =========================
# 5. MAIN ENTRY POINT
# =========================
def analyze_new_dream(new_dream_text: str, all_previous_dreams: list, current_date_str: str = None):
    """
    Main entry point.
    Optional: 'current_date_str' poate fi data visului curent (dacă e din jurnal vechi).
    Dacă e None, se folosește data de azi.
    """
    clean_text = sanitize_text(new_dream_text)
    
    # Parsăm data curentă
    if current_date_str:
        current_date = parse_date(current_date_str)
    else:
        current_date = datetime.now()

    # 1. AI Interpretation (Groq)
    analysis = interpret_dream_groq(clean_text)
    if not analysis:
        analysis = local_fallback(clean_text)

    # 2. Math Stats (HF API + Time Logic)
    stats = calculate_similarity(clean_text, all_previous_dreams, current_date)

    return {
        "interpretation": analysis, 
        "resonance": {
            "percentage": stats.get('percentage', 0),
            "label": stats.get('label', 'UNKNOWN'),
            "is_sync": stats.get('days_diff_best_match', 999) <= 2  # Flag simplu pentru frontend
        },
        "similarity": {
            "similar_count": stats.get('count', 0),
            "temporal_matches": stats.get('temporal_matches', 0)
        }
    }