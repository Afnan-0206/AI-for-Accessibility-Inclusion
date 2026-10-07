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

// 3. Security headers with Helmet
app.use(helmet());

// 4. Configure CORS
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? [process.env.CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173']
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching origins
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/hackathon to prevent CORS lockouts
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 5. Enable JSON & URL-encoded parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

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

// 7. Base API routes
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

if (process.env.NODE_ENV !== 'test') {
  const supabase = getSupabase();
  if (supabase) {
    console.log('✅ Supabase Client initialized.');
  } else {
    console.warn('⚠️ Supabase credentials not configured in environment variables.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Samajh Backend Server running on port ${PORT}`);
  });
}

module.exports = app;
