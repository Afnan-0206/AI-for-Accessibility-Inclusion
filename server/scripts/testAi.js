/**
 * testAi.js – End-to-end smoke test for the Samajh AI pipeline.
 *
 * Run with:
 *   GEMINI_API_KEY=<your-key> node --experimental-vm-modules server/scripts/testAi.js
 *
 * Or if the project uses a .env file:
 *   node -r dotenv/config server/scripts/testAi.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

import { analyzeDocument, answerQuestion } from '../src/services/ai/aiService.js';
import { analysisSchema } from '../src/services/schemas/aiSchema.js';
import { AIParsingError } from '../src/services/schemas/aiErrors.js';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SAMPLES_DIR = path.resolve(__dirname, '../samples');

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/** Pretty-print a section header. */
function section(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

/** Pretty-print a labelled JSON block. */
function printJson(label, obj) {
  console.log(`\n[${label}]`);
  console.log(JSON.stringify(obj, null, 2));
}

// ---------------------------------------------------------------------------
// Test 1: analyzeDocument + answerQuestion (happy path)
// ---------------------------------------------------------------------------
async function testAnalyzeAndQA() {
  section('TEST 1 – analyzeDocument (English property tax notice)');

  const filePath = path.join(SAMPLES_DIR, 'property_tax_notice.txt');
  const buffer = fs.readFileSync(filePath);

  console.log(`\nReading: ${filePath}`);
  console.log(`Buffer size: ${buffer.length} bytes`);

  // --- Step 1: Document analysis ---
  console.log('\nCalling analyzeDocument()...');
  const analysis = await analyzeDocument({
    buffer,
    mimeType: 'text/plain',
    language: 'en',
  });

  printJson('Structured Analysis Result', analysis);

  // --- Step 2: Follow-up Q&A ---
  section('TEST 2 – answerQuestion based on the analysis');
  const question = 'What happens if I do not pay?';
  console.log(`\nQuestion: "${question}"`);
  console.log('\nCalling answerQuestion()...');

  const answer = await answerQuestion({
    analysis,
    question,
    language: 'en',
  });

  console.log('\n[Answer]');
  console.log(answer);
}

// ---------------------------------------------------------------------------
// Test 3: Schema validation failure handling
// ---------------------------------------------------------------------------
async function testSchemaValidationFailure() {
  section('TEST 3 – Schema validation failure (bad data)');

  // Intentionally malformed data: urgency is invalid, actions is not an array.
  const badData = {
    documentType: 'Test Notice',
    title: 'Bad Document',
    summary: 'This data is intentionally broken.',
    urgency: 'CRITICAL',          // ← invalid enum value
    actions: 'Go to the office',  // ← should be an array
    deadlines: [],
    documentsNeeded: [],
    amounts: [],
    warnings: [],
  };

  console.log('\nAttempting to parse intentionally malformed data...');
  printJson('Bad Input', badData);

  try {
    analysisSchema.parse(badData);
    console.error('\n✗ ERROR: parse() should have thrown but did not!');
    process.exit(1);
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log('\n✓ Zod correctly rejected the invalid data.');
      console.log('\n[Zod Validation Errors]');
      const issues = err.issues || err.errors || [];
      issues.forEach((e, i) => {
        console.log(`  ${i + 1}. Path: [${(e.path || []).join('.')}] – ${e.message}`);
      });
    } else {
      throw err;
    }
  }

  // --- Verify AIParsingError can be constructed and identified ---
  console.log('\nVerifying AIParsingError construction...');
  const aiErr = new AIParsingError('Simulated retry failure', {
    cause: new Error('underlying network error'),
  });

  console.log(`  name    : ${aiErr.name}`);
  console.log(`  message : ${aiErr.message}`);
  console.log(`  cause   : ${aiErr.cause?.message}`);
  console.log(`  instanceof AIParsingError: ${aiErr instanceof AIParsingError}`);
  console.log(`  instanceof Error         : ${aiErr instanceof Error}`);
  console.log('\n✓ AIParsingError behaves correctly.');
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
async function main() {
  console.log('\n🔍 Samajh AI Pipeline – Smoke Test');
  console.log(`   Model : ${process.env.GEMINI_MODEL || 'gemini-2.5-flash'}`);
  console.log(`   API Key set: ${Boolean(process.env.GEMINI_API_KEY)}`);

  if (!process.env.GEMINI_API_KEY) {
    console.warn('\n⚠  GEMINI_API_KEY is not set. Live API tests will fail.');
    console.warn('   Running schema validation test only.\n');
    await testSchemaValidationFailure();
    return;
  }

  try {
    await testAnalyzeAndQA();
    await testSchemaValidationFailure();
    section('ALL TESTS PASSED ✓');
  } catch (err) {
    section('TEST FAILED ✗');
    if (err instanceof AIParsingError) {
      console.error('\nAIParsingError:', err.message);
      if (err.cause) console.error('  Caused by:', err.cause);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

main();
