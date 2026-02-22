import os
import numpy as np
import sounddevice as sd
from elevenlabs import ElevenLabs
from dotenv import load_dotenv
import io
load_dotenv()

client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

def speak(text):
    """Backward-compatible: play audio on the server (keeps original behavior)."""
    audio = client.text_to_speech.convert(
        voice_id="21m00Tcm4TlvDq8ikWAM",  # Rachel
        text=text,
        model_id="eleven_turbo_v2_5",
        output_format="pcm_24000"
    )
    audio_bytes = b"".join(audio)
    audio_array = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0
    sd.play(audio_array, samplerate=24000)
    sd.wait()

def synthesize_wav_bytes(text):
    """Return WAV bytes for the given text using Rachel voice.

    Uses WAV output so the frontend can fetch and play it in-browser.
    """
    # Request WAV output (if the SDK supports a WAV output format)
    audio = client.text_to_speech.convert(
        voice_id="21m00Tcm4TlvDq8ikWAM",
        text=text,
        model_id="eleven_turbo_v2_5",
        output_format="wav"
    )
    audio_bytes = b"".join(audio)
    return audio_bytes