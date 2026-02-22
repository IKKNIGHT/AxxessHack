import tempfile, os
import numpy as np
import soundfile as sf
import io
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client = Groq()

def transcribe(audio_array, sample_rate=16000):
    if len(audio_array) == 0:
        print("   ⚠️  No audio data to transcribe")
        return ""
    
    try:
        # Use BytesIO buffer instead of temp file (avoids Windows file locking)
        audio_buffer = io.BytesIO()
        sf.write(audio_buffer, audio_array, sample_rate, format='WAV')
        audio_buffer.seek(0)  # Reset to start for reading
        
        file_size = len(audio_buffer.getvalue())
        print(f"   🔄 Sending {file_size} bytes to Whisper...")
        
        result = client.audio.transcriptions.create(
            model="whisper-large-v3-turbo",
            file=("audio.wav", audio_buffer, "audio/wav"),
            response_format="text"
        )
        
        text = result.strip() if result else ""
        if text:
            print(f"   ✓ Recognized: {text}")
        else:
            print("   ⚠️  Could not understand audio - try speaking louder or closer to mic")
        return text
        
    except Exception as e:
        print(f"   ❌ Transcription error: {e}")
        return ""