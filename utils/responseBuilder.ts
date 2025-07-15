import { Response } from 'express';

export function sendMultipartResponse(res: Response, text: string, audio: string | Buffer) {
  if (typeof audio === 'string') {
    return res.json({ text, audioUrl: audio });
  }

  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  res.setHeader('Content-Type', `multipart/form-data; boundary=${boundary}`);

  const body =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="text"\r\n\r\n${text}\r\n` +
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="audio"; filename="audio.mp3"\r\n` +
    `Content-Type: audio/mpeg\r\n\r\n`;

  const end = `\r\n--${boundary}--`;

  res.write(body);
  res.write(audio);
  res.end(end);
}