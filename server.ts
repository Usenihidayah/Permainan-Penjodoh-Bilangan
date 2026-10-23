import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// API: Authentic Bahasa Melayu Malaysia TTS Endpoint
app.get('/api/tts', (req: Request, res: Response) => {
  const text = (req.query.text as string) || '';
  if (!text.trim()) {
    return res.status(400).json({ error: 'Text parameter is required' });
  }

  // Sanitize and limit text length for safe TTS chunking
  const cleanText = text.trim().slice(0, 300);
  const encodedText = encodeURIComponent(cleanText);

  // Google Translate TTS with exact Malaysian Malay language code (tl=ms)
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ms&client=tw-ob&q=${encodedText}`;

  const request = https.get(
    ttsUrl,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    },
    (upstreamRes) => {
      if (upstreamRes.statusCode !== 200) {
        return res
          .status(upstreamRes.statusCode || 500)
          .json({ error: 'Failed to fetch Malay TTS stream' });
      }

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache common Malay phrases
      upstreamRes.pipe(res);
    }
  );

  request.on('error', (err) => {
    console.error('TTS request error:', err);
    res.status(500).json({ error: 'Error connecting to TTS service' });
  });
});

async function startServer() {
  if (!isProd) {
    // Development mode: attach Vite dev server middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
