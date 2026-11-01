import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import { app } from './server/proxyServer.js';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const distPath = path.resolve(process.cwd(), 'dist');

// Serve static compiled assets in production
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { maxAge: '1h' }));

  // Fallback for Single Page Application client-side routing (Express 5 compatible)
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    const url = req.path || req.url || '';
    if (
      url.startsWith('/api') ||
      url === '/healthz' ||
      url === '/readyz' ||
      url === '/metrics'
    ) {
      return next();
    }
    return res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    const url = req.path || req.url || '';
    if (
      url.startsWith('/api') ||
      url === '/healthz' ||
      url === '/readyz' ||
      url === '/metrics'
    ) {
      return next();
    }
    return res.status(503).send('Aplikasi sedang bersiap. Silakan jalankan `npm run build` terlebih dahulu.');
  });
}

const isDirectExecution = Boolean(
  process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('server.js')
);

if (process.env.NODE_ENV !== 'test' && isDirectExecution) {
  app.listen(PORT, HOST, () => {
    console.log(`ImpactGrid full-stack server running on http://${HOST}:${PORT}`);
  });
}

export { app };
export default app;
