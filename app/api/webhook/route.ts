export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/db";
import { aiService } from "@/services/ai.service";
import { invoiceService } from "@/services/invoice.service";
import { whatsappService } from '@/services/whatsapp.service';
import { voiceQueue } from '@/queue/queue';

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
      return new NextResponse("No Audio", { status: 200 });
    }

    const messageId = message.id;
    const audioUrl = message.audio.id;
    const from = message.from; // WhatsApp sender number

    // 🔥 Find shopkeeper by phone
    const user = await prisma.user.findUnique({
      where: { phone: from },
    });

    if (!user) {
      console.log("❌ Unknown number:", from);
      return new NextResponse("Unknown number", { status: 200 });
    }

    await voiceQueue.add("process-voice", {
      messageId,
      audioUrl,
      userId: user.id,
      phone: from,
    });

    return new NextResponse("Queued", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
