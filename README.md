# AxxessHack - Cardiovascular Health Assessment System

A comprehensive web application for assessing cardiovascular disease (CVD) risk using the Framingham Heart Study predictive model with AI-powered personalized recommendations and voice-enabled health assistant.

## Features

### 💊 Core Assessment
- **CVD Risk Prediction**: Uses Framingham model (Random Forest classifier) to calculate 10-year cardiovascular disease risk
- **Risk Categories**: Low, Moderate, High, and Very High risk stratification
- **AI Recommendations**: Personalized lifestyle advice powered by LLM (OpenRouter/Groq APIs)
- **Assessment History**: Track multiple assessments over time with detailed results

### 📥 Data Import
- **XML File Upload**: Import patient health data from XML files with automatic parsing
- **Flexible Field Names**: Supports multiple naming conventions (camelCase, snake_case, etc.)
- **Auto-Fill Forms**: Imported data automatically populates the health assessment form
- **Data Validation**: Real-time validation with helpful error messages

### 🎤 Voice Assistant
- **Speech Recognition**: Groq Whisper API for accurate speech-to-text
- **Conversational AI**: Groq LLM (llama-3.3-70b) for health-related Q&A
- **Text-to-Speech**: ElevenLabs for natural-sounding voice responses
- **Real-time Interaction**: Ask questions about cardiovascular health and receive spoken answers

### 🎨 User Interface
- Modern, responsive React + TypeScript frontend
- Gradient-based design with smooth animations (Framer Motion)
- Accessible UI components (shadcn/ui)
- Mobile-friendly responsive layout

## Project Structure

```
AxxessHack/
├── frontend/                    # React TypeScript application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── HealthDataForm.tsx       # Main assessment form
│   │   │   │   ├── XMLUploader.tsx          # XML import component
│   │   │   │   ├── pages/
│   │   │   │   │   ├── Dashboard.tsx        # Risk display & history
│   │   │   │   │   └── HealthAssessment.tsx # Assessment workflow
│   │   │   │   ├── types/
│   │   │   │   │   └── health.ts            # TypeScript interfaces
│   │   │   │   └── utils/
│   │   │   │       ├── api.ts               # API client functions
│   │   │   │       └── storage.ts           # Local storage utilities
│   │   │   └── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── README.md
├── main.py                      # Flask backend - CVD prediction API
├── llm.js                       # Express backend - LLM feedback service
├── train.py                     # Model training script
├── SAMPLE_PATIENT_DATA.xml      # Example XML import file
├── XML_IMPORT_GUIDE.md          # Detailed XML import documentation
└── database/
    └── Framingham Dataset.csv   # Training data
```

## Installation & Setup

### Prerequisites
- Node.js v22+ and npm v11+
- Python 3.13+
- API Keys:
  - **OPENROUTER_API_KEY**: For LLM feedback generation
  - **GROQ_API_KEY**: For speech recognition and LLM
  - **ELEVENLABS_API_KEY**: For text-to-speech

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Runs on http://localhost:3000

### Backend Setup

#### CVD Prediction API (Flask, Port 5001)
```bash
pip install -r requirements.txt
python main.py
```

#### LLM Feedback Service (Express, Port 5000)
```bash
npm install
node llm.js
```

### Environment Variables
Create a `.env` file in the root directory:
```env
# LLM Service
OPENROUTER_API_KEY=your_key_here

# Voice Assistant
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
SYSTEM_PROMPT=You are an expert cardiovascular health consultant...
ELEVENLABS_API_KEY=your_key_here

# Flask
FLASK_ENV=development
```

## Usage

### Using the Web Application

1. **Start both backend services**:
   ```bash
   # Terminal 1
   python main.py
   
   # Terminal 2 (in same directory)
   npm install
   node llm.js
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**: Open http://localhost:3000

### Manual Assessment Entry
1. Click "Heart Health Check" → "Manual Entry" tab
2. Fill in all health parameters
3. Click "Calculate Heart Risk"
4. View results and personalized recommendations

### XML File Import
1. Click "Heart Health Check" → "Import Data" tab
2. Upload your XML file (see format below)
3. Review auto-filled data
4. Switch to "Manual Entry" tab to complete any missing fields
5. Click "Calculate Heart Risk"

#### XML File Format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<PatientData>
  <age>55</age>
  <sex>1</sex>
  <totchol>240</totchol>
  <sysbp>140</sysbp>
  <diabp>90</diabp>
  <bmi>28.5</bmi>
  <hdlc>40</hdlc>
  <ldlc>150</ldlc>
  <cursmoke>0</cursmoke>
  <diabetes>0</diabetes>
  <glucose>100</glucose>
</PatientData>
```

See [XML_IMPORT_GUIDE.md](XML_IMPORT_GUIDE.md) for complete field reference and examples.

### Voice Assistant
1. Backend must be running (python main.py)
2. Speaks "🎤 Listening..." when ready
3. Speak your health question to the microphone
4. System responds conversationally about cardiovascular health

## API Endpoints

### CVD Prediction API (Flask, port 5001)
**POST** `/api/predict`
- Input: JSON with health parameters
- Output: `{status, cvd_probability_percent, risk_category}`
- Example:
  ```json
  {
    "AGE": 55,
    "SEX": 1,
    "TOTCHOL": 240,
    "SYSBP": 140,
    "DIABP": 90
  }
  ```

### LLM Feedback Service (Express, port 5000)
**POST** `/api/generate-feedback`
- Input: `{bio: "patient summary"}`
- Output: `{feedback: "personalized recommendations", source}`
- Uses OpenRouter meta-llama/llama-2-7b-chat model

## Technical Stack

### Frontend
- **React** 18+ with TypeScript
- **Routing**: React Router v7
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner Toast

### Backend
- **CVD API**: Flask with CORS support
- **LLM Service**: Express.js
- **ML Model**: scikit-learn Random Forest
- **Voice**: Groq Whisper API, ElevenLabs TTS
- **Audio Processing**: sounddevice, soundfile

### Data
- **Training**: Framingham Heart Study dataset
- **Storage**: localStorage (frontend), joblib model files
- **Format Support**: JSON, XML

## Development

### Running Tests
```bash
cd frontend
npm test
```

### Building for Production
```bash
cd frontend
npm run build
```

### Model Training
```bash
python train.py
```

## Key Health Data Fields

| Field | Type | Description |
|-------|------|-------------|
| AGE | number | Patient age in years |
| SEX | 0/1 | 1=Male, 0=Female |
| TOTCHOL | number | Total cholesterol (mg/dL) |
| SYSBP | number | Systolic blood pressure (mmHg) |
| DIABP | number | Diastolic blood pressure (mmHg) |
| BMI | number | Body Mass Index |
| CURSMOKE | 0/1 | Current smoker status |
| GLUCOSE | number | Blood glucose (mg/dL) |
| DIABETES | 0/1 | Diabetes diagnosis |
| HDLC | number | HDL cholesterol (mg/dL) |
| LDLC | number | LDL cholesterol (mg/dL) |

See [XML_IMPORT_GUIDE.md](XML_IMPORT_GUIDE.md) for complete field reference.

## Error Handling & Fallbacks

- **API Timeouts**: Set to 15s (CVD), 40s (LLM) to prevent hanging
- **Missing Data**: Falls back to rule-based recommendations
- **Network Errors**: Gracefully handles API unavailability
- **Invalid Input**: Validates and warns about invalid health data

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

**Q: Frontend won't start**
- Delete `node_modules` and `.next` folder
- Run `npm install` again
- Check Node.js version (v22+)

**Q: Backend APIs not responding**
- Verify services running on correct ports (5000, 5001)
- Check console for error messages
- Ensure API keys are set in `.env`

**Q: XML import not working**
- Validate XML syntax against schema
- Check field names match reference guide
- Review browser console for parsing errors
- Test with `SAMPLE_PATIENT_DATA.xml`

**Q: Voice assistant not working**
- Check microphone permissions
- Verify GROQ_API_KEY is set
- Check audio devices with `python test-voice.py`
- Review Python console for voice errors

## Documentation

- [XML Import Guide](XML_IMPORT_GUIDE.md) - Detailed XML file format and examples
- [Sample Patient Data](SAMPLE_PATIENT_DATA.xml) - Example XML file for testing

## License

Proprietary - AxxessHack 2024

## Support

For issues and questions, please check:
1. Browser console (F12) for frontend errors
2. Python/Node console for backend errors
3. [XML_IMPORT_GUIDE.md](XML_IMPORT_GUIDE.md) for data format issues
4. API logs from running services
