const Document = require('../models/Document');

// Gagan (AI Engineer) owns server/src/services/ai/**
// We dynamically consume analyzeDocument and answerQuestion,
// with a schema-compliant fallback when Gagan's modules are not yet loaded or API keys are absent.
let aiServiceInstance = null;

const loadAiService = async () => {
  if (aiServiceInstance) {
    return aiServiceInstance;
  }

  // Dynamically load Gagan's AI service (ES Module)
  if (process.env.GEMINI_API_KEY) {
    try {
      const mod = await import('./ai/aiService.js');
      if (typeof mod.analyzeDocument === 'function' && typeof mod.answerQuestion === 'function') {
        aiServiceInstance = mod;
        return aiServiceInstance;
      }
    } catch (err) {
      console.warn('⚠️ Could not load live AI service from ./ai/aiService.js, falling back to mock:', err.message);
    }
  }

  // Contract-compliant default interface if Gagan has not yet configured keys or during isolated tests
  aiServiceInstance = {
    analyzeDocument: async ({ buffer, mimeType, language }) => {
      const langSummary = {
        en: 'Simple explanation of the document notice.',
        hi: 'दस्तावेज़ सूचना का सरल विवरण।',
        kn: 'ದಾಖಲೆ ಸೂಚನೆಯ ಸರಳ ವಿವರಣೆ.'
      };

      return {
        documentType: 'Property Tax Notice',
        title: 'Property Tax Reminder',
        summary: langSummary[language] || langSummary.en,
        urgency: 'high',
        actions: [
          {
            step: 'Pay the tax',
            deadline: '30 October 2026'
          }
        ],
        deadlines: [
          {
            label: 'Payment deadline',
            date: '30 October 2026'
          }
        ],
        documentsNeeded: [
          'Property ID'
        ],
        amounts: [
          {
            label: 'Tax due',
            value: '₹1000'
          }
        ],
        warnings: []
      };
    },
    answerQuestion: async ({ analysis, question, language }) => {
      const docType = analysis.title || analysis.documentType || 'Official Document';
      if (language === 'hi') {
        return `${docType} के अनुसार, आपके प्रश्न "${question}" का उत्तर: कृपया उल्लिखित समय सीमा का पालन करें।`;
      }
      if (language === 'kn') {
        return `${docType} ಪ್ರಕಾರ, ನಿಮ್ಮ ಪ್ರಶ್ನೆ "${question}" ಗೆ ಉತ್ತರ: ದಯವಿಟ್ಟು ನೀಡಲಾದ ಗಡುವನ್ನು ಪಾಲಿಸಿ.`;
      }
      return `According to the ${docType}, answering your question "${question}": please follow the specified deadlines to avoid penalties.`;
    }
  };

  return aiServiceInstance;
};

const setAiService = (customService) => {
  aiServiceInstance = customService;
};

const analyzeDocument = async ({ buffer, mimeType, language }) => {
  const service = await loadAiService();
  return await service.analyzeDocument({ buffer, mimeType, language });
};

const answerQuestion = async ({ analysis, question, language }) => {
  const service = await loadAiService();
  return await service.answerQuestion({ analysis, question, language });
};

const createAndAnalyzeDocument = async ({ userId, fileName, language, buffer, mimeType }) => {
  const analysis = await analyzeDocument({
    buffer,
    mimeType,
    language
  });

  const document = await Document.create({
    userId,
    fileName,
    language,
    analysis
  });

  return document;
};

const getUserDocuments = async (userId) => {
  return await Document.findByUserId(userId);
};

const getUserDocumentById = async (documentId, userId) => {
  return await Document.findByIdAndUserId(documentId, userId);
};

const deleteUserDocument = async (documentId, userId) => {
  return await Document.deleteByIdAndUserId(documentId, userId);
};

const askDocumentQuestion = async ({ documentId, userId, question, language }) => {
  const doc = await Document.findByIdAndUserId(documentId, userId);
  if (!doc) {
    return null;
  }

  const answer = await answerQuestion({
    analysis: doc.analysis,
    question,
    language
  });

  return answer;
};

module.exports = {
  analyzeDocument,
  answerQuestion,
  setAiService,
  createAndAnalyzeDocument,
  getUserDocuments,
  getUserDocumentById,
  deleteUserDocument,
  askDocumentQuestion
};
