import axios from 'axios';
import { logInfo, logError } from '../../utils/logger';
import { AppConfig } from '../../config/config';

export interface IntentDetectionResult {
  intent: string;
  confidence: number;
  explanation: string;
}

export async function detectIntent(text: string): Promise<IntentDetectionResult> {
  if (AppConfig.USE_MOCK_SERVICE) {
    logInfo('🧪 Mock intent detection used.', { text });
    return {
      intent: 'CreateShipment',
      confidence: 98,
      explanation: 'Mock intent for testing'
    };
  }

  try {
    const response = await axios.post(AppConfig.INTENT_DETECTOR_URL, { text });

    const result: IntentDetectionResult = {
      intent: response.data.intent || 'Unknown',
      confidence: response.data.confidence || 0,
      explanation: response.data.explanation || ''
    };

    logInfo('✅ Intent detected', result);
    return result;
  } catch (err: any) {
    logError('❌ Intent detection failed', { text, error: err.message });

    return {
      intent: 'Unknown',
      confidence: 0,
      explanation: 'Intent detection error'
    };
  }
}
