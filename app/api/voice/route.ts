import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { voiceQueue } from "@/queue/queue";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("audio") as File;

    if (!file) {
      return new NextResponse("No audio file provided", { status: 400 });
    }

    // Get user details (phone is needed for the worker to send the invoice back)
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }, // Assuming Clerk ID maps to User ID
    });

    if (!user || !user.phone) {
      return new NextResponse("User not found or phone missing", { status: 404 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString("base64");
    
    // Generate a unique ID for this web upload
    const messageId = `web-${crypto.randomUUID()}`;

    await voiceQueue.add("voice-processing", {
      messageId,
      audioUrl: "DIRECT_UPLOAD",
      userId: user.id,
      phone: user.phone,
      directAudioBase64: base64Audio,
    } as any);

    return NextResponse.json({ success: true, messageId });
  } catch (error) {
    console.error("Upload error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}