from dotenv import load_dotenv
load_dotenv()

import os
import pandas as pd
import joblib
import threading
from flask import Flask, request, render_template_string, jsonify

from speech.pipeline import record_until_silence
from speech.stt import transcribe
from speech.llm import ask, reset_conversation
from speech.tts import speak

app = Flask(__name__)

# Load model
try:
    model = joblib.load("framingham_rf_model.pkl")
    saved_features = joblib.load("feature_names.pkl")
    print("Model and features loaded into memory.")
except FileNotFoundError:
    print("Error: Pickle files not found. Run train.py first!")
    exit()

# ---------------------------------------------------------------------------
# SPEECH THREAD
# ---------------------------------------------------------------------------

def speech_loop():
    try:
        speak("Hi! I'm your heart health assistant. You can ask me about your cardiovascular risk results or heart health in general.")
    except Exception as e:
        print(f"[TTS startup error]: {e}")

    while True:
        try:
            audio = record_until_silence()
            if len(audio) == 0:
                continue

            text = transcribe(audio)
            if not text:
                continue

            print(f"Patient: {text}")

            if any(w in text.lower() for w in ["goodbye", "bye", "exit", "quit"]):
                speak("Take care, and stay heart healthy!")
                break

            if any(w in text.lower() for w in ["reset", "start over"]):
                reset_conversation()
                speak("Sure, let's start fresh. What would you like to know?")
                continue

            reply = ask(text)
            print(f"Assistant: {reply}")
            speak(reply)

        except Exception as e:
            print(f"[Speech loop error]: {e}")
            continue

# ---------------------------------------------------------------------------
# FLASK ROUTES
# ---------------------------------------------------------------------------

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Framingham CVD Predictor</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; background-color: #f0f2f5; color: #333; }
        .container { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); max-width: 600px; margin: auto; }
        h2 { color: #1a73e8; border-bottom: 2px solid #e8eaed; padding-bottom: 10px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        label { font-size: 0.9rem; font-weight: bold; display: block; margin-bottom: 5px; }
        input { width: 100%; padding: 10px; border: 1px solid #dadce0; border-radius: 6px; box-sizing: border-box; }
        button { background: #1a73e8; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; width: 100%; font-size: 1rem; margin-top: 10px; }
        button:hover { background: #1557b0; }
        .result { margin-top: 25px; padding: 20px; border-radius: 8px; background: #e8f0fe; border-left: 5px solid #1a73e8; }
    </style>
</head>
<body>
    <div class="container">
        <h2>CVD 10-Year Risk Predictor</h2>
        <form method="POST">
            <div class="form-grid">
                {% for feat in features %}
                <div>
                    <label>{{ feat }}</label>
                    <input type="number" step="any" name="{{ feat }}" required>
                </div>
                {% endfor %}
            </div>
            <button type="submit">Calculate Risk Score</button>
        </form>

        {% if probability %}
            <div class="result">
                <strong>Analysis Result:</strong>
                <p>Probability: {{ probability }}%</p>
                <h3>Risk Category: {{ risk }}</h3>
            </div>
        {% endif %}
    </div>
</body>
</html>
"""

@app.route("/", methods=["GET", "POST"])
def home():
    probability = None
    risk = None
    if request.method == "POST":
        try:
            input_dict = {feat: [float(request.form[feat])] for feat in saved_features}
            input_df = pd.DataFrame(input_dict)[saved_features]
            prob = model.predict_proba(input_df)[0][1]
            probability = round(prob * 100, 2)
            risk = "Low Risk" if probability < 10 else "Moderate Risk" if probability < 20 else "High Risk"
        except Exception as e:
            return f"<h3>Form Error: {e}</h3>"
    return render_template_string(HTML_TEMPLATE, features=saved_features, probability=probability, risk=risk)


@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    try:
        input_dict = {feat: [float(data[feat])] for feat in saved_features}
        input_df = pd.DataFrame(input_dict)[saved_features]
        prob = model.predict_proba(input_df)[0][1]
        probability_percent = round(prob * 100, 2)
        risk = "Low Risk" if probability_percent < 10 else "Moderate Risk" if probability_percent < 20 else "High Risk"
        return jsonify({
            "status": "success",
            "cvd_probability_percent": probability_percent,
            "risk_category": risk,
            "units": "10-year risk"
        })
    except KeyError as e:
        return jsonify({"status": "error", "message": f"Missing required feature: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/explain", methods=["POST"])
def explain_result():
    """Call this from your React frontend after a prediction to have the
    assistant speak the result aloud to the patient."""
    data = request.get_json()
    probability = data.get("probability")
    risk = data.get("risk")

    prompt = (
        f"The patient's 10-year cardiovascular risk score just came back as {probability}%, "
        f"which is classified as {risk}. Please explain what this means in simple, reassuring "
        f"terms and give one actionable lifestyle tip."
    )

    reply = ask(prompt)
    speak(reply)
    return jsonify({"status": "spoken", "message": reply})


# ---------------------------------------------------------------------------
# ENTRY POINT
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Start voice assistant in background thread
    speech_thread = threading.Thread(target=speech_loop, daemon=True)
    speech_thread.start()

    # Port 5001 avoids macOS AirPlay conflict on port 5000
    app.run(debug=False, port=5001, use_reloader=False)