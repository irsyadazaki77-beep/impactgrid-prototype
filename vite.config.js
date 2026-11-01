import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { app as impactGridApiApp } from './server/proxyServer.js'

function impactGridBackendPlugin() {
  const middleware = (req, res, next) => {
    const url = req.url || '';
    if (
      url.startsWith('/api/') ||
      url === '/healthz' ||
      url === '/readyz' ||
      url === '/metrics'
    ) {
      return impactGridApiApp(req, res, next);
    }
    next();
  };

  return {
    name: 'impactgrid-backend-middleware',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    impactGridBackendPlugin(),
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const path = id.replaceAll('\\', '/');
          if (/node_modules\/(react|react-dom|scheduler|use-sync-external-store)\//.test(path)) {
            return 'vendor-react';
          }
          if (/node_modules\/three\//.test(path)) {
            return 'vendor-three';
          }
          if (/node_modules\/recharts\//.test(path)) {
            return 'vendor-recharts';
          }
        }
      }
    },
    chunkSizeWarningLimit: 750
  }
})
