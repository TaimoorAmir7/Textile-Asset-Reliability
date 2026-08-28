import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { Mistral } from '@mistralai/mistralai';
import { alerts, apparelLines, assets, cases, liveColorBatch, shadeBatches, templates, visionRoll, workOrders } from '../src/domain/data.js';

const app = express();
const production = process.argv.includes('--production');
const port = Number(process.env.PORT) || 5173;
const host = process.env.HOST || '127.0.0.1';
const model = process.env.MISTRAL_MODEL || 'mistral-small-latest';
const directory = path.dirname(fileURLToPath(import.meta.url));
const requestLog = new Map();

app.disable('x-powered-by');
app.use(express.json({ limit: '24kb' }));
app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Request body must be valid JSON.' });
  }
  next(error);
});

function rateLimit(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || 'local';
  const now = Date.now();
  const recent = (requestLog.get(key) || []).filter(time => now - time < 60_000);
  if (recent.length >= 20) return res.status(429).json({ error: 'Chat rate limit reached. Please wait a moment.' });
  recent.push(now);
  requestLog.set(key, recent);
  next();
}

function cleanText(value, max = 1200) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';
}

function normalizeContent(content) {
  if (typeof content === 'string') return content.trim();
  if (!Array.isArray(content)) return '';
  return content.map(part => typeof part === 'string' ? part : part?.text || '').join('').trim();
}

const platformContext = {
  assets: assets.map(({ id, name, area, health, risk, status, alerts: alertCount, signal, latest, owner }) => ({ id, name, area, health, risk, status, alertCount, signal, latest, owner })),
  alerts: alerts.map(({ id, assetId, title, severity, status, score, evidence }) => ({ id, assetId, title, severity, status, score, evidence })),
  cases,
  workOrders,
  shadeBatches,
  liveColorBatch,
  apparelLines,
  visionRoll,
  templates: templates.map(({ id, name, process, signals, failureModes }) => ({ id, name, process, signals, failureModes })),
};

function systemPrompt(pageContext) {
  return `You are the Spark Technologies Assistant, embedded in a textile operations and asset-reliability platform. Give concise, operationally useful answers in plain language. Use only the supplied operating context for factual claims. Never invent measurements, people, work orders, alarms, or completed actions. If asked to change data, explain what the operator should do in the UI; you cannot make the change yourself. Reliability and shade quality are separate workflows. Prefer 2-4 short paragraphs or a compact list. The operator is viewing ${pageContext.route || '/'} and the active operating profile is ${pageContext.scenario || 'default'}.

CURRENT OPERATING CONTEXT:
${JSON.stringify({ ...platformContext, currentState: pageContext }, null, 2)}`;
}

app.get('/api/chat/status', (_req, res) => {
  res.json({ configured: Boolean(process.env.MISTRAL_API_KEY), model });
});

app.post('/api/chat', rateLimit, async (req, res) => {
  if (!process.env.MISTRAL_API_KEY) {
    return res.status(503).json({ error: 'Mistral is not configured. Add MISTRAL_API_KEY to the local .env file.' });
  }

  const message = cleanText(req.body?.message);
  if (!message) return res.status(400).json({ error: 'A message is required.' });

  const pageContext = {
    route: cleanText(req.body?.context?.route, 160),
    scenario: cleanText(req.body?.context?.scenario, 60),
    liveAssets: Array.isArray(req.body?.context?.assets) ? req.body.context.assets.slice(0, 12) : [],
    shadeTolerance: Number.isFinite(req.body?.context?.shadeTolerance) ? req.body.context.shadeTolerance : undefined,
    liveBatches: Array.isArray(req.body?.context?.batches) ? req.body.context.batches.slice(0, 12) : [],
  };
  const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8).map(item => ({
    role: item?.role === 'assistant' ? 'assistant' : 'user',
    content: cleanText(item?.text, 1200),
  })).filter(item => item.content) : [];

  try {
    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
    const response = await client.chat.complete({
      model,
      temperature: 0.2,
      maxTokens: 550,
      messages: [
        { role: 'system', content: systemPrompt(pageContext) },
        ...history,
        { role: 'user', content: message },
      ],
    }, { timeoutMs: 18_000 });

    const answer = normalizeContent(response.choices?.[0]?.message?.content);
    if (!answer) throw new Error('Mistral returned an empty response.');
    res.json({ answer, model });
  } catch (error) {
    console.error('Mistral chat request failed:', error?.message || error);
    res.status(502).json({ error: 'The AI service is temporarily unavailable. The built-in operations guide will continue to work.' });
  }
});

if (production) {
  const dist = path.resolve(directory, '..', 'dist');
  app.use(express.static(dist));
  app.use((req, res, next) => req.method === 'GET' && req.accepts('html')
    ? res.sendFile(path.join(dist, 'index.html'))
    : next());
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}

app.listen(port, host, () => {
  console.log(`Spark Technologies platform running at http://${host}:${port}`);
  console.log(process.env.MISTRAL_API_KEY ? `Mistral enabled (${model})` : 'Mistral key missing; deterministic assistant fallback enabled');
});
