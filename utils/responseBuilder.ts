import { Response } from 'express';

/**
 * Sends a response in multipart format if audio is a Buffer,
 * otherwise falls back to sending JSON with text and audioUrl.
 */
export function sendMultipartResponse(res: Response, text: string, audio: string | Buffer) {
  // ✅ Case 1: audio is a URL string → send simple JSON
  if (typeof audio === 'string') {
    return res.json({ text, audioUrl: audio });
  }

  // ✅ Case 2: audio is a Buffer → send multipart
  if (!Buffer.isBuffer(audio)) {
    return res.status(500).json({ text, error: 'Invalid audio format in response.' });
  }

  const boundary = '----Boundary' + Math.random().toString(36).substr(2, 9);
  res.setHeader('Content-Type', `multipart/form-data; boundary=${boundary}`);

  const textPart =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="text"\r\n\r\n` +
    `${text}\r\n`;

  const audioHeader =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="audio"; filename="response.mp3"\r\n` +
    `Content-Type: audio/mpeg\r\n\r\n`;

  const endBoundary = `\r\n--${boundary}--\r\n`;

  res.write(textPart);
  res.write(audioHeader);
  res.write(audio);
  res.write(endBoundary);
  res.end();
}