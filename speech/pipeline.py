import sounddevice as sd
import numpy as np
import platform

RATE = 16000
CHANNELS = 1
CHUNK_DURATION = 0.5
SILENCE_THRESHOLD = 0.01
MAX_SILENCE = 1.5

# Get the right device for the OS
def get_audio_device():
    """Select appropriate audio device for Windows"""
    system = platform.system()
    if system == "Windows":
        # Try WASAPI device first (more reliable on Windows)
        devices = sd.query_devices()
        for i, device in enumerate(devices):
            if "WASAPI" in str(device) and device.get("max_input_channels", 0) > 0:
                print(f"📍 Using Windows WASAPI device: {device['name']}")
                return i
        # Fallback to first available input device
        for i, device in enumerate(devices):
            if device.get("max_input_channels", 0) > 0:
                print(f"📍 Using device: {device['name']}")
                return i
    return None  # macOS/Linux auto-select

def record_until_silence():
    print("🎤 Listening...")
    chunks = []
    silent_chunks = 0
    max_silent_chunks = int(MAX_SILENCE / CHUNK_DURATION)
    has_speech = False
    device = get_audio_device()

    while True:
        chunk = sd.rec(int(CHUNK_DURATION * RATE), samplerate=RATE,
                       channels=CHANNELS, dtype='float32', device=device)
        sd.wait()
        chunk = chunk.flatten()
        rms = np.sqrt(np.mean(chunk**2))

        if rms > SILENCE_THRESHOLD:
            has_speech = True
            silent_chunks = 0
            chunks.append(chunk)
        elif has_speech:
            chunks.append(chunk)
            silent_chunks += 1
            if silent_chunks >= max_silent_chunks:
                break

    print("✅ Got it, thinking...")
    audio_data = np.concatenate(chunks) if chunks else np.array([])
    
    # Debug: show audio stats
    if len(audio_data) > 0:
        rms_val = np.sqrt(np.mean(audio_data**2))
        duration = len(audio_data) / RATE
        print(f"   📊 Audio: {duration:.2f}s, RMS: {rms_val:.4f}")
    
    return audio_data