import os
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client = Groq()
MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
SYSTEM_PROMPT = os.getenv("SYSTEM_PROMPT", "You are a helpful cardiovascular health assistant.")

conversation_history = [{"role": "system", "content": SYSTEM_PROMPT}]

def ask(user_text):
    conversation_history.append({"role": "user", "content": user_text})
    response = client.chat.completions.create(
        model=MODEL,
        messages=conversation_history,
        max_tokens=150
    )
    reply = response.choices[0].message.content.strip()
    conversation_history.append({"role": "assistant", "content": reply})
    return reply

def reset_conversation():
    conversation_history.clear()
    conversation_history.append({"role": "system", "content": SYSTEM_PROMPT})