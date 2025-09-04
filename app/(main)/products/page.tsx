// app/(main)/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/_utils/supabase';

// Define the Product interface to ensure type safety
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch products from the database
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      setError('Error fetching products.');
      console.error(error);
      setProducts([]);
    } else {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  // Fetch data on initial component load
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- CRUD Functions ---

  // CREATE: Add a new product
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('products')
      .insert([
        {
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
        },
      ]);
    if (error) {
      setError('Error creating product.');
      console.error(error);
    } else {
      setNewProduct({ name: '', price: '', stock: '' }); // Clear the form
      fetchProducts(); // Refresh the list
    }
    setLoading(false);
  };

  // DELETE: Delete a product
  const handleDelete = async (productId: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    if (error) {
      setError('Error deleting product.');
      console.error(error);
    } else {
      fetchProducts(); // Refresh the list
    }
    setLoading(false);
  };

  // --- Render the UI ---

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>

      {/* CREATE: Form to add a new product */}
      <div className="mb-8 rounded-lg bg-gray-100 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Add New Product</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full rounded-md border p-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            step="0.01"
            className="w-full rounded-md border p-2"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="w-full rounded-md border p-2"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* READ: Products Table */}
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
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}