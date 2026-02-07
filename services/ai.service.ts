// services/ai.service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Product } from "@prisma/client";

type ExtractedItem = {
  name: string;
  qty: number;
};

export class AIService {
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  }

  /**
   * STEP 1 — Convert speech to plain text
   */
  async speechToText(audioBase64: string): Promise<string> {
    const prompt = `
You are a speech transcription engine for Indian shopkeepers.
Return ONLY the spoken text. No explanation.
and translate it to english.
`;

    const result = await this.model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "audio/wav", data: audioBase64 } },
            { text: prompt },
          ],
        },
      ],
    });

    return result.response.text().trim();
  }

  /**
   * STEP 2 — Convert text to items using catalog grounding
   */
  async extractItemsFromText(
    text: string,
    catalog: Product[]
  ): Promise<{ customer_name: string | null; items: ExtractedItem[] }> {
    const catalogList = catalog.map((p) => p.name).join(", ");

    const prompt = `
You are a billing parser.

Shop Catalog:
${catalogList}

From the text below, extract:
- customer_name (if mentioned, else null)
- items with name EXACTLY matching or closest match(90%) from catalog
- qty (default 1 if missing)

Return ONLY JSON:
{
  "customer_name": "string or null",
  "items": [{ "name": "exact catalog name", "qty": number }]
}

If an item is not in catalog, ignore it.

Text:
"${text}"
`;
    console.log(prompt);


    const result = await this.model.generateContent(prompt);

    const clean = result.response.text().replace(/```json|```/g, "").trim();
    console.log(clean);

    return JSON.parse(clean);
  }
}

export const aiService = new AIService();
