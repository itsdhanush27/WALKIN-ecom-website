import { GoogleGenAI } from "@google/genai";

// Initialize safe client - in a real app, ensure this key is not exposed or use a backend proxy.
// For this demo, we assume the environment variable is injected.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (name: string, features: string) => {
  if (!process.env.API_KEY) return "AI description unavailable (Missing API Key).";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a punchy, 2-sentence marketing description for a sneaker named "${name}". Key features: ${features}. Tone: Urban, energetic.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description.";
  }
};

export const chatWithStylist = async (history: {role: 'user' | 'model', parts: {text: string}[]}[] , message: string) => {
   if (!process.env.API_KEY) return "Chat unavailable (Missing API Key).";

   try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: "You are 'SoleBot', a helpful and trendy sneaker stylist for Walkin.it. You help users find the perfect shoes based on their outfit, occasion, or weather. Keep answers short, fun, and use emojis."
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
   } catch (error) {
     console.error("Gemini Chat Error:", error);
     return "Sorry, I'm having trouble connecting to the sneaker verse right now.";
   }
};