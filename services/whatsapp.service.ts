// services/whatsapp.service.ts
import FormData from "form-data";

export class WhatsappService {
  private phoneId: string;
  private token: string;
  private baseUrl = "https://graph.facebook.com/v17.0";

  constructor() {
    this.phoneId = process.env.WHATSAPP_PHONE_ID || "";
    this.token = process.env.WHATSAPP_TOKEN || "";

    if (!this.phoneId || !this.token) {
      console.warn("⚠️ WhatsApp credentials missing");
    }
  }

  /**
   * 1️⃣ Download audio as Buffer
   */
  async downloadAudio(mediaId: string): Promise<Buffer> {
    if (mediaId === "SIMULATED_AUDIO_ID") {
      const fs = await import("fs");
      return fs.readFileSync("test_audio.mp3");
    }

    // Step A — get media URL
    const urlRes = await fetch(`${this.baseUrl}/${mediaId}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    const urlData = (await urlRes.json()) as { url?: string };
    if (!urlData.url) {
      throw new Error("Failed to fetch media URL");
    }

    // Step B — download binary
    const fileRes = await fetch(urlData.url, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    const arrayBuffer = await fileRes.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * 2️⃣ Upload PDF from Buffer
   */
  async uploadPDF(buffer: Buffer): Promise<string> {
    const form = new FormData();
    form.append("messaging_product", "whatsapp");
    form.append("type", "application/pdf");
    form.append("file", buffer, {
      filename: "invoice.pdf",
      contentType: "application/pdf",
    });

    const res = await fetch(`${this.baseUrl}/${this.phoneId}/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        ...form.getHeaders(),
      },
      body: form as any,
    });

    const data = (await res.json()) as { id?: string };

    if (!data.id) {
      throw new Error("Failed to upload PDF to WhatsApp");
    }

    return data.id;
  }

  /**
   * 3️⃣ Send document message
   */
  async sendDocument(
    to: string,
    mediaId: string,
    caption: string
  ): Promise<void> {
    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "document",
      document: {
        id: mediaId,
        filename: "invoice.pdf",
        caption,
      },
    };

    await fetch(`${this.baseUrl}/${this.phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  /**
   * 4️⃣ High level helper used by worker
   */
  async sendInvoicePDF(
    to: string,
    pdfBuffer: Buffer,
    caption: string
  ) {
    const mediaId = await this.uploadPDF(pdfBuffer);
    await this.sendDocument(to, mediaId, caption);
  }
}

export const whatsappService = new WhatsappService();
