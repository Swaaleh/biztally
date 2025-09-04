'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/_utils/supabase';
import { Database } from '@/app/_utils/supabase/db-types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [productsLoading, setProductsLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', price: '', stock: '' });
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Fetch products from the database
  const fetchProducts = async () => {
    setProductsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, stock')
      .order('id', { ascending: false });

    if (error) {
      setGeneralError('Error fetching products.');
      console.error(error);
      setProducts([]);
    } else {
      setProducts(data);
      setGeneralError(null);
    }
    setProductsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // CREATE: Add a new product
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setErrors({ name: '', price: '', stock: '' });

    const { name, price, stock } = newProduct;
    let hasError = false;

    // Validation
    if (!name) {
      setErrors((prev) => ({ ...prev, name: 'Product name is required.' }));
      hasError = true;
    }
    if (!price || parseFloat(price) <= 0) {
      setErrors((prev) => ({ ...prev, price: 'Price must be a positive number.' }));
      hasError = true;
    }
    if (!stock || parseInt(stock) < 0) {
      setErrors((prev) => ({ ...prev, stock: 'Stock cannot be negative.' }));
      hasError = true;
    }
    if (hasError) return;

    setAddLoading(true);
    const productData: ProductInsert = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
    };

    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select('*');

    if (error) {
      setGeneralError(error.message || 'Error creating product.');
      console.error(error);
    } else if (data && data.length > 0) {
      setProducts((prev) => [data[0], ...prev]);
      setNewProduct({ name: '', price: '', stock: '' });
      setGeneralError(null);
    }
    setAddLoading(false);
  };

  // DELETE: Delete a product
  const handleDelete = async (productId: string) => {
    const originalProducts = products;
    setProducts(products.filter(p => p.id !== productId));

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      setGeneralError('Error deleting product.');
      console.error(error);
      setProducts(originalProducts);
    } else {
      setGeneralError(null);
    }
  };

  if (productsLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-300">Products</h1>

      <div className="mb-8 rounded-lg bg-gray-100 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Add New Product</h2>
        {generalError && <p className="mb-4 text-center text-red-500">{generalError}</p>}
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className={`w-full rounded-md border p-2 text-gray-900 ${
                errors.name ? 'border-red-500' : ''
              }`}
              aria-label="Product Name"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div>
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              step="0.01"
              className={`w-full rounded-md border p-2 text-gray-900 ${
                errors.price ? 'border-red-500' : ''
              }`}
              aria-label="Price"
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
          </div>
          <div>
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              className={`w-full rounded-md border p-2 text-gray-900 ${
                errors.stock ? 'border-red-500' : ''
              }`}
              aria-label="Stock"
            />
            {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            disabled={addLoading}
          >
            {addLoading ? 'Adding...' : 'Add Product'}
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
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2 text-gray-900">{product.name}</td>
                  <td className="border-b px-4 py-2 text-gray-900">
                    {product.price !== null && product.price !== undefined
                      ? `${currencyFormatter.format(product.price)}`
                      : 'N/A'}
                  </td>
                  <td className="border-b px-4 py-2 text-gray-900">{product.stock}</td>
                  <td className="border-b px-4 py-2">
                    <button className="mr-2 text-blue-600 hover:text-blue-800" disabled>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}