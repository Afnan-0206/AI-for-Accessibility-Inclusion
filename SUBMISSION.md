# Samajh — Hackathon Submission

**Project Name:** Samajh ("Understanding")  
**Theme:** AI for Accessibility & Inclusion  
**Target Audience:** Citizens with low literacy, elderly individuals, regional language speakers, visually/cognitively impaired people.

---

## 1. Problem Statement (Under 100 Words)
Millions of people worldwide struggle to comprehend dense bureaucratic notices, municipal tax bills, bank KYC demands, and government welfare forms. Because of complex legal jargon, small fonts, and foreign languages, vulnerable citizens frequently miss critical deadlines, suffer penalty interest, disconnect essential utilities, depend on exploitative middlemen, or fall prey to phishing scams demanding private OTPs and advance fees. The lack of plain-language, accessible translation locks citizens out of their own rights.

---

## 2. Solution Description (Under 200 Words)
**Samajh** ("understanding") is an assistive AI application that bridges the digital literacy divide. Users simply snap a photo or upload a PDF of any official document. Powered by Google Gemini via the official `@google/genai` SDK, the system performs zero-shot multimodal document comprehension without error-prone separate OCR. 

Samajh produces a structured explanation at a **5th-grade reading level** in **English, Hindi, or Kannada**. It provides:
1. A 3-sentence summary of what the document means.
2. A prioritized action checklist with explicit deadlines.
3. An automatic fraud/scam safeguard that flags suspicious OTP or advance-fee demands.
4. Multilingual Web Speech API read-aloud functionality with Indian dialect voices (`en-IN`, `hi-IN`, `kn-IN`).
5. An interactive follow-up Q&A chatbox supporting voice input.
6. A comprehensive accessibility toolbar offering instant text scaling up to 200%, a WCAG AAA yellow-on-black high-contrast mode, Atkinson Hyperlegible dyslexia fonts, and wide line spacing.

Files are processed in memory and never saved to disk, ensuring complete privacy.

---

## 3. Demo Video Script & Walkthrough (3–5 Minutes)

| Timestamp | Scene | Spoken Script & Actions |
|---|---|---|
| **0:00 – 0:35** | **The Problem Story** | *"Meet Ramesh, a 68-year-old retired resident of Bengaluru. Today, he received a terrifying municipal letter loaded with legal citations and warnings. He cannot read the small English text, doesn't understand the penalty clauses, and is terrified his water connection will be cut off. This happens to millions every day. This is why we built Samajh."* |
| **0:35 – 1:15** | **Upload & Kannada Analysis** | *"Ramesh opens Samajh on his mobile phone. He taps 'Take Photo' or uploads the document. He selects his mother tongue, Kannada (ಕನ್ನಡ), and clicks 'Explain This Document'. Within seconds, Gemini reads the document directly. Instead of 3 pages of legal threats, Ramesh gets a 3-sentence summary at a 5th-grade reading level, an exact breakdown of dues (Rs. 17,760/-), and a clear deadline of 15-10-2026."* |
| **1:15 – 1:55** | **Accessibility: Read Aloud & High Contrast** | *"Because Ramesh has low vision, he clicks 'A+' to scale up the text to 150%, and switches to the High-Contrast yellow-on-black mode with one click. Then he taps the speaker icon. The browser's native text-to-speech reads the Kannada explanation aloud cleanly and comfortably."* |
| **1:55 – 2:35** | **Voice Follow-up Q&A** | *"Ramesh has a question: 'What happens if I don't pay?'. Instead of typing, he taps the microphone icon and speaks his question. Samajh answers in simple language in under four sentences, confirming that a 2% monthly fee applies, and reminds him this is an explanation, not legal advice."* |
| **2:35 – 3:15** | **Hindi KYC & Fraud / Scam Detection** | *"Next, we test a suspicious lottery letter that arrived by WhatsApp demanding an Aadhaar OTP and a Rs. 2,999 transfer fee. Samajh immediately flags a High Urgency Scam Warning: 'CRITICAL SCAM ALERT: Official departments NEVER ask for OTPs or advance fees.' We also show a Hindi SBI KYC notice warning the user to visit their branch before their debit card is blocked."* |
| **3:15 – 3:45** | **History & Architecture** | *"All past analyses remain accessible in the user's private history. Our architecture runs on a lightweight Node.js Express backend, MongoDB Atlas, and Google Gemini with Zod validation and prompt injection hardening. Uploaded files are never stored on disk."* |
| **3:45 – 4:00** | **Conclusion & Impact** | *"Samajh turns complex government and banking bureaucracy into clear, accessible, and voice-guided understanding for everyone. Thank you."* |

---

## 4. Quick Demo Steps & Sample Files

To reproduce this demo in under 3 minutes:

1. **Launch App**: Open `http://localhost:5173/` (or live Vercel URL).
2. **Toggle A11y Toolbar**:
   - Click `A+` twice to scale text to 150%.
   - Click `Theme` twice to experience the yellow-on-black High-Contrast mode.
   - Click `Dyslexia` to enable the Atkinson Hyperlegible font.
3. **Log in / Register**:
   - Use any test account or create a new one instantly.
4. **Test Document 1 (Property Tax Notice — Kannada)**:
   - File: `server/samples/property_tax_notice.txt`
   - Select Language: `ಕನ್ನಡ`
   - Observe: 5th-grade Kannada summary, penalty breakdown, action steps, and click `Listen` to hear speech synthesis.
5. **Test Document 2 (Fraud / Scam Alert — English)**:
   - File: `server/samples/suspicious_otp_letter.txt`
   - Select Language: `English`
   - Observe: Prominent red warning banner detecting OTP fraud and advance-fee scheme.
6. **Ask a Follow-up Question**:
   - In the chatbox, ask: *"What is the penalty if I delay?"*
   - Observe: Immediate plain-language answer citing the 2% monthly penalty with disclaimer.
7. **View History**:
   - Click `History` in the header to view both analyzed documents saved securely.
