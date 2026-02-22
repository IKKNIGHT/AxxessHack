import tempfile, os
import numpy as np
import soundfile as sf
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client = Groq()

def transcribe(audio_array, sample_rate=16000):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        sf.write(f.name, audio_array, sample_rate)
        with open(f.name, "rb") as audio_file:
            result = client.audio.transcriptions.create(
                model="whisper-large-v3-turbo",
                file=audio_file,
                response_format="text"
            )
        os.unlink(f.name)
    return result.strip() if result else ""