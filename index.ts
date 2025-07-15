import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { adapter } from './bot/adapter';
import { bot } from './bot/bot';
import { registerConverseRoute } from './routes/converseRoute';
import { initializeCosmosDb } from './utils/initCosmos'; // 👈 Import init

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// 🌐 Allow CORS for mobile/web clients
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id');
  next();
});

// 🤖 Bot endpoint
app.post('/api/messages', async (req, res) => {
  await adapter.process(req, res, async (context) => {
    await bot.run(context);
  });
});

// 🎤 Voice/Text unified
registerConverseRoute(app, upload);

// 🩺 Optional health check
app.get('/api/health', (_, res) => {
  res.send({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT ?? 3978;

(async () => {
  try {
    await initializeCosmosDb(); // 👈 Ensure Cosmos DB before bot starts
    app.listen(PORT, () => console.log(`🚀 Bot running on port ${PORT}`));
  } catch (e) {
    console.error('❌ App failed to start due to Cosmos DB error');
    process.exit(1);
  }
})();