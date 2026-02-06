// workers/invoice.worker.ts
import { Worker } from "bullmq";
import IORedis from "ioredis";

import prisma from "@/lib/db";

import { VoiceJobData } from "@/types/worker";
import { whatsappService } from "@/services/whatsapp.service";
import { productService } from "@/services/products.service";
import { CatalogItem } from "@/types/catelog";
import { aiService } from "@/services/ai.service";
import { invoiceService } from "@/services/invoice.service";
import fs from "fs";


const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

new Worker<VoiceJobData>(
  "voice-processing",
  async (job) => {
    try {
    const { messageId, audioUrl, userId, phone } = job.data;

    console.log("🎙 Processing:", messageId);

    // ✅ 1. Idempotency
    const already = await prisma.processedMessage.findUnique({
    where: { id: messageId }
  });

    if (already) return;

    // ✅ 2. Download audio
    const audioBuffer = await whatsappService.downloadAudio(audioUrl);
    console.log("Audio downloaded");


    // (after ffmpeg clean in future)
    const audioBase64 = audioBuffer.toString("base64");

    // ✅ 3. Get normalized catalog
    const catalog: CatalogItem[] = await productService.getCatalog(userId);

    // ✅ 4. AI — Speech → Text
    const text = await aiService.speechToText(audioBase64);

    // ✅ 5. AI — Text → Items
    const { customer_name, items } =
      await aiService.extractItemsFromText(
        text,
        catalog.map((c) => ({ name: c.name, price: c.price } as any))
      );

    if (items.length === 0) {
      throw new Error("No items extracted");
    }

    // ✅ 6. Validate & attach price
    const validatedItems = invoiceService.validateItems(items, catalog);

    // ✅ 7. Calculate totals
    const calculations = invoiceService.calculate(validatedItems);

    // ✅ 8. Save invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: calculations.invoiceNum,
        customerName: customer_name ?? "Cash Customer",
        totalAmount: calculations.grandTotal,
        status: "PAID",
        items: validatedItems,
        userId,
      },
    });

    // ✅ 9. Generate PDF
    const pdfBuffer = await invoiceService.generatePDF(
      invoice.customerName,
      calculations
    );

    // download
    fs.writeFileSync("invoice.pdf", pdfBuffer);



    // ✅ 10. Send to WhatsApp
    // await whatsappService.sendInvoicePDF(
    //   phone,
    //   pdfBuffer,
    //   `Invoice ${invoice.invoiceNumber}`
    // );

    // ✅ 11. Mark processed
    await prisma.processedMessage.create({
      data: { id: messageId },
    });

    console.log("✅ Done:", invoice.invoiceNumber);
  } catch (error){
    console.error("❌ Error:", error);
  }
  },
  { connection }
);

console.log("🟢 Worker running");
