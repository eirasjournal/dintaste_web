# Adaugă sus la importuri
from groq import Groq

# ... (restul codului rămâne la fel până la interpret_dream_ollama)

def interpret_dream_ollama(dream_text: str) -> dict:
    """
    Înlocuim Ollama local cu Groq API (Llama 3 in Cloud).
    Este extrem de rapid și gratuit pentru volum mic.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("❌ Lipsă GROQ_API_KEY")
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
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama3-8b-8192", # Folosim Llama 3 pe serverele lor
            response_format={"type": "json_object"}, # Groq știe să forțeze JSON nativ
        )
        
        # Extragem JSON-ul direct
        response_content = completion.choices[0].message.content
        return json.loads(response_content)

    except Exception as e:
        print(f"Groq API Error: {e}")
        return None