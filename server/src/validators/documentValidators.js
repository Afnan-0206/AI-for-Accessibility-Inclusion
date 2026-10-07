const { z } = require('zod');

const languageSchema = z.enum(['en', 'hi', 'kn'], {
  errorMap: () => ({ message: 'Language must be one of: en, hi, kn.' })
});

const uploadDocumentBodySchema = z.object({
  language: languageSchema
});

const askQuestionSchema = z.object({
  question: z
    .string({ required_error: 'Question is required.' })
    .trim()
    .min(1, 'Question cannot be empty.')
    .max(1000, 'Question cannot exceed 1000 characters.'),
  language: languageSchema
});

const documentIdSchema = z
  .string({ required_error: 'Document ID is required.' })
  .uuid('Invalid document ID format.');

module.exports = {
  languageSchema,
  uploadDocumentBodySchema,
  askQuestionSchema,
  documentIdSchema
};
