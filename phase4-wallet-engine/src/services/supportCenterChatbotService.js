import OpenAI from 'openai';
import { listHelpArticles } from './supportCenterRepository.js';

const MAX_WORDS = 140;

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

const makeOpenAiClient = () => {
  const key = String(process.env.OPENAI_API_KEY || '').trim();
  if (!key) {
    return null;
  }
  return new OpenAI({ apiKey: key });
};

const extractResponseText = (response) => {
  const direct = String(response?.output_text || '').trim();
  if (direct) {
    return direct;
  }

  const chunks = [];
  const output = Array.isArray(response?.output) ? response.output : [];
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

const shouldOfferTicket = (text) => {
  const normalized = normalizeText(text);
  const ticketKeywords = ['appeal', 'stuck', 'not credited', 'failed', 'frozen', 'dispute', 'urgent', 'unable'];
  return ticketKeywords.some((keyword) => normalized.includes(keyword));
};

export const generateSupportChatbotReply = async (message) => {
  const userText = String(message || '').trim();
  if (!userText) {
    return {
      reply: 'Please describe your issue. I can help with P2P, KYC, deposits, withdrawals, and trading support.',
      suggested_articles: [],
      can_create_ticket: false
    };
  }

  const relatedArticles = await listHelpArticles({ search: userText, categoryId: null, limit: 4 });
  const topSuggestions = relatedArticles.map((article) => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    updated_at: article.updated_at
  }));

  if (topSuggestions.length > 0) {
    return {
      reply: clampWords(
        `I found relevant help articles for your issue. Please review these first. If the issue still persists, I can create a support ticket for you immediately.`,
        MAX_WORDS
      ),
      suggested_articles: topSuggestions,
      can_create_ticket: shouldOfferTicket(userText)
    };
  }

  const openAiClient = makeOpenAiClient();
  if (!openAiClient) {
    return {
      reply: clampWords(
        'I could not find a direct article match. Please share your Order ID, coin/network details, and exact error so I can guide you, or submit a support ticket now.',
        MAX_WORDS
      ),
      suggested_articles: [],
      can_create_ticket: true
    };
  }

  try {
    const response = await openAiClient.responses.create({
      model: String(process.env.OPENAI_SUPPORT_CHATBOT_MODEL || process.env.OPENAI_SUPPORT_MODEL || 'gpt-4o-mini'),
      temperature: 0.2,
      max_output_tokens: 320,
      instructions:
        'You are a Binance/Bybit-style crypto exchange support assistant. Give practical troubleshooting guidance with safe and compliant language. Keep response concise.',
      input: userText
    });

    const output = extractResponseText(response) || 'Please share more details so I can help better.';
    return {
      reply: clampWords(output, MAX_WORDS),
      suggested_articles: [],
      can_create_ticket: shouldOfferTicket(userText)
    };
  } catch (error) {
    console.error('[support-center-chatbot] failed', { message: error.message });
    return {
      reply: clampWords(
        'I am currently unable to fetch AI guidance. Please use the Submit Case form with your UID, Order ID, and issue details.',
        MAX_WORDS
      ),
      suggested_articles: [],
      can_create_ticket: true
    };
  }
};

