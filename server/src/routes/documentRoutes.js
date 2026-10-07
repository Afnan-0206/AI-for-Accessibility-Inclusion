const express = require('express');
const rateLimit = require('express-rate-limit');
const { authenticate } = require('../middleware/auth');
const { uploadSingleFile } = require('../middleware/upload');
const {
  languageSchema,
  askQuestionSchema
} = require('../validators/documentValidators');
const {
  createAndAnalyzeDocument,
  getUserDocuments,
  getUserDocumentById,
  deleteUserDocument,
  askDocumentQuestion
} = require('../services/documentService');

const router = express.Router();

const analyzeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many document analyze requests, please try again later.' },
  skip: () => process.env.NODE_ENV === 'test'
});

const askRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many question requests, please try again later.' },
  skip: () => process.env.NODE_ENV === 'test'
});

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isValidUUID = (id) => typeof id === 'string' && UUID_REGEX.test(id);

// 1. POST /api/documents/analyze
router.post(
  '/analyze',
  authenticate,
  analyzeRateLimiter,
  uploadSingleFile('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Please provide a document file.' });
      }

      const langResult = languageSchema.safeParse(req.body.language);
      if (!langResult.success) {
        const errorMsg = langResult.error.errors[0]?.message || 'Language must be one of: en, hi, kn.';
        return res.status(400).json({ error: errorMsg });
      }

      const document = await createAndAnalyzeDocument({
        userId: req.user.id,
        fileName: req.file.originalname,
        language: langResult.data,
        buffer: req.file.buffer,
        mimeType: req.file.mimetype
      });

      return res.status(201).json({
        document
      });
    } catch (error) {
      next(error);
    }
  }
);

// 2. GET /api/documents
router.get('/', authenticate, async (req, res, next) => {
  try {
    const documents = await getUserDocuments(req.user.id);
    return res.status(200).json({ documents });
  } catch (error) {
    next(error);
  }
});

// 3. GET /api/documents/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const document = await getUserDocumentById(id, req.user.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    return res.status(200).json({ document });
  } catch (error) {
    next(error);
  }
});

// 4. DELETE /api/documents/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const deleted = await deleteUserDocument(id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

// 5. POST /api/documents/:id/ask
router.post('/:id/ask', authenticate, askRateLimiter, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const parseResult = askQuestionSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors[0]?.message || 'Invalid question request.';
      return res.status(400).json({ error: errorMessage });
    }

    const { question, language } = parseResult.data;

    const answer = await askDocumentQuestion({
      documentId: id,
      userId: req.user.id,
      question,
      language
    });

    if (answer === null) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    return res.status(200).json({ answer });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
