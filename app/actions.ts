'use server';

import { ensureUser } from "@/lib/user";
import { productService } from "@/services/products.service";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData | {name:string, price:string}) {
  const user = await ensureUser();
  const userId = user?.id;
  if (!userId) return;

  let name: string;
  let priceString: string;

  if (formData instanceof FormData) {
    name = formData.get("name")?.toString()!;
    priceString = formData.get("price")?.toString()!;
  } else {
    name = formData.name;
    priceString = formData.price;
  }

  // Basic Validation
  if (!name || !priceString) return;

  const price = parseFloat(priceString);
  
  await productService.addProduct(userId, name, price);
  revalidatePath("/dashboard/products");
}

export async function deleteProduct(productId: string) {
  const user = await ensureUser();
  const userId = user?.id;
  if (!userId) return;

  await productService.deleteProduct(userId, productId);
  revalidatePath("/dashboard/products");
}