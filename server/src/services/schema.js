import { z } from 'zod';

export const actionStepSchema = z.object({
  step: z.string(),
  deadline: z.string().nullable().optional().default(null),
});

export const deadlineItemSchema = z.object({
  label: z.string(),
  date: z.string(),
});

export const amountItemSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const documentAnalysisSchema = z.object({
  documentType: z.string(),
  title: z.string(),
  summary: z.string(),
  urgency: z.enum(['high', 'medium', 'low']),
  actions: z.array(actionStepSchema).default([]),
  deadlines: z.array(deadlineItemSchema).default([]),
  documentsNeeded: z.array(z.string()).default([]),
  amounts: z.array(amountItemSchema).default([]),
  warnings: z.array(z.string()).default([]),
});

export class AIParsingError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'AIParsingError';
    this.code = 'AI_PARSE_FAILED';
  }
}
