import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

// Initialize the Google Generative AI with API key
const getGeminiAI = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.');
    return null;
  }
  
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Generate a response from the Gemini AI based on the agent's personality and the chat history
 */
export async function generateAgentResponse(
  agentName: string,
  category: string,
  traits: string[],
  expertise: string[],
  chatHistory: { role: 'user' | 'agent', content: string }[],
  userMessage: string
): Promise<string> {
  try {
    const genAI = getGeminiAI();
    if (!genAI) {
      return "I'm currently experiencing technical difficulties. Please try again later.";
    }

    // Set up the model with safety settings
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Create a system prompt that defines the agent's personality and expertise
    const systemPrompt = `You are ${agentName}, a ${category.toLowerCase()} AI agent with the following traits: ${traits.join(', ')}.
Your areas of expertise include: ${expertise.join(', ')}.
Respond to the user in a way that reflects your personality traits and expertise.
Keep your responses concise, helpful, and engaging.
Always stay in character as ${agentName}.`;

    // Format previous conversation history for context
    const history = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Start a chat session
    const chat = model.startChat({
      history: history.length > 0 ? history.slice(0, -1) : [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    // Send the message and get a response
    const result = await chat.sendMessage([
      { text: systemPrompt },
      { text: userMessage }
    ]);

    const response = result.response.text();
    return response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}