/**
 * Mock data store for Samajh frontend in offline / demo mode.
 * Matches the shared API document contract.
 */

export const INITIAL_MOCK_DOCUMENTS = [
  {
    id: "mock-1",
    fileName: "property-tax-notice.pdf",
    language: "kn",
    createdAt: "2026-10-07T08:00:00.000Z",
    analysis: {
      documentType: "Property Tax Notice",
      title: "Property Tax Reminder",
      summary: "Your property tax payment is due soon. This official notice from the City Municipal Corporation informs you of the pending property tax for the financial year 2026-27. Pay before the due date to avoid penalty charges.",
      urgency: "high",
      actions: [
        {
          step: "Pay the property tax amount of ₹2,500 online or at the ward office counter",
          deadline: "October 20, 2026"
        },
        {
          step: "Collect and save the official printed payment receipt for your records",
          deadline: "October 20, 2026"
        },
        {
          step: "Contact the municipal ward office if the assessment value appears incorrect",
          deadline: "Before making payment"
        }
      ],
      deadlines: [
        {
          label: "Payment deadline",
          date: "October 20, 2026"
        },
        {
          label: "Penalty period begins",
          date: "October 21, 2026"
        }
      ],
      documentsNeeded: [
        "Property tax account number (PID / SAS number)",
        "Previous year's tax receipt or challan copy",
        "Aadhaar card or valid ID proof of property owner"
      ],
      amounts: [
        {
          label: "Tax due",
          value: "₹2,500"
        },
        {
          label: "Late fee penalty",
          value: "₹250 per month"
        }
      ],
      warnings: [
        "Check the official payment website (https://bbmp.gov.in) before making payment.",
        "Do not hand cash to unauthorized field agents demanding spot collection without a stamped government receipt."
      ]
    }
  },
  {
    id: "mock-2",
    fileName: "electricity-overdue-alert.png",
    language: "hi",
    createdAt: "2026-10-06T14:30:00.000Z",
    analysis: {
      documentType: "Electricity Bill Notice",
      title: "Electricity Disconnection Warning",
      summary: "Your electricity connection has an unpaid balance for two billing cycles. The electricity distribution board has scheduled a temporary disconnection if payment is not settled promptly.",
      urgency: "high",
      actions: [
        {
          step: "Clear outstanding bill online or at the sub-division counter",
          deadline: "October 12, 2026"
        },
        {
          step: "Share confirmation SMS/receipt with the local line inspector",
          deadline: "Immediately after payment"
        }
      ],
      deadlines: [
        {
          label: "Disconnection date",
          date: "October 12, 2026"
        }
      ],
      documentsNeeded: [
        "Consumer Account Number (CA Number)",
        "Registered mobile phone for SMS verification"
      ],
      amounts: [
        {
          label: "Total overdue bill",
          value: "₹1,840"
        },
        {
          label: "Reconnection charge",
          value: "₹150"
        }
      ],
      warnings: [
        "Electricity service may be disconnected at 5:00 PM on October 12 without another reminder.",
        "Always pay via the authorized electricity department portal to avoid fraud."
      ]
    }
  },
  {
    id: "mock-3",
    fileName: "ration-card-verification.pdf",
    language: "en",
    createdAt: "2026-10-05T11:15:00.000Z",
    analysis: {
      documentType: "Public Welfare Notice",
      title: "Ration Card eKYC Verification Notice",
      summary: "All Antyodaya and Priority Household ration card holders are required to complete biometric e-KYC authentication at their local fair price shop to ensure continuous grain distribution.",
      urgency: "medium",
      actions: [
        {
          step: "Visit your registered fair price shop (ration depot) with all listed family members",
          deadline: "November 30, 2026"
        },
        {
          step: "Authenticate fingerprints on the e-PoS electronic machine",
          deadline: "November 30, 2026"
        }
      ],
      deadlines: [
        {
          label: "Final eKYC completion date",
          date: "November 30, 2026"
        }
      ],
      documentsNeeded: [
        "Original Ration Card booklet or digital card",
        "Aadhaar cards of all family members listed on the card"
      ],
      amounts: [
        {
          label: "eKYC verification fee",
          value: "₹0 (Completely Free)"
        }
      ],
      warnings: [
        "This eKYC service is 100% free of charge. Report any dealer demanding payment to the helpline 1967."
      ]
    }
  }
];

const MOCK_STORAGE_KEY = "samajh_mock_documents_v1";

// Helper to retrieve in-memory/localStorage persisted documents
export function getStoredMockDocuments() {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Could not read mock documents from localStorage", err);
  }
  return [...INITIAL_MOCK_DOCUMENTS];
}

export function saveStoredMockDocuments(docs) {
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(docs));
  } catch (err) {
    console.warn("Could not save mock documents to localStorage", err);
  }
}

export function mockAnalyzeDocument(file, language = "en") {
  const docs = getStoredMockDocuments();
  const id = `mock-${Date.now()}`;
  const fileName = file?.name || "uploaded-document.pdf";

  // Provide language-tuned response
  let title = "Government Welfare & Verification Notice";
  let documentType = "Official Administrative Notice";
  let summary = "This official document confirms your eligibility for citizen support and requests periodic verification of your residential status.";
  let urgency = "high";
  let actions = [
    {
      step: "Submit the verification declaration form at your local citizen service center",
      deadline: "October 28, 2026"
    },
    {
      step: "Keep the acknowledgement slip stamped with the official seal",
      deadline: "October 28, 2026"
    }
  ];
  let deadlines = [
    {
      label: "Submission deadline",
      date: "October 28, 2026"
    }
  ];
  let documentsNeeded = [
    "Aadhaar Card or Voter ID",
    "Proof of address (Electricity bill or Water bill)",
    "Recent passport size photograph"
  ];
  let amounts = [
    {
      label: "Application fee",
      value: "₹50"
    }
  ];
  let warnings = [
    "Ensure documents are submitted before 5:00 PM on October 28 to avoid rejection.",
    "Do not provide original certificates; only submit self-attested photocopies."
  ];

  if (language === "kn") {
    title = "ಆಸ್ತಿ ತೆರಿಗೆ ಪಾವತಿ ಮತ್ತು ವಿವರಣೆ (Property Tax)";
    documentType = "ನಗರ ಪಾಲಿಕೆ ನೋಟಿಸ್ (Municipal Notice)";
    summary = "ನಿಮ್ಮ ಆಸ್ತಿ ತೆರಿಗೆಯನ್ನು ನಿಗದಿತ ದಿನಾಂಕದೊಳಗೆ ಪಾವತಿಸಬೇಕಾಗಿದೆ. ತಡವಾಗಿ ಪಾವತಿಸಿದರೆ ಮಾಸಿಕ ದಂಡ ವಿಧಿಸಲಾಗುತ್ತದೆ. ಈ ಕೆಳಗಿನ ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿ.";
    actions = [
      {
        step: "ಆನ್‌ಲೈನ್ ಪೋರ್ಟಲ್ ಅಥವಾ ವಾರ್ಡ್ ಕಚೇರಿಯಲ್ಲಿ ₹2,500 ತೆರಿಗೆ ಪಾವತಿಸಿ",
        deadline: "20 ಅಕ್ಟೋಬರ್ 2026"
      },
      {
        step: "ಪಾವತಿ ರಶೀದಿಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಇರಿಸಿ",
        deadline: "20 ಅಕ್ಟೋಬರ್ 2026"
      }
    ];
    deadlines = [
      {
        label: "ಪಾವತಿ ಕೊನೆಯ ದಿನಾಂಕ",
        date: "20 ಅಕ್ಟೋಬರ್ 2026"
      }
    ];
    documentsNeeded = [
      "PID ಸಂಖ್ಯೆ / ಖಾತಾ ಸಂಖ್ಯೆ",
      "ಹಿಂದಿನ ವರ್ಷದ ತೆರಿಗೆ ರಶೀದಿ",
      "ಆಧಾರ್ ಕಾರ್ಡ್"
    ];
    amounts = [
      {
        label: "ಪಾವತಿಸಬೇಕಾದ ತೆರಿಗೆ",
        value: "₹2,500"
      },
      {
        label: "ತಡವಾದರೆ ದಂಡ",
        value: "ತಿಂಗಳಿಗೆ ₹250"
      }
    ];
    warnings = [
      "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ನಾಗರಿಕ ಕೇಂದ್ರದಲ್ಲಿ ಮಾತ್ರ ಪಾವತಿಸಿ.",
      "ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಗೆ ನಗದು ಹಣ ನೀಡಬೇಡಿ."
    ];
  } else if (language === "hi") {
    title = "सम्पत्ति कर भुगतान सूचना (Property Tax Notice)";
    documentType = "नगर निगम आधिकारिक सूचना";
    summary = "आपकी संपत्ति कर की देय तिथि नजदीक है। कृपया निर्धारित समय से पूर्व भुगतान करें ताकि अतिरिक्त विलंब शुल्क से बचा जा सके।";
    actions = [
      {
        step: "नगर निगम पोर्टल पर ₹2,500 कर का भुगतान करें",
        deadline: "20 अक्टूबर 2026"
      },
      {
        step: "भुगतान की रसीद डाउनलोड कर सुरक्षित रखें",
        deadline: "20 अक्टूबर 2026"
      }
    ];
    deadlines = [
      {
        label: "अंतिम भुगतान तिथि",
        date: "20 अक्टूबर 2026"
      }
    ];
    documentsNeeded = [
      "संपत्ति पहचान संख्या (PID Number)",
      "पिछले वर्ष की कर रसीद",
      "आधार कार्ड"
    ];
    amounts = [
      {
        label: "देय राशि",
        value: "₹2,500"
      },
      {
        label: "विलंब शुल्क",
        value: "₹250 प्रति माह"
      }
    ];
    warnings = [
      "केवल आधिकारिक वेबसाइट पर ही भुगतान करें।",
      "बिना रसीद के किसी भी व्यक्ति को नकद राशि न दें।"
    ];
  }

  const newDoc = {
    id,
    fileName,
    language,
    createdAt: new Date().toISOString(),
    analysis: {
      documentType,
      title,
      summary,
      urgency,
      actions,
      deadlines,
      documentsNeeded,
      amounts,
      warnings
    }
  };

  docs.unshift(newDoc);
  saveStoredMockDocuments(docs);
  return newDoc;
}

export function mockAskQuestion(docId, question, language = "en") {
  const docs = getStoredMockDocuments();
  const doc = docs.find((d) => d.id === docId) || docs[0];

  const qLower = (question || "").toLowerCase();

  if (qLower.includes("when") || qLower.includes("deadline") || qLower.includes("date") || qLower.includes("ಯಾವಾಗ") || qLower.includes("कब")) {
    const d = doc?.analysis?.deadlines?.[0];
    if (d) {
      if (language === "kn") {
        return `ನಿಮ್ಮ ಪ್ರಮುಖ ಗಡುವು: ${d.label} - ${d.date}. ದಯವಿಟ್ಟು ಈ ದಿನಾಂಕದೊಳಗೆ ಪೂರ್ಣಗೊಳಿಸಿ.`;
      }
      if (language === "hi") {
        return `आपकी महत्वपूर्ण समय-सीमा: ${d.label} - ${d.date} है। कृपया इस तिथि से पहले कार्य पूर्ण करें।`;
      }
      return `Your primary deadline is ${d.label} on ${d.date}. Please make sure to complete it before then.`;
    }
  }

  if (qLower.includes("how much") || qLower.includes("amount") || qLower.includes("pay") || qLower.includes("cost") || qLower.includes("ಹಣ") || qLower.includes("कितना")) {
    const a = doc?.analysis?.amounts?.[0];
    if (a) {
      if (language === "kn") {
        return `ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ: ${a.label} ಆಗಿದೆ ${a.value}.`;
      }
      if (language === "hi") {
        return `देय राशि: ${a.label} - ${a.value} है।`;
      }
      return `The required amount is ${a.label}: ${a.value}.`;
    }
  }

  if (qLower.includes("miss") || qLower.includes("late") || qLower.includes("penalty") || qLower.includes("ತಡವಾದರೆ") || qLower.includes("छूट")) {
    if (language === "kn") {
      return "ನೀವು ಗಡುವನ್ನು ಮೀರಿದರೆ ಹೆಚ್ಚುವರಿ ದಂಡ ಅಥವಾ ಕಾನೂನು ಕ್ರಮ ಎದುರಿಸಬೇಕಾಗಬಹುದು. ಆದಷ್ಟು ಬೇಗ ಪಾವತಿಸಿ.";
    }
    if (language === "hi") {
      return "यदि आप समय-सीमा चूक जाते हैं तो अतिरिक्त विलंब शुल्क या सेवा में रुकावट आ सकती है।";
    }
    return "If you miss the deadline, penalty charges will apply and official services related to this notice may be suspended.";
  }

  if (language === "kn") {
    return `ಈ ದಾಖಲೆಯ ಪ್ರಕಾರ: ${doc?.analysis?.summary} ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಹತ್ತಿರದ ಅಧಿಕೃತ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.`;
  }
  if (language === "hi") {
    return `इस दस्तावेज़ के अनुसार: ${doc?.analysis?.summary} किसी भी अन्य प्रश्न के लिए अपने स्थानीय कार्यालय से संपर्क करें।`;
  }

  return `Based on this document: ${doc?.analysis?.summary || "Please refer to the action steps listed above."}`;
}
