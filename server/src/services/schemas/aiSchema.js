import { z } from 'zod';

/**
 * Zod schema for the structured output returned by the AI document analysis.
 * Every field is required; arrays may be empty but must be present.
 */
export const analysisSchema = z.object({
  /** The kind of document detected (e.g. "Tax Notice", "KYC Letter") */
  documentType: z.string(),

  /** A short, human-readable title for the document */
  title: z.string(),

  /** Plain-language summary written at a 5th-grade reading level */
  summary: z.string(),

  /** How urgently the recipient needs to act */
  urgency: z.enum(['high', 'medium', 'low']),

  /** Concrete next steps the recipient should take */
  actions: z.array(z.string()),

  /** Any deadlines mentioned in the document */
  deadlines: z.array(z.string()),

  /** Documents or information the recipient needs to gather */
  documentsNeeded: z.array(z.string()),

  /** Monetary amounts mentioned (fees, penalties, dues, etc.) */
  amounts: z.array(z.string()),

  /**
   * Security / scam warnings. Flag OTP requests, advance-fee demands,
   * or suspicious links here. Advise the user to verify with the issuer.
   */
  warnings: z.array(z.string()),
});
