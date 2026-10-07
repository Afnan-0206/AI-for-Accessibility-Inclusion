const dotenv = require('dotenv');

// 1. Load environment variables
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { getSupabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// 2. Create Express application
const app = express();

// 3. Security headers with Helmet (allow cross-origin requests from frontend)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// 4. Configure CORS for production and development
const rawClientOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const allowedOrigins = Array.from(new Set([...rawClientOrigins, ...defaultOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, Postman, health checks)
      if (!origin) {
        return callback(null, true);
      }

      // Check explicit allowed origins or wildcard
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Automatically allow Vercel previews and production deployments (*.vercel.app)
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Allow local development ports
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Permissive fallback to prevent CORS lockouts in production
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
  })
);

// 5. Enable JSON & URL-encoded parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });
}

// 7. Base API and Health check routes (for Render, uptime monitors, and diagnostics)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Samajh Backend API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      documents: '/api/documents'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// 8. 404 handler
app.use(notFound);

// 9. Centralized error handling
app.use(errorHandler);

// 10. Start server
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

let server;
if (process.env.NODE_ENV !== 'test') {
  const supabase = getSupabase();
  if (supabase) {
    console.log('✅ Supabase Client initialized.');
  } else {
    console.warn('⚠️ Supabase credentials not configured in environment variables.');
  }

  server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Samajh Backend Server running on http://${HOST}:${PORT}`);
  });

  // Graceful shutdown for container platforms (Render, Docker, Kubernetes)
  const shutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Gracefully closing HTTP server...`);
    server.close(() => {
      console.log('✅ HTTP server closed. Process exiting.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = app;
