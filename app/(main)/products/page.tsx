// app/(main)/products/page.tsx
import { createClient } from '@/app/_utils/supabase-server';

// 1. Define the Product interface
interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
  }

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .returns<Product[]>();

  if (error) {
    console.error('Error fetching products:', error);
    return <div>Error loading products.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-md bg-white shadow-md">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left text-gray-700">Name</th>
              <th className="border-b px-4 py-2 text-left text-gray-700">Price</th>
              <th className="border-b px-4 py-2 text-left text-gray-700">Stock</th>
              <th className="border-b px-4 py-2 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2">{product.name}</td>
                <td className="border-b px-4 py-2">${product.price.toFixed(2)}</td>
                <td className="border-b px-4 py-2">{product.stock}</td>
                <td className="border-b px-4 py-2">
                  <button className="mr-2 text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}