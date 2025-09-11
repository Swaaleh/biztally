'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/_utils/supabase/client';
import { Database } from '@/app/_utils/supabase/db-types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];


const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

interface ValidationErrors {
  name: string;
  price: string;
  stock: string;
}

// Shared validation
function validateProduct(product: { name: string; price: string; stock: string }) {
  const errors: ValidationErrors = { name: '', price: '', stock: '' };
  let valid = true;

  if (!product.name.trim()) {
    errors.name = 'Product name is required.';
    valid = false;
  }
  if (!product.price || parseFloat(product.price) <= 0) {
    errors.price = 'Price must be a positive number.';
    valid = false;
  }
  if (product.stock === '' || parseInt(product.stock, 10) < 0) {
    errors.stock = 'Stock cannot be negative.';
    valid = false;
  }

  return { valid, errors };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // CREATE form state
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({ name: '', price: '', stock: '' });

  // EDIT modal state
  const [editingProduct, setEditingProduct] = useState<{
    id: string;
    name: string;
    price: string;
    stock: string;
  } | null>(null);
  const [editErrors, setEditErrors] = useState<ValidationErrors>({ name: '', price: '', stock: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  const supabase = createClient();
  // Fetch products
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

  // CREATE
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const { valid, errors } = validateProduct(newProduct);
    if (!valid) {
      setErrors(errors);
      return;
    }
    setErrors({ name: '', price: '', stock: '' });

    setAddLoading(true);
    const productData: ProductInsert = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock, 10),
    };

    const { data, error } = await supabase.from('products').insert(productData).select('*');

    if (error) {
      setGeneralError(error.message || 'Error creating product.');
      console.error(error);
    } else if (data && data.length > 0) {
      setProducts((prev) => [data[0], ...prev]);
      setNewProduct({ name: '', price: '', stock: '' });
    }
    setAddLoading(false);
  };

  // UPDATE
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const { valid, errors } = validateProduct(editingProduct);
    if (!valid) {
      setEditErrors(errors);
      return;
    }
    setEditErrors({ name: '', price: '', stock: '' });

    setUpdateLoading(true);
    const { data, error } = await supabase
      .from('products')
      .update({
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock, 10),
      })
      .eq('id', editingProduct.id)
      .select('*');

    if (error) {
      setGeneralError(error.message || 'Error updating product.');
      console.error(error);
    } else if (Array.isArray(data) && data.length > 0) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? data[0] : p))
      );
      setEditingProduct(null);
    }
    setUpdateLoading(false);
  };

  // DELETE
  const handleDelete = async (productId: string) => {
    const originalProducts = products;
    setProducts(products.filter((p) => p.id !== productId));

    const { error } = await supabase.from('products').delete().eq('id', productId);

    if (error) {
      setGeneralError(error.message || 'Error deleting product.');
      console.error(error);
      setProducts(originalProducts);
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

      {/* CREATE */}
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
              className={`w-full rounded-md border p-2 text-gray-900 ${errors.name ? 'border-red-500' : ''}`}
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
              className={`w-full rounded-md border p-2 text-gray-900 ${errors.price ? 'border-red-500' : ''}`}
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
          </div>
          <div>
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              className={`w-full rounded-md border p-2 text-gray-900 ${errors.stock ? 'border-red-500' : ''}`}
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

      {/* READ */}
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
                      ? currencyFormatter.format(product.price)
                      : 'N/A'}
                  </td>
                  <td className="border-b px-4 py-2 text-gray-900">{product.stock}</td>
                  <td className="border-b px-4 py-2">
                    <button
                      onClick={() =>
                        setEditingProduct({
                          id: product.id,
                          name: product.name ?? '',
                          price: product.price?.toString() ?? '',
                          stock: product.stock?.toString() ?? '',
                        })
                      }
                      className="mr-2 text-blue-600 hover:text-blue-800"
                    >
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

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">Edit Product</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className={`w-full rounded-md border p-2 text-gray-900 ${editErrors.name ? 'border-red-500' : ''}`}
                />
                {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
              </div>
              <div>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className={`w-full rounded-md border p-2 text-gray-900 ${editErrors.price ? 'border-red-500' : ''}`}
                />
                {editErrors.price && <p className="text-sm text-red-500">{editErrors.price}</p>}
              </div>
              <div>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                  className={`w-full rounded-md border p-2 text-gray-900 ${editErrors.stock ? 'border-red-500' : ''}`}
                />
                {editErrors.stock && <p className="text-sm text-red-500">{editErrors.stock}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
