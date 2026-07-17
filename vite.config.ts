import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In-memory store for local development testing
const localMcqDb = new Map();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Mock POST /api/mcq
          if (req.url === '/api/mcq' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                if (!Array.isArray(data)) throw new Error('Expected array');
                const slug = Math.random().toString(36).substring(2, 8);
                const id = 'mock-' + slug;
                localMcqDb.set(slug, data);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ slug, id, success: true }));
              } catch (e: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: e.message }));
              }
            });
            return;
          }
          
          // Mock GET /api/mcq/:slug
          if (req.url?.startsWith('/api/mcq/') && req.method === 'GET') {
            const slug = req.url.split('/').pop();
            if (slug && localMcqDb.has(slug)) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(localMcqDb.get(slug)));
            } else {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Test not found' }));
            }
            return;
          }
          
          next();
        });
      }
    }
  ],
})
