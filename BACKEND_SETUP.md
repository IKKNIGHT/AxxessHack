# Axxess Heart Health - Backend Services Setup

## Architecture

Your backend consists of **two independent services**:

### 1. **CVD Prediction API** (Python/Flask)
- **Port:** 5001
- **Purpose:** Predicts 10-year cardiovascular disease risk using the Framingham model
- **File:** `main.py`
- **Endpoint:** `POST /api/predict`

### 2. **LLM Feedback Service** (Node.js/Express)
- **Port:** 5000
- **Purpose:** Generates personalized lifestyle recommendations using LLM (OpenRouter)
- **File:** `llm.js`
- **Endpoint:** `POST /api/generate-feedback`

---

## Running the Services

### **Option 1: Windows PowerShell (Recommended)**
```powershell
.\start-services.ps1
```
This will open both services in separate terminal windows.

### **Option 2: Manual Setup (Windows)**

**Terminal 1 - CVD API:**
```bash
python main.py
# Runs on http://localhost:5001
```

**Terminal 2 - LLM Service:**
```bash
node llm.js
# Runs on http://localhost:5000
```

### **Option 3: Manual Setup (macOS/Linux)**
```bash
# Terminal 1
python main.py &

# Terminal 2
node llm.js &
```

Or use the provided shell script:
```bash
bash start-services.sh
```

---

## Frontend Integration

The frontend automatically calls both services:

1. **User submits health data** → `HealthAssessment.tsx`
2. **CVD API called** → Calculates risk percentage from Flask on port 5001
3. **LLM Service called** → Generates personalized recommendations from Node.js on port 5000
4. **Results saved** → Assessment stored in localStorage with both predictions
5. **Dashboard shows** → Combined results with AI-powered recommendations

### API Endpoints Called:
- `http://localhost:5001/api/predict` - CVD risk calculation
- `http://localhost:5000/api/generate-feedback` - LLM recommendations

---

## Environment Variables

### LLM Service (.env)
```
OPENROUTER_API_KEY=your_api_key_here
```

---

## Service Health Check

**CVD API:**
```bash
curl -X POST http://localhost:5001/api/predict \
  -H "Content-Type: application/json" \
  -d '{"AGE": 45, "SEX": 1, "TOTCHOL": 200, ...}'
```

**LLM Service:**
```bash
curl -X POST http://localhost:5000/api/generate-feedback \
  -H "Content-Type: application/json" \
  -d '{"bio": "Patient profile: Age 45, BP 120/80..."}'
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Kill the process: `lsof -i :5000` or `lsof -i :5001` |
| LLM service fails | Check `OPENROUTER_API_KEY` in .env file |
| CVD prediction fails | Ensure model files exist: `framingham_rf_model.pkl` and `feature_names.pkl` |
| Services not connecting | Verify both are running and accessible from `http://localhost:PORT` |

---

## Notes

- Both services run independently and can be stopped/started separately
- The frontend gracefully handles if LLM service is unavailable (shows hardcoded recommendations)
- Never run both services on the same port
- Logs will show in their respective terminal windows
