import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { fileTypeFromFile } from 'file-type';
import { AppConfig } from '../../config/config';
import { logInfo, logError } from '../../utils/logger';

export async function convertSpeechToText(audioPath: string, userId: string): Promise<string> {
  try {
    const absolutePath = path.resolve(audioPath);

    // Dynamically detect MIME type from file content
    const fileType = await fileTypeFromFile(absolutePath);
    const mimeType = fileType?.mime || 'application/octet-stream';

    const formData = new FormData();
    formData.append('audio', fs.createReadStream(absolutePath), {
      filename: path.basename(audioPath),
      contentType: mimeType,
    });

    logInfo('🎧 Sending STT request', { userId, mimeType });

    const response = await axios.post(AppConfig.STT_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: AppConfig.STT_TIMEOUT,
    });

    let rawText = response.data?.text || '';

    // Azure style JSON response
    if (rawText.startsWith('{') && rawText.includes('DisplayText')) {
      const parsed = JSON.parse(rawText);
      rawText = parsed.DisplayText || '';
    }

    logInfo('✅ STT successful', {
      userId,
      text: rawText,
      confidence: response.data.confidence,
      duration: response.data.duration,
    });

    return rawText.trim();
  } catch (err: any) {
    logError('❌ STT failed', {
      userId,
      error: err.message,
      stack: err.stack,
    });
    return '';
  }
}
