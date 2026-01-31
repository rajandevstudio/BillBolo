// services/product.service.ts
import prisma from "@/lib/db";
import { Product } from "@prisma/client"; // <--- Auto-generated Type

export class ProductService {
  
  // 1. Get All Products
  async getProducts(userId: string): Promise<Product[]> {
    return await prisma.product.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    });
  }

  // 2. Add Product
  async addProduct(userId: string, name: string, price: number): Promise<void> {
    if (!name || price < 0) throw new Error("Invalid product data");
    
    await prisma.product.create({
      data: {
        name,
        price,
        userId
      }
    });
  }

  // 3. Delete Product
  async deleteProduct(userId: string, productId: string): Promise<void> {
    await prisma.product.deleteMany({
      where: {
        id: productId,
        userId // Security: User can only delete their own items
      }
    });
  }
}

export const productService = new ProductService();