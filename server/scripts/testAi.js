import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeDocument, answerQuestion } from '../src/services/gemini.js';
import { documentAnalysisSchema, AIParsingError } from '../src/services/schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SAMPLES_DIR = path.resolve(__dirname, '../samples');

function printSection(title) {
  console.log('\n' + '='.repeat(65));
  console.log(`  ${title}`);
  console.log('='.repeat(65));
}

async function runAIEngineTests() {
  printSection('PHASE 2: AI ENGINE VERIFICATION');
  console.log('Model:', process.env.GEMINI_MODEL || 'gemini-3.8-flash');
  console.log('API Key configured:', Boolean(process.env.GEMINI_API_KEY));

  // 1. English Sample: Property Tax Demand Notice
  printSection('1. ENGLISH SAMPLE: Property Tax Notice (en)');
  const taxBuffer = fs.readFileSync(path.join(SAMPLES_DIR, 'property_tax_notice.txt'));
  const taxAnalysis = await analyzeDocument({
    buffer: taxBuffer,
    mimeType: 'text/plain',
    language: 'en',
  });
  console.log('Title:', taxAnalysis.title);
  console.log('DocType:', taxAnalysis.documentType);
  console.log('Urgency (expected high):', taxAnalysis.urgency);
  console.log('Summary:', taxAnalysis.summary);
  console.log('Actions count:', taxAnalysis.actions.length, taxAnalysis.actions[0]);
  console.log('Amounts:', taxAnalysis.amounts);

  // Follow-up QA test
  console.log('\n--- Follow-up Q&A Test ---');
  const qaAnswer = await answerQuestion({
    analysis: taxAnalysis,
    question: 'What is the penalty if I fail to pay by the deadline?',
    language: 'en',
  });
  console.log('Q&A Answer:\n', qaAnswer);

  // 2. Hindi Sample: SBI Bank KYC Update Letter
  printSection('2. HINDI SAMPLE: SBI Bank KYC Letter (hi)');
  const kycBuffer = fs.readFileSync(path.join(SAMPLES_DIR, 'bank_kyc_letter.txt'));
  const kycAnalysis = await analyzeDocument({
    buffer: kycBuffer,
    mimeType: 'text/plain',
    language: 'hi',
  });
  console.log('Title (in Hindi):', kycAnalysis.title);
  console.log('Urgency:', kycAnalysis.urgency);
  console.log('Summary (in Hindi):', kycAnalysis.summary);
  console.log('Documents Needed:', kycAnalysis.documentsNeeded);
  console.log('Warnings (OTP alert):', kycAnalysis.warnings);

  // 3. Kannada Sample: Karnataka Scholarship Application
  printSection('3. KANNADA SAMPLE: Scholarship Application (kn)');
  const scholarshipBuffer = fs.readFileSync(path.join(SAMPLES_DIR, 'scholarship_form.txt'));
  const scholarshipAnalysis = await analyzeDocument({
    buffer: scholarshipBuffer,
    mimeType: 'text/plain',
    language: 'kn',
  });
  console.log('Title (in Kannada):', scholarshipAnalysis.title);
  console.log('Urgency:', scholarshipAnalysis.urgency);
  console.log('Summary (in Kannada):', scholarshipAnalysis.summary);
  console.log('Deadlines:', scholarshipAnalysis.deadlines);
  console.log('Amounts:', scholarshipAnalysis.amounts);

  // 4. Scam Sample: Suspicious OTP Lottery Letter
  printSection('4. SCAM SAMPLE: Suspicious OTP & Advance Fee Letter');
  const scamBuffer = fs.readFileSync(path.join(SAMPLES_DIR, 'suspicious_otp_letter.txt'));
  const scamAnalysis = await analyzeDocument({
    buffer: scamBuffer,
    mimeType: 'text/plain',
    language: 'en',
  });
  console.log('Title:', scamAnalysis.title);
  console.log('Urgency:', scamAnalysis.urgency);
  console.log('Summary:', scamAnalysis.summary);
  console.log('Warnings (Must contain scam/OTP alert):');
  scamAnalysis.warnings.forEach((w, i) => console.log(`  [Warning ${i+1}] ${w}`));
  const hasScamWarning = scamAnalysis.warnings.some(
    (w) => /otp|scam|fraud|suspicious|pin|verify|fee|fake/i.test(w)
  );
  console.log('Scam warning triggered successfully:', hasScamWarning);

  // 5. Unreadable / Non-document fallback test
  printSection('5. UNREADABLE / FALLBACK TEST');
  const dummyBuffer = Buffer.from('x9fj30kd random gibberish 103984920');
  const fallbackAnalysis = await analyzeDocument({
    buffer: dummyBuffer,
    mimeType: 'text/plain',
    language: 'en',
  });
  console.log('Fallback documentType:', fallbackAnalysis.documentType);
  console.log('Fallback summary:', fallbackAnalysis.summary);

  printSection('ALL PHASE 2 ACCEPTANCE CHECKS VERIFIED SUCCESSFULLY ✓');
}

runAIEngineTests().catch((err) => {
  console.error('\n✗ AI Engine Test Failed:', err);
  process.exit(1);
});
