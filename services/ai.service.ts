// services/ai.service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { InvoiceExtraction } from "@/types";

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  }

  async extractInvoiceDetails(audioBase64: string): Promise<InvoiceExtraction> {
    try {
      const prompt = `
        You are a billing API. Extract invoice details from this audio.
        Return JSON ONLY: { "customer_name": "Name or null", "items": [{ "desc": "Item", "qty": 1, "rate": 0 }] }
        Rules: Default missing prices to realistic INR values. Default missing qty to 1.
      `;

      const result = await this.model.generateContent({
        contents: [{
          role: "user",
          parts: [
            { inlineData: { mimeType: "audio/mp3", data: audioBase64 } },
            { text: prompt }
          ]
        }]
      });

      const text = result.response.text().replace(/```json|```/g, "").trim();
      return JSON.parse(text);
    } catch (error) {
      console.error("AI Service Error:", error);
      return { customer_name: "Cash Customer", items: [] }; // Safe fallback
    }
  }
}

export const aiService = new AIService();