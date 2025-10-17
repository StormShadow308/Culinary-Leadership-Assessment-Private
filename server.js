// Custom server for Render.com compatibility
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL environment variable is required');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required');
  process.exit(1);
}

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Setup global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    const startTime = Date.now();
    
    try {
      const parsedUrl = parse(req.url, true);
      
      // Add CORS headers for API routes
      if (parsedUrl.pathname?.startsWith('/api/')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      }
      
      await handle(req, res, parsedUrl);
      
      // Log API requests in production
      if (process.env.NODE_ENV === 'production' && parsedUrl.pathname?.startsWith('/api/')) {
        const responseTime = Date.now() - startTime;
        console.log(`API ${req.method} ${parsedUrl.pathname} - ${res.statusCode} - ${responseTime}ms`);
      }
    } catch (err) {
      const responseTime = Date.now() - startTime;
      console.error('Error occurred handling', req.url, {
        error: err.message,
        stack: err.stack,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      });
      
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : err.message,
        timestamp: new Date().toISOString(),
      }));
    }
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });

  server.listen(port, hostname, () => {
    console.log(`🚀 Server ready on http://${hostname}:${port}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://${hostname}:${port}/api/health`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
