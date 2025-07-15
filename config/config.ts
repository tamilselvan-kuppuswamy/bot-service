// File: config/config.ts
import dotenv from 'dotenv';
dotenv.config();

export const AppConfig = {
  // Flags
  USE_MOCK_SERVICE: process.env.USE_MOCK_SERVICE === 'true',
  USE_MOCK_DB: process.env.USE_MOCK_DB === 'true',
  STT_TIMEOUT: parseInt(process.env.STT_TIMEOUT || '5000', 10),

  // Azure Bot credentials
  MICROSOFT_APP_ID: process.env.MICROSOFT_APP_ID || '',
  MICROSOFT_APP_PASSWORD: process.env.MICROSOFT_APP_PASSWORD || '',
  MICROSOFT_APP_TYPE: process.env.MICROSOFT_APP_TYPE || 'MultiTenant',

  // Cosmos DB
  COSMOS_DB_ENDPOINT: process.env.COSMOS_DB_ENDPOINT || '',
  COSMOS_DB_KEY: process.env.COSMOS_DB_KEY || '',
  COSMOS_DB_DATABASE: process.env.COSMOS_DB_DATABASE || '',
  COSMOS_DB_CONTAINER: process.env.COSMOS_DB_CONTAINER || '',

  // Technical Services
  TTS_URL: process.env.TTS_URL || '',
  STT_URL: process.env.STT_URL || '',
  INTENT_DETECTOR_URL: process.env.INTENT_DETECTOR_URL || '',
  ENTITY_EXTRACTOR_URL: process.env.ENTITY_EXTRACTOR_URL || '',
  MISSING_FIELD_URL: process.env.MISSING_FIELD_URL || '',

  // Business Services
  SHIPMENT_SERVICE_URL: process.env.SHIPMENT_SERVICE_URL || '',
  TRACK_SERVICE_URL: process.env.TRACK_SERVICE_URL || '',
  RETURN_SERVICE_URL: process.env.RETURN_SERVICE_URL || '',
  RESCHEDULE_SERVICE_URL: process.env.RESCHEDULE_SERVICE_URL || ''
};
