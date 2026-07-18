import { GoogleGenAI } from '@google/genai';

// @desc    Chat with AI Travel Planner
// @route   POST /api/ai/chat
// @access  Public
export const chatWithAI = async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API Key is missing in backend environment.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    // System instructions for the travel planner
    const systemInstruction = "You are a friendly and knowledgeable AI Travel Planner for an eco-tourism app called EcoExplorer. Always focus on sustainable travel, eco-friendly stays, and green transportation. Keep responses concise, engaging, and beautifully formatted with bullet points when applicable.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedMessages,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const aiText = response.text;

    res.json({ text: aiText });
  } catch (error) {
    console.error('Error in chatWithAI:', error);
    res.status(500).json({ message: 'Failed to generate response from the AI service' });
  }
};
