// services/product.service.ts
import prisma from "@/lib/db";
import { CatalogItem } from "@/types/catelog";
import { Product } from "@prisma/client";

const DEFAULT_PAGE_SIZE = 5;

export class ProductService {
  /**
   * Normalize names for reliable AI matching
   */
  private normalize(name: string) {
    return name.trim().toLowerCase();
  }

  /**
   * Used by dashboard
   */

  async getProductsPaginated(
    userId: string,
    page: number,
    search?: string,
    pageSize: number = DEFAULT_PAGE_SIZE
  ) {
    const skip = (page - 1) * pageSize;

    const where = {
      userId,
      ...(search
        ? {
            name: {
              contains: search,
            },
          }
        : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      totalPages: Math.ceil(total / pageSize),
      total,
    };
  }



  /**
   * Used by worker (fast + minimal fields)
   */
  async getCatalog(userId: string): Promise<CatalogItem[]> {
    const products = await prisma.product.findMany({
      where: { userId },
      select: { id: true, name: true, price: true },
    });

    return products.map((p: Product): CatalogItem => ({
      id: p.id,
      name: p.name,
      price: p.price,
      normalized: this.normalize(p.name),
    }));
  }

  /**
   * Safe product creation
   */
  async addProduct(userId: string, name: string, price: number) {
    if (!name || price < 0) {
      throw new Error("Invalid product data");
    }

    await prisma.product.create({
      data: {
        name: name.trim(),
        price,
        userId,
      },
    });
  }

  /**
   * Secure delete
   */
  async deleteProduct(userId: string, productId: string) {
    await prisma.product.deleteMany({
      where: {
        id: productId,
        userId,
      },
    });
  }
}

export const productService = new ProductService();
