import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const { phone } = await req.json();

  await prisma.user.update({
    where: { clerkUserId: userId! },
    data: { phone },
  });

  return NextResponse.json({ ok: true });
}
