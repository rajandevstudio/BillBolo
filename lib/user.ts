import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function ensureUser(phone?: string) {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  let user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: clerkUser.firstName ?? "",
        phone: phone ?? "", // filled later by user
      },
    });
  }

  return user;
}



export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;

}

export async function updatePhone(userId: string, phone: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { phone },
  });
  return user;
}