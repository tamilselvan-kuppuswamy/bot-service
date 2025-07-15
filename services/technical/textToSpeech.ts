import axios from 'axios';
import { logInfo, logError } from '../../utils/logger';
import { AppConfig } from '../../config/config';

/**
 * Converts plain text into speech using TTS service.
 * 
 * @param text - The response text to convert to audio.
 * @param returnBuffer - If true, returns raw Buffer; otherwise returns audio URL.
 */
export async function synthesizeSpeech(
  text: string,
  returnBuffer: boolean = false
): Promise<Buffer | string> {
  if (AppConfig.USE_MOCK_SERVICE) {
    logInfo('🧪 Mock TTS synthesis used', { text, returnBuffer });
    return returnBuffer ? Buffer.from('MOCK_AUDIO') : 'mock-audio-url.mp3';
  }

  try {
    const response = await axios.post(
      AppConfig.TTS_URL,
      { text },
      { responseType: returnBuffer ? 'arraybuffer' : 'json' }
    );

    const logPayload = {
      text,
      format: returnBuffer ? 'Buffer (MP3)' : 'audio URL',
      length: returnBuffer ? (response.data.byteLength || response.data.length) : undefined
    };

    logInfo('✅ TTS synthesis completed', logPayload);

    if (returnBuffer) {
      const buf = Buffer.isBuffer(response.data)
        ? response.data
        : Buffer.from(response.data);
      return buf;
    } else {
      return response.data.audioUrl as string;
    }
  } catch (err: any) {
    logError('❌ TTS synthesis failed', { text, error: err.message });
    return returnBuffer ? Buffer.from('') : '';
  }
}
