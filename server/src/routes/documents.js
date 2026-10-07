import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { handleUpload } from '../middleware/upload.js';
import { aiLimiter } from '../middleware/rateLimit.js';
import { isDbConnected } from '../config/db.js';
import { Document, memoryDocumentStore } from '../models/Document.js';
import { languageSchema, askQuestionSchema } from '../validators/documents.js';
import { analyzeDocument, answerQuestion } from '../services/gemini.js';
import { AIParsingError } from '../services/schema.js';

const router = express.Router();

router.use(requireAuth);

// POST /api/documents/analyze
router.post('/analyze', aiLimiter, handleUpload, async (req, res, next) => {
  try {
    const langParse = languageSchema.safeParse(req.body.language || 'en');
    const language = langParse.success ? langParse.data : 'en';

    let analysis;
    try {
      analysis = await analyzeDocument({
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        language,
      });
    } catch (aiErr) {
      if (aiErr instanceof AIParsingError || aiErr.code === 'AI_PARSE_FAILED') {
        return res.status(422).json({
          error: 'Could not understand the document clearly. Please upload a sharper photo or clearer PDF.',
        });
      }
      console.error('[AI Service Error]:', aiErr);
      return res.status(502).json({
        error: 'The AI service is unavailable, please try again.',
      });
    }

    const docData = {
      userId: req.user.id,
      fileName: req.file.originalname,
      language,
      analysis,
    };

    let savedDoc;
    if (isDbConnected()) {
      const created = await Document.create(docData);
      savedDoc = {
        id: created._id.toString(),
        fileName: created.fileName,
        language: created.language,
        createdAt: created.createdAt,
        analysis: created.analysis,
      };
    } else {
      const created = await memoryDocumentStore.create(docData);
      savedDoc = {
        id: created.id,
        fileName: created.fileName,
        language: created.language,
        createdAt: created.createdAt,
        analysis: created.analysis,
      };
    }

    res.status(200).json({ document: savedDoc });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents
router.get('/', async (req, res, next) => {
  try {
    let docs;
    if (isDbConnected()) {
      const rawDocs = await Document.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .lean();
      docs = rawDocs.map((d) => ({
        id: d._id.toString(),
        fileName: d.fileName,
        language: d.language,
        createdAt: d.createdAt,
        title: d.analysis?.title || d.fileName,
        documentType: d.analysis?.documentType || 'Official Document',
        urgency: d.analysis?.urgency || 'low',
      }));
    } else {
      docs = await memoryDocumentStore.findByUser(req.user.id);
    }

    res.status(200).json({ documents: docs });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let doc;
    if (isDbConnected()) {
      const raw = await Document.findOne({ _id: id, userId: req.user.id }).lean();
      if (!raw) {
        return res.status(404).json({ error: 'Document not found.' });
      }
      doc = {
        id: raw._id.toString(),
        fileName: raw.fileName,
        language: raw.language,
        createdAt: raw.createdAt,
        analysis: raw.analysis,
      };
    } else {
      doc = await memoryDocumentStore.findByIdAndUser(id, req.user.id);
      if (!doc) {
        return res.status(404).json({ error: 'Document not found.' });
      }
    }

    res.status(200).json({ document: doc });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/documents/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = false;
    if (isDbConnected()) {
      const result = await Document.deleteOne({ _id: id, userId: req.user.id });
      deleted = result.deletedCount > 0;
    } else {
      deleted = await memoryDocumentStore.deleteByIdAndUser(id, req.user.id);
    }

    if (!deleted) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/documents/:id/ask
router.post('/:id/ask', aiLimiter, async (req, res, next) => {
  try {
    const { id } = req.params;
    const parseResult = askQuestionSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || parseResult.error.errors || [];
      return res.status(400).json({
        error: issues[0]?.message || 'Invalid question parameters.',
      });
    }

    const { question, language } = parseResult.data;

    let doc;
    if (isDbConnected()) {
      doc = await Document.findOne({ _id: id, userId: req.user.id }).lean();
    } else {
      doc = await memoryDocumentStore.findByIdAndUser(id, req.user.id);
    }

    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    let answer;
    try {
      answer = await answerQuestion({
        analysis: doc.analysis,
        question,
        language,
      });
    } catch (aiErr) {
      console.error('[AI QA Error]:', aiErr);
      return res.status(502).json({
        error: 'The AI service is unavailable, please try again.',
      });
    }

    res.status(200).json({ answer });
  } catch (err) {
    next(err);
  }
});

export default router;
