import OpenAI from 'openai';

const MAX_WORDS = 150;

const FAQ_ENTRIES = [
  {
    keywords: ['deposit', 'credited', 'not received'],
    answer:
      'Deposits can remain pending until enough blockchain confirmations are received. Please verify the transaction hash and network. If still pending after confirmation, share the TX hash with support for manual verification.'
  },
  {
    keywords: ['withdraw', 'withdrawal', 'pending withdrawal'],
    answer:
      'Withdrawals may be delayed by security checks or network congestion. Confirm the destination network and address. If status is still pending after normal processing time, contact support with your withdrawal ID.'
  },
  {
    keywords: ['kyc', 'verification', 'identity'],
    answer:
      'KYC reviews are handled in queue order. Ensure your submitted documents are clear and match your profile details. If your request was rejected, update the requested details and resubmit.'
  },
  {
    keywords: ['2fa', 'otp', 'authenticator', 'login'],
    answer:
      'For login and 2FA issues, confirm your device time is set automatically, then retry. If you lost access to your authenticator, open a support ticket and we will guide you through secure recovery checks.'
  },
  {
    keywords: ['p2p', 'dispute', 'escrow'],
    answer:
      'For P2P disputes, keep all chat and payment proof inside the platform and avoid off-platform communication. Escalate the order from the dispute option so the support team can review escrow evidence.'
  },
  {
    keywords: ['fee', 'fees', 'charges'],
    answer:
      'Trading, withdrawal, and network fees vary by market and chain conditions. Please check the fee section in the relevant screen for the latest values before confirming transactions.'
  }
];

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const clampWords = (value, maxWords = MAX_WORDS) => {
  const words = String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length <= maxWords) {
    return words.join(' ');
  }

  return `${words.slice(0, maxWords).join(' ')}...`;
};

const findFAQAnswer = (message) => {
  const normalized = normalizeText(message);
  if (!normalized) {
    return null;
  }

  return (
    FAQ_ENTRIES.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)))?.answer || null
  );
};

const getFallbackReply = () =>
  'I can help with deposits, withdrawals, KYC, login, and P2P issues. Please share your ticket ID, transaction hash, and exact issue details so support can investigate quickly.';

const extractResponseText = (response) => {
  const directText = String(response?.output_text || '').trim();
  if (directText) {
    return directText;
  }

  const output = Array.isArray(response?.output) ? response.output : [];
  const chunks = [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const block of content) {
      const text = String(block?.text || '').trim();
      if (text) {
        chunks.push(text);
      }
    }
  }

  return chunks.join(' ').trim();
};

const getOpenAIClient = () => {
  const apiKey = String(process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
};

const getSupportModel = () => String(process.env.OPENAI_SUPPORT_MODEL || 'gpt-4o-mini').trim();

export const getAIReply = async (message) => {
  const cleanMessage = String(message || '').trim();
  if (!cleanMessage) {
    return 'Please share your support question so I can help.';
  }

  const faqAnswer = findFAQAnswer(cleanMessage);
  if (faqAnswer) {
    return clampWords(faqAnswer, MAX_WORDS);
  }

  const client = getOpenAIClient();
  if (!client) {
    return getFallbackReply();
  }

  try {
    const response = await client.responses.create({
      model: getSupportModel(),
      temperature: 0.2,
      max_output_tokens: 320,
      instructions:
        'You are a crypto exchange customer support assistant. Give practical, safe support guidance. Do not provide legal, financial, or security bypass advice. Keep the answer under 150 words.',
      input: cleanMessage
    });

    const text = extractResponseText(response);
    if (!text) {
      return getFallbackReply();
    }

    return clampWords(text, MAX_WORDS);
  } catch (error) {
    console.error('[support-ai] failed to generate response', { message: error.message });
    return getFallbackReply();
  }
};

export const faqEntries = FAQ_ENTRIES.map((entry) => ({
  keywords: [...entry.keywords],
  answer: entry.answer
}));
