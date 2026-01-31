import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { productService } from "@/services/products.service";
import { addProduct, deleteProduct } from "@/app/actions";
import { Product } from "@prisma/client"; // <--- IMPORT THIS TYPE

export default async function ProductsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // Fetch using Service
  const products: Product[] = await productService.getProducts(userId);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Catalog 📦</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ADD PRODUCT FORM */}
        <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <form action={addProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input 
                name="name" 
                type="text" 
                placeholder="e.g., Samosa" 
                required 
                className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input 
                name="price" 
                type="number" 
                placeholder="15" 
                required 
                className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium transition">
              Save Item
            </button>
          </form>
        </div>

        {/* PRODUCT LIST */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-400">No products yet. Add one!</td></tr>
                ) : (
                  // FIX: Explicitly typing 'p' here solves your error, 
                  // though strict inference should handle it now.
                  products.map((p: Product) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                      <td className="px-6 py-4 text-right font-mono text-gray-600">₹{p.price}</td>
                      <td className="px-6 py-4 text-right">
                        <form action={deleteProduct.bind(null, p.id)}>
                          <button className="text-red-500 text-sm font-medium hover:text-red-700 hover:underline">
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}