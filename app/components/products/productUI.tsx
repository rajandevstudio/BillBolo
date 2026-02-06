"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addProduct, deleteProduct } from "@/app/actions";
import { Product } from "@prisma/client";
import Pagination from "../ui/Pagination";

export default function ProductsUI({
  products,
  page,
  totalPages,
  search: initialSearch,
}: {
  products: Product[];
  page: number;
  totalPages: number;
  search: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();

      if (search) params.set("search", search);
      params.set("page", "1");

      router.push(`/products?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, router]);

  const exportCSV = () => {
    const rows = products.map((p) => `${p.name},${p.price}`).join("\n");
    const blob = new Blob([`name,price\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (ev) => {
      const text = ev.target?.result;
      if (typeof text !== "string") return;

      const rows = text.split("\n").slice(1); // skip header

      for (const row of rows) {
        if (!row.trim()) continue;

        const [rawName, rawPrice] = row.split(",");

        const name = rawName?.trim();
        const price = Number(rawPrice?.trim());

        if (!name || isNaN(price)) continue;

        try {
          await addProduct({
            name,
            price,
          } as any);
        } catch (err) {
          console.error("Import error for:", name);
        }
      }

      alert("Products imported successfully!");
      window.location.reload();
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">
            Product Catalog
          </h1>
          <p className="text-gray-600 mt-2">
            This is how BillBolo learns your shop items.
          </p>
        </div>

        {/* Tools */}
        <div className="bg-white p-4 rounded-xl shadow border mb-6 md:mb-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full sm:w-72"
          />

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={exportCSV}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg w-full sm:w-auto"
            >
              Export CSV
            </button>

            <label className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg cursor-pointer text-center w-full sm:w-auto">
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                hidden
              />
            </label>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {/* Add Product */}
          <div className="bg-white p-8 rounded-2xl shadow border h-fit">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Add New Item
            </h2>

            <form action={addProduct} className="space-y-4">
              <input
                name="name"
                placeholder="Item name"
                required
                className="w-full border px-4 py-3 rounded-lg"
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                required
                className="w-full border px-4 py-3 rounded-lg"
              />

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
                Save Item
              </button>
            </form>
          </div>

          {/* Products */}
          <div className="md:col-span-2 space-y-3 md:space-y-4">
            {products.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl shadow border text-center text-gray-400">
                No products found.
              </div>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-4 md:p-6 rounded-xl shadow border flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-gray-600">₹{p.price}</p>
                  </div>

                  <form action={deleteProduct.bind(null, p.id)}>
                    <button className="text-red-500">Delete</button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/products"
          search={search}
        />
      </div>
    </div>
  );
}
