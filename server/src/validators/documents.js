import { z } from 'zod';

export const languageSchema = z.enum(['en', 'hi', 'kn']).default('en');

export const askQuestionSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty').max(500, 'Question cannot exceed 500 characters'),
  language: z.enum(['en', 'hi', 'kn']).default('en'),
});
