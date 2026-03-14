const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { success, error } = require('../utils/apiResponse');

// Initialize Gemini API (Will require GEMINI_API_KEY in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key-for-dev');

/**
 * @desc    Chat with AI Agricultural Assistant
 * @route   POST /api/ai/chat
 * @access  Private
 */
const chatWithBot = asyncHandler(async (req, res) => {
  const { message, language } = req.body;

  if (!message) {
    return res.status(400).json(error('Message is required', 400));
  }

  const currentLanguage = language || 'English';

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are a highly knowledgeable agricultural assistant named FarmGuard AI. 
You help farmers in India with crop management, soil health, and identifying authentic farming inputs. 
Keep your answers concise, practical, and empathetic. 
Current preferred language for response: ${currentLanguage}. Respond naturally in this language.`;

    const result = await model.generateContent([systemPrompt, message]);
    const responseText = result.response.text();

    return success(res, { reply: responseText }, 'AI Response generated');
  } catch (err) {
    console.error('AI Chat Error:', err.message);
    return error(res, 'Failed to get response from AI. Please try again.', 500);
  }
});

/**
 * @desc    Analyze product image for authenticity signals
 * @route   POST /api/ai/analyze-image
 * @access  Private
 */
const analyzeProductImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(error('Please upload an image of the product', 400));
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a forensic agricultural inspector. Examine this image of a farming input (seed packet, fertilizer, pesticide).
Determine if it looks authentic or counterfeit. 
Look for:
1. Typos or poor print quality.
2. Missing standard certification marks (like ISI or AGMARK).
3. Suspicious formatting of expiry dates or batch codes.
4. Overall professional appearance.

Provide a JSON strict response exactly resembling this format (do not use markdown blocks, just raw JSON):
{
  "status": "Genuine" | "Counterfeit" | "Suspicious",
  "confidenceScore": 95,
  "observations": ["observation 1", "observation 2"],
  "recommendation": "What the farmer should do"
}`;

    const imageParts = [
      {
        inlineData: {
          data: req.file.buffer.toString('base64'),
          mimeType: req.file.mimetype
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    let responseText = result.response.text().trim();
    
    // Clean up potential markdown blocks if the model ignores instructions
    if (responseText.startsWith('\`\`\`json')) {
       responseText = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }

    const parsedResult = JSON.parse(responseText);

    return success(res, parsedResult, 'Image analyzed successfully');
  } catch (err) {
    console.error('AI Vision Error:', err.message);
    return error(res, 'Failed to analyze image. Ensure the image is clear and try again.', 500);
  }
});

module.exports = {
  chatWithBot,
  analyzeProductImage
};
