import axios from 'axios';
import { logInfo, logError } from '../../utils/logger';
import { AppConfig } from '../../config/config';

export interface MissingFieldResult {
  missingFields: string[];
  fieldPrompts: Record<string, string>;
  dialogAct: string;
  progress: {
    filled: number;
    total: number;
    percent: number;
  };
}

export async function checkMissingFields(
  intent: string,
  entities: Record<string, any>
): Promise<MissingFieldResult> {
  if (AppConfig.USE_MOCK_SERVICE) {
    logInfo('🧪 Mock missing field detection used', { intent, entities });
    return {
      missingFields: ['pickupDate'],
      fieldPrompts: {
        pickupDate: 'When should we pick up the shipment?'
      },
      dialogAct: 're-prompt',
      progress: {
        filled: 4,
        total: 9,
        percent: 44
      }
    };
  }

  try {
    const response = await axios.post(AppConfig.MISSING_FIELD_URL, {
      intentType: intent,
      extractedFields: entities
    });

    const result: MissingFieldResult = {
      missingFields: response.data.missingFields || [],
      fieldPrompts: response.data.fieldPrompts || {},
      dialogAct: response.data.dialogAct || 'continue',
      progress: response.data.progress || { filled: 0, total: 0, percent: 0 }
    };

    logInfo('✅ Missing fields checked', {
      intent,
      missingFields: result.missingFields,
      prompts: result.fieldPrompts,
      dialogAct: result.dialogAct,
      progress: result.progress
    });

    return result;
  } catch (err: any) {
    logError('❌ Missing field check failed', { intent, error: err.message });

    return {
      missingFields: [],
      fieldPrompts: {},
      dialogAct: 'fallback',
      progress: {
        filled: 0,
        total: 0,
        percent: 0
      }
    };
  }
}
