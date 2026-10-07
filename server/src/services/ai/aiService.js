import { GoogleGenAI } from '@google/genai';
import { analysisSchema } from '../schemas/aiSchema.js';
import { AIParsingError } from '../schemas/aiErrors.js';
import {
  getAnalysisSystemPrompt,
  getQASystemPrompt,
} from '../prompts/documentPrompt.js';

// ---------------------------------------------------------------------------
// Client initialisation
// ---------------------------------------------------------------------------

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

/** Timeout duration in milliseconds for every AI call (15 seconds). */
const TIMEOUT_MS = 15_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Wraps a promise with a hard timeout.
 * Rejects with a descriptive error if the timeout fires first.
 *
 * @template T
 * @param {Promise<T>} promise
 * @param {number} ms - Timeout in milliseconds.
 * @returns {Promise<T>}
 */
function withTimeout(promise, ms = TIMEOUT_MS) {
  const timeout = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error(`AI request timed out after ${ms}ms`)),
      ms,
    ),
  );
  return Promise.race([promise, timeout]);
}

/**
 * Calls the Gemini API and attempts to parse + validate the JSON response
 * against analysisSchema.
 *
 * @param {object} params
 * @param {string} params.base64   - Base64-encoded document content.
 * @param {string} params.mimeType - MIME type of the document.
 * @param {string} params.language - Target output language code.
 * @returns {Promise<import('../schemas/aiSchema.js').analysisSchema>}
 */
async function callAnalysisModel({ base64, mimeType, language }) {
  const systemInstruction = getAnalysisSystemPrompt(language);

  const response = await withTimeout(
    ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64,
              },
            },
            {
              text: 'Analyse the document above and return the structured JSON as instructed.',
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    }),
  );

  const rawText = response.text;
  const parsed = JSON.parse(rawText);
  return analysisSchema.parse(parsed);
}

// ---------------------------------------------------------------------------
// Exported service functions
// ---------------------------------------------------------------------------

/**
 * Analyses a document buffer using the Gemini AI and returns a validated
 * structured analysis object.
 *
 * Includes one automatic retry if the first attempt produces an unparseable
 * or schema-invalid response. If the retry also fails, throws AIParsingError.
 *
 * @param {object} params
 * @param {Buffer}  params.buffer   - Raw document bytes.
 * @param {string}  params.mimeType - MIME type (e.g. 'application/pdf', 'text/plain').
 * @param {'en'|'hi'|'kn'} params.language - Output language code.
 * @returns {Promise<import('../schemas/aiSchema.js').analysisSchema._type>}
 * @throws {AIParsingError} When both attempts fail to produce a valid response.
 */
export async function analyzeDocument({ buffer, mimeType, language }) {
  const base64 = buffer.toString('base64');

  try {
    // --- First attempt ---
    return await callAnalysisModel({ base64, mimeType, language });
  } catch (firstError) {
    console.warn(
      '[aiService] First analysis attempt failed – retrying once.',
      firstError?.message ?? firstError,
    );

    try {
      // --- Single retry ---
      return await callAnalysisModel({ base64, mimeType, language });
    } catch (retryError) {
      throw new AIParsingError(
        `AI response could not be parsed or validated after retry: ${retryError?.message ?? retryError}`,
        { cause: retryError },
      );
    }
  }
}

/**
 * Answers a user's follow-up question based exclusively on a prior analysis
 * result, using the Samajh QA persona.
 *
 * @param {object} params
 * @param {object} params.analysis  - The structured analysis object produced by analyzeDocument().
 * @param {string} params.question  - The user's natural-language question.
 * @param {'en'|'hi'|'kn'} params.language - Language for the answer.
 * @returns {Promise<string>} Plain-text answer (≤ 4 sentences + disclaimer).
 */
export async function answerQuestion({ analysis, question, language }) {
  const systemInstruction = getQASystemPrompt(language);

  const context = `Here is the document analysis JSON:\n${JSON.stringify(analysis, null, 2)}`;

  const response = await withTimeout(
    ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: context },
            { text: `User question: ${question}` },
          ],
        },
      ],
      config: {
        systemInstruction,
      },
    }),
  );

  return response.text.trim();
}
