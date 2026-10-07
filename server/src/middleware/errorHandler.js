const { ZodError } = require('zod');
const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Server Error:', err.message || err);
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const message = err.errors?.[0]?.message || 'Validation error.';
    return res.status(400).json({ error: message });
  }

  // Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 10 MB limit.' });
    }
    return res.status(400).json({ error: err.message || 'File upload error.' });
  }

  // File type errors from upload filter
  if (err.code === 'UNSUPPORTED_FILE_TYPE') {
    return res.status(400).json({ error: 'Unsupported file type.' });
  }

  // PostgreSQL / Supabase unique violation (23505)
  if (err.code === '23505' || err.message?.includes('duplicate key')) {
    return res.status(409).json({ error: 'Email is already registered.' });
  }

  // PostgreSQL / Supabase invalid text representation (e.g. invalid UUID)
  if (err.code === '22P02') {
    return res.status(400).json({ error: 'Invalid ID format.' });
  }

  // Explicit status code errors
  if (err.statusCode || err.status) {
    const status = err.statusCode || err.status;
    return res.status(status).json({ error: err.message || 'An error occurred.' });
  }

  // Default internal server error (never leak internal details, stack traces, paths, or secrets)
  return res.status(500).json({ error: 'Something went wrong.' });
};

module.exports = errorHandler;
