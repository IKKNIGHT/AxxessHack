import sounddevice as sd
import numpy as np

RATE = 16000
CHANNELS = 1
CHUNK_DURATION = 0.5
SILENCE_THRESHOLD = 0.01
MAX_SILENCE = 1.5

def record_until_silence():
    print("🎤 Listening...")
    chunks = []
    silent_chunks = 0
    max_silent_chunks = int(MAX_SILENCE / CHUNK_DURATION)
    has_speech = False

    while True:
        chunk = sd.rec(int(CHUNK_DURATION * RATE), samplerate=RATE,
                       channels=CHANNELS, dtype='float32')
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
    return np.concatenate(chunks) if chunks else np.array([])