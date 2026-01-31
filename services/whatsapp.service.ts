import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

export class WhatsappService {
  private phoneId: string;
  private token: string;
  private baseUrl = "https://graph.facebook.com/v17.0";

  constructor() {
    this.phoneId = process.env.WHATSAPP_PHONE_ID || "";
    this.token = process.env.WHATSAPP_TOKEN || "";

    if (!this.phoneId || !this.token) {
      console.warn("⚠️ WhatsApp Service initialized without credentials.");
    }
  }

  // 1. Download Audio from WhatsApp URL
  async downloadMedia(mediaId: string): Promise<string | null> {
    try {

    if (mediaId === 'SIMULATED_AUDIO_ID') {

    console.log("🕵️ Simulation detected! Reading local file...");

    const filePath = path.join(process.cwd(), 'test_audio.mp3');

    return fs.readFileSync(filePath).toString('base64');

    } else {

      // A. Get the URL
      const urlRes = await fetch(`${this.baseUrl}/${mediaId}`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      const urlData = await urlRes.json() as { url?: string };
      
      if (!urlData.url) throw new Error("No URL found for media");

      // B. Download the Binary
      const fileRes = await fetch(urlData.url, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      
      const arrayBuffer = await fileRes.arrayBuffer();
      return Buffer.from(arrayBuffer).toString('base64');
    }
    } catch (error) {
      console.error("❌ Download Failed:", error);
      return null;
    }
  }

  // 2. Upload PDF to WhatsApp
  async uploadMedia(filePath: string): Promise<string | null> {
    const form = new FormData();
    form.append('messaging_product', 'whatsapp');
    form.append('file', fs.createReadStream(filePath));
    form.append('type', 'application/pdf');

    try {
      const res = await fetch(`${this.baseUrl}/${this.phoneId}/media`, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'Authorization': `Bearer ${this.token}`,
          ...form.getHeaders()
        }
      });

      const data = await res.json() as { id?: string };
      return data.id || null;
    
    } catch (error) {
      console.error("❌ Upload Failed:", error);
      return null;
    }
  }

  // 3. Send the Document Message
  async sendDocument(to: string, mediaId: string, caption: string): Promise<boolean> {
    const payload = {
      messaging_product: "whatsapp",
      to: to,
      type: "document",
      document: {
        id: mediaId,
        filename: "invoice.pdf",
        caption: caption
      }
    };

    try {
      const res = await fetch(`${this.baseUrl}/${this.phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json() as { messages?: { id: string }[] };
      return !!data.messages?.[0]?.id;
    } catch (error) {
      console.error("❌ Send Failed:", error);
      return false;
    }
  }
}

// Export a singleton instance
export const whatsappService = new WhatsappService();