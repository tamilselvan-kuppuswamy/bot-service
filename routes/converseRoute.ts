import express from 'express';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

import { processMessage } from '../services/technical/processMessage';
import { sendMultipartResponse } from '../utils/responseBuilder';
import { logInfo, logError } from '../utils/logger';
import { AppConfig } from '../config/config';
import { convertSpeechToText } from '../services/technical/speechToText';

export function registerConverseRoute(app: express.Express, upload: any) {
  app.post('/api/converse', upload.single('audio'), async (req, res) => {
    const userId = req.headers['x-user-id']?.toString() || 'default-user';
    const conversationId = req.headers['x-conversation-id']?.toString() || `conv-${userId}`;

    logInfo('Incoming /api/converse request', {
      userId,
      conversationId,
      hasAudio: !!req.file,
      hasText: !!req.body?.text
    });

    try {
      const isAudio = req.is('multipart/form-data');
      let userText = '';

      if (isAudio && req.file) {
        const allowedTypes = ['audio/m4a', 'audio/x-m4a', 'audio/mp3', 'audio/mpeg', 'audio/wav','audio/wave'];
        if (!allowedTypes.includes(req.file.mimetype)) {
          logError('❌ Unsupported audio format', { userId, mimetype: req.file.mimetype });
          return res.status(400).send('Unsupported audio format.');
        }

        userText = await convertSpeechToText(req.file.path, userId);
      }

      if (req.body?.text) {
        userText = req.body.text;
        logInfo('Received typed text', { userId, userText });
      }

      if (!userText?.trim()) {
        const fallback = 'Sorry, I could not hear anything.';
        const { textReply, audioReply } = await processMessage(userId, fallback, conversationId);
        if (typeof audioReply === 'string') {
          return res.json({ text: textReply, audioUrl: audioReply });
        }
        return sendMultipartResponse(res, textReply, audioReply);
      }

      const { textReply, audioReply } = await processMessage(userId, userText, conversationId);
      if (typeof audioReply === 'string') {
        return res.json({ text: textReply, audioUrl: audioReply });
      }
      return sendMultipartResponse(res, textReply, audioReply);
    } catch (err: any) {
      logError('Error in /api/converse', { userId, error: err.message });
      const fallback = 'Something went wrong. Please try again later.';
      const { textReply, audioReply } = await processMessage(userId, fallback, conversationId);
      if (typeof audioReply === 'string') {
        return res.json({ text: textReply, audioUrl: audioReply });
      }
      return sendMultipartResponse(res, textReply, audioReply);
    } finally {
      if (req.file?.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) logError('Failed to delete temp file', { path: req.file?.path, error: err.message });
        });
      }
    }
  });
}
