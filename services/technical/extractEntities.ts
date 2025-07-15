import axios from "axios";
import { AppConfig } from "../../config/config";
import { logError, logInfo } from "../../utils/logger";

export async function extractEntities(
  text: string,
  useCase: string
): Promise<Record<string, any>> {
  if (AppConfig.USE_MOCK_SERVICE) {
    logInfo('🧪 Mock entity extraction used', { text, useCase });
    return {
      sender_name: 'John Smith',
      sender_address: '123 Main St',
      receiver_name: 'Alice Lee',
      receiver_address: '456 Oak St',
      package_weight: '2kg',
      delivery_type: 'express'
    };
  }

  try {
    const response = await axios.post(AppConfig.ENTITY_EXTRACTOR_URL, {
      text,
      useCase
    });

    const result = response.data;

    logInfo('✅ Entities extracted', {
      useCase,
      extracted: result.extractedEntities,
      language: result.language,
      reason: result.reason
    });

    return result.extractedEntities || {};
  } catch (err: any) {
    logError('❌ Entity extraction failed', { text, useCase, error: err.message });
    return {};
  }
}
