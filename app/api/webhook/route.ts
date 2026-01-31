export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/db";
import { aiService } from "@/services/ai.service";
import { invoiceService } from "@/services/invoice.service";
import { whatsappService } from '@/services/whatsapp.service';

export const dynamic = 'force-dynamic'; // Required for Next.js Webhooks

// 1. WhatsApp Verification (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

// 2. Main Logic (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message?.audio) {
      return new NextResponse('No Audio', { status: 200 }); // 200 OK prevents WhatsApp retries
    }

    console.log("📨 Processing Voice Note...");

    // A. Download Audio
    const audioBase64 = await whatsappService.downloadMedia(message.audio.id);
    if (!audioBase64) throw new Error("Failed to download audio");

    // B. AI Extraction
    const extraction = await aiService.extractInvoiceDetails(audioBase64);

    // C. Calculation & Logic
    const calculation = invoiceService.calculate(extraction.items);

    // D. Save to Database (Prisma)
    // NOTE: In production, fetch the correct userId based on the phone number
    const DEFAULT_USER_ID = process.env.DEFAULT_OWNER_ID || "user_placeholder"; 

    await prisma.invoice.create({
      data: {
        invoiceNumber: calculation.invoiceNum,
        customerName: extraction.customer_name || "Cash Customer",
        customerPhone: message.from,
        totalAmount: calculation.grandTotal,
        status: "PAID",
        items: JSON.stringify(calculation.items),
        userId: DEFAULT_USER_ID
      }
    });

    // E. Generate & Send PDF
    const pdfPath = await invoiceService.generatePDF(
      { customerName: extraction.customer_name || "Cash Customer" },
      calculation
    );

    const mediaId = await whatsappService.uploadMedia(pdfPath);
    if (mediaId) {
      await whatsappService.sendDocument(message.from, mediaId, "Here is your invoice! 🧾");
    }

    return new NextResponse('Success', { status: 200 });

  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}