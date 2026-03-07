import OpenAI from 'openai';

const MAX_STANDARD_WORDS = 150;
const MAX_AUTO_REPLY_WORDS = 120;

const FAQ_ENTRIES = [
  {
    keywords: ['deposit', 'credited', 'not received'],
    answer:
      'Deposits stay pending until required blockchain confirmations are completed. Please verify TX hash, destination address, and network. If confirmations are done but funds are not credited, share your TX hash with support for manual verification.'
  },
  {
    keywords: ['withdraw', 'withdrawal', 'pending withdrawal'],
    answer:
      'Withdrawals can be delayed by security checks or chain congestion. Confirm destination address and network. If the request remains pending beyond normal processing, contact support with your withdrawal ID for a status check.'
  },
  {
    keywords: ['kyc', 'verification', 'identity'],
    answer:
      'KYC requests are processed in queue order. Ensure uploaded documents are clear, valid, and match your profile details. If rejected, fix the highlighted mismatch and submit again for review.'
  },
  {
    keywords: ['2fa', 'otp', 'authenticator', 'login'],
    answer:
      'For login or 2FA issues, sync your device time to automatic and try again. If you lost authenticator access, raise a support request so recovery can be completed through secure ownership checks.'
  },
  {
    keywords: ['p2p', 'dispute', 'escrow'],
    answer:
      'For P2P disputes, keep all communication and proof in-platform. Use the dispute flow so support can review escrow timeline, chat logs, and payment evidence before deciding the case.'
  },
  {
    keywords: ['fee', 'fees', 'charges'],
    answer:
      'Trading, withdrawal, and network fees vary by market and chain conditions. Review fee details on the relevant order or transfer screen before final confirmation.'
  }
];

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const clampWords = (value, maxWords) => {
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

const generateOpenAIReply = async ({ message, maxWords, instructions, fallbackReply }) => {
  const cleanMessage = String(message || '').trim();
  if (!cleanMessage) {
    return fallbackReply;
  }

  const faqAnswer = findFAQAnswer(cleanMessage);
  if (faqAnswer) {
    return clampWords(faqAnswer, maxWords);
  }

  const client = getOpenAIClient();
  if (!client) {
    return fallbackReply;
  }

  try {
    const response = await client.responses.create({
      model: getSupportModel(),
      temperature: 0.2,
      max_output_tokens: 320,
      instructions,
      input: cleanMessage
    });

    const text = extractResponseText(response);
    if (!text) {
      return fallbackReply;
    }

    return clampWords(text, maxWords);
  } catch (error) {
    console.error('[support-ai] failed to generate response', { message: error.message });
    return fallbackReply;
  }
};

const standardFallbackReply =
  'I can help with deposits, withdrawals, KYC, login, and P2P issues. Please share ticket ID, transaction hash, and exact issue details so support can investigate quickly.';

const autoReplyFallback =
  'Thanks for contacting support. I have logged your query and can help with immediate guidance. If needed, a live agent will join shortly. Please share any transaction ID or error screenshot details.';

export const getAIReply = async (message) => {
  return generateOpenAIReply({
    message,
    maxWords: MAX_STANDARD_WORDS,
    instructions:
      'You are a crypto exchange customer support assistant. Give practical and safe guidance. Do not provide financial, legal, or security bypass advice. Keep response under 150 words.',
    fallbackReply: standardFallbackReply
  });
};

export const generateAutoReply = async (message) => {
  return generateOpenAIReply({
    message,
    maxWords: MAX_AUTO_REPLY_WORDS,
    instructions:
      'You are first-line support for a crypto exchange. Respond like a helpful live support assistant before human agent joins. Be clear, practical, and safe. Keep response under 120 words.',
    fallbackReply: autoReplyFallback
  });
};

export const faqEntries = FAQ_ENTRIES.map((entry) => ({
  keywords: [...entry.keywords],
  answer: entry.answer
}));
