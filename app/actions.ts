'use server';

import { productService } from "@/services/products.service";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return;

  const name = formData.get("name")?.toString();
  const priceString = formData.get("price")?.toString();

  // Basic Validation
  if (!name || !priceString) return;

  const price = parseFloat(priceString);
  
  await productService.addProduct(userId, name, price);
  revalidatePath("/dashboard/products");
}

export async function deleteProduct(productId: string) {
  const { userId } = await auth();
  if (!userId) return;

  await productService.deleteProduct(userId, productId);
  revalidatePath("/dashboard/products");
}