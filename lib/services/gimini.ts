import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

const API_KEY = "AIzaSyDRPII3h8uKvTgqN9l9PtqUscIj5MbSww0";

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async startNewChat(systemInstruction: string) {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction,
      },
    });
  }

  async sendMessage(message: string, useThinking: boolean): Promise<string> {
    if (!this.chat) {
      await this.startNewChat("You are an expert e-commerce data analyst assistant for Amz-Analytics. You provide concise, data-driven insights about sales, marketing, and inventory.");
    }

    try {
      const config: any = {};
      if (useThinking) {
        config.thinkingConfig = { thinkingBudget: 32768 };
      }

      // Note: chat.sendMessage doesn't directly support config overrides in some SDK versions 
      // but models.generateContent does. For deep reasoning, we can use the direct model call 
      // or assume the chat context is maintained via contents.
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ role: 'user', parts: [{ text: message }] }],
        config
      });

      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "An error occurred while connecting to the AI service.";
    }
  }
}

export const geminiService = new GeminiService();
