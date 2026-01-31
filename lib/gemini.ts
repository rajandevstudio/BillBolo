// lib/gemini.ts
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// 1. Define the shape of the AI response
export interface ExtractedInvoice {
  shop_name: string;
  customer_name: string;
  items: Array<{
    description: string; // Renamed 'desc' to 'description' to match your calculation lib
    qty: number;
    rate: number;
  }>;
}

export async function extractInvoiceDetails(audioBase64: string): Promise<ExtractedInvoice> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-1.5-flash for better multimodal performance
    const model: GenerativeModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" } // Force JSON mode
    });

    const prompt = `
      You are a billing accountant. Listen to this audio and extract invoice details.
      
      RULES:
      - If no customer name, use "Cash Customer".
      - If no shop name, use "My General Store".
      - Ensure 'qty' and 'rate' are numbers.
      
      Return JSON format:
      {
        "shop_name": "string",
        "customer_name": "string",
        "items": [ {"description": "string", "qty": number, "rate": number} ]
      }
    `;

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [
          { inlineData: { mimeType: "audio/mp3", data: audioBase64 } },
          { text: prompt }
        ]
      }]
    });

    const responseText = result.response.text();
    // No need for regex replacement if using generationConfig: { responseMimeType: "application/json" }
    const parsed: ExtractedInvoice = JSON.parse(responseText);

    return parsed;

  } catch (error) {
    console.error("AI Error:", error instanceof Error ? error.message : error);
    
    // Return a safe fallback that matches the ExtractedInvoice interface
    return {
      shop_name: "Error Store",
      customer_name: "Unknown",
      items: []
    };
  }
}