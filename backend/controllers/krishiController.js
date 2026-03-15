const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const { success, error } = require('../utils/apiResponse');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are KrishiBot, a friendly and knowledgeable farming assistant with a cosmic twist — you exist in an antigravity universe! You help with:
- Crop selection, planting, and harvesting advice
- Soil health, fertilizers, and composting
- Pest and disease management (organic and conventional)
- Irrigation techniques and water management
- Seasonal and monsoon farming tips (Indian context)
- General knowledge questions on any topic

Keep your answers concise, practical, and under 100 words. Be warm and occasionally reference your weightless, floating existence in a fun way. Respond in the user's preferred language if specified. Current language context: `;

/**
 * @desc    Chat with KrishiBot (Moonshot via HF or Gemini Fallback)
 * @route   POST /api/ai/krishibot
 * @access  Private
 */
const chatWithKrishi = asyncHandler(async (req, res) => {
  const { messages, language } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return error(res, 'Messages array is required', 400);
  }

  const userPreferredLang = language || 'English';
  const lastUserMessage = messages[messages.length - 1].text;

  console.log('API Keys Check:', {
    HF_TOKEN: process.env.HF_TOKEN ? 'Present' : 'Missing',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Present' : 'Missing'
  });

  // Try Hugging Face (Moonshot) first if token exists
  if (process.env.HF_TOKEN && !process.env.HF_TOKEN.includes('your_')) {
    try {
      const response = await axios.post(
        'https://router.huggingface.co/v1/chat/completions',
        {
          model: 'moonshotai/Kimi-K2-Instruct-0905',
          messages: [
            { role: 'system', content: `${SYSTEM_PROMPT} ${userPreferredLang}.` },
            ...messages.map(m => ({
              role: m.role === 'bot' ? 'assistant' : 'user',
              content: m.text
            }))
          ],
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.HF_TOKEN}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const reply = response.data.choices[0].message.content;
      return success(res, { reply }, 'AI Response generated (Moonshot)');
    } catch (err) {
      console.error('HF Moonshot Error:', err.response?.data || err.message);
      // Fallback to Gemini handled below
    }
  }

  // Fallback to Gemini
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_')) {
    return error(res, 'AI Configuration missing. Please add your HF_TOKEN or GEMINI_API_KEY to the backend/.env file.', 400);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
    });

    const fullPrompt = `${SYSTEM_PROMPT} ${userPreferredLang}.\n\nUser Question: ${lastUserMessage}`;
    const result = await chat.sendMessage(fullPrompt);
    const reply = result.response.text();

    return success(res, { reply }, 'AI Response generated (Gemini)');
  } catch (err) {
    console.error('AI Processing Error:', err.message);
    if (err.response) {
      console.error('Error Response Data:', err.response.data);
    }
    return error(res, 'Failed to get response from AI. Please check your API keys or quota.', 500);
  }
});

module.exports = {
  chatWithKrishi
};


