import { ensureUser } from "@/lib/user";
import ProductsUI from "@/app/components/products/productUI";
import { productService } from "@/services/products.service";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const user = await ensureUser();
  const userId = user?.id;
  if (!userId) return;

  const { page: pageParam, search: searchParam } = await searchParams;
  const search = searchParam || "";
  const page = Number(pageParam) || 1;
  const PAGE_SIZE = 2;
  // const skip = (page - 1) * PAGE_SIZE;

  const { products, total } =
  await productService.getProductsPaginated(userId, page, search, PAGE_SIZE);


  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <ProductsUI products={products} page={page} totalPages={totalPages} search={search} />
  );
}
