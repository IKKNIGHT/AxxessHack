import os
import numpy as np
import sounddevice as sd
from elevenlabs import ElevenLabs
from dotenv import load_dotenv
load_dotenv()

client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

def speak(text):
    audio = client.text_to_speech.convert(
        voice_id="21m00Tcm4TlvDq8ikWAM",  # Rachel - always available on all accounts
        text=text,
        model_id="eleven_turbo_v2_5",
        output_format="pcm_24000"
    )
    audio_bytes = b"".join(audio)
    audio_array = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0
    sd.play(audio_array, samplerate=24000)
    sd.wait()