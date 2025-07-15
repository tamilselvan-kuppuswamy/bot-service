📦 Voice Logistics Bot Backend (Node.js + Express)

This backend handles both voice and text input from a React Native or browser-based app to drive a conversational logistics assistant. It uses STT (speech-to-text), TTS (text-to-speech), NLP (intent + entity detection), and business service calls.

🔧 Prerequisites

Node.js v18+

npm or yarn

Local or hosted instances of:

STT, TTS

Intent Detection

Entity Extraction

Missing Field Service

Shipment / Return / Reschedule / Tracking Services

📁 Project Structure

voice-logistics-platform/
├── config/                   # Loads .env vars into AppConfig
├── routes/                   # Express route definitions
├── services/                 # Technical + Business services
│   ├── technical/
│   ├── business/
│   └── state/
├── utils/                    # Logger and response builders
├── index.ts                  # Express entry point
└── .env                      # Environment variables

🚀 Getting Started

1. Install dependencies

npm install

2. Configure .env

# Azure Bot Credentials
MICROSOFT_APP_ID=
MICROSOFT_APP_PASSWORD=
MICROSOFT_APP_TYPE=MultiTenant

# Flags
USE_MOCK_DB=true
USE_MOCK_SERVICE=true

# Cosmos DB (optional)
COSMOS_DB_ENDPOINT=
COSMOS_DB_KEY=
COSMOS_DB_DATABASE=BotDatabase
COSMOS_DB_CONTAINER=BotState

# Technical Services
TTS_URL=http://localhost:5005/speak
STT_URL=http://localhost:5001/transcribe
INTENT_DETECTOR_URL=http://localhost:5002/detect
ENTITY_EXTRACTOR_URL=http://localhost:5003/extract
MISSING_FIELD_URL=http://localhost:5004/check

# Business Services
SHIPMENT_SERVICE_URL=http://localhost:6001/api/shipments
TRACK_SERVICE_URL=http://localhost:6002/api/track
RETURN_SERVICE_URL=http://localhost:6005/api/returns
RESCHEDULE_SERVICE_URL=http://localhost:6006/api/reschedule
ISSUE_SERVICE_URL=http://localhost:6007/api/issues

# Timeout
STT_TIMEOUT=5000

3. Build and Start

npm run build && npm start

Server runs at http://localhost:3978

🧠 API: POST /api/converse

Headers

x-user-id: test-user
Content-Type: multipart/form-data | application/json

Voice Input (React Native)

POST /api/converse
FormData:
  audio: recorded_audio.m4a

Text Input

POST /api/converse
{
  "text": "I want to ship a package to New York"
}

Response

{
  "text": "Your shipment is confirmed!",
  "audioUrl": "http://..." // OR sent as multipart audio/mp3
}

📲 Integration with React Native

Record voice using react-native-audio-recorder-player

Send audio in FormData

For fallback, send typed text

Set x-user-id in headers

Receive audio as:

audio/mpeg binary

or audioUrl

🚨 Logging

All logs are written with userId, intent, entities

Logger defined in utils/logger.ts

Example:

logInfo('TTS synthesis complete', { userId, text });

🎓 Testing

Use Postman:

Set header: x-user-id: test-user

Use form-data tab for audio file

Or use raw tab with JSON text body

📌 Notes

Only mobile (React Native) is supported for audio

Audio output is returned as mp3

All AI/ML services are loosely coupled

Easily swappable with Azure/OpenAI endpoints

💼 Maintained for Hackathon Use

Modular

Cloud-ready

Realistic bot backend for logistics voice assistants