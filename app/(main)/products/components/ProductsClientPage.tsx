// app/(main)/products/components/ProductsClientPage.tsx
'use client';
import { useState, useReducer } from 'react';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/app/(main)/products/actions';
import { Database } from '@/app/_utils/supabase/db-types';
import { currencyFormatter, validateProduct, ValidationErrors } from '@/app/_utils/helpers';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

interface ProductsClientPageProps {
  initialProducts: Product[];
}

// State management reducer
type ProductAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string };

function productReducer(state: Product[], action: ProductAction): Product[] {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return action.payload;
    case 'ADD_PRODUCT':
      return [action.payload, ...state];
    case 'UPDATE_PRODUCT':
      return state.map(product => 
        product.id === action.payload.id ? action.payload : product
      );
    case 'DELETE_PRODUCT':
      return state.filter(product => product.id !== action.payload);
    default:
      return state;
  }
}

export default function ProductsClientPage({ initialProducts }: ProductsClientPageProps) {
  const [products, dispatch] = useReducer(productReducer, initialProducts);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({ name: '', price: '', stock: '' });

  const [editingProduct, setEditingProduct] = useState<{
    id: string;
    name: string;
    price: string;
    stock: string;
  } | null>(null);
  const [editErrors, setEditErrors] = useState<ValidationErrors>({ name: '', price: '', stock: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

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
    const { data, error } = await createProduct(productData);

    if (error) {
      setGeneralError(error);
    } else if (data) {
      dispatch({ type: 'ADD_PRODUCT', payload: data });
      setNewProduct({ name: '', price: '', stock: '' });
    }
    setAddLoading(false);
  };

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

    const updatedData: ProductUpdate = {
      name: editingProduct.name,
      price: parseFloat(editingProduct.price),
      stock: parseInt(editingProduct.stock, 10),
    };
    const { data, error } = await updateProduct(editingProduct.id, updatedData);

    if (error) {
      setGeneralError(error);
    } else if (data) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: data });
      setEditingProduct(null);
    }
    setUpdateLoading(false);
  };

  const handleDelete = async (productId: string) => {
    setGeneralError(null);
    setDeletingId(productId);
    const { error } = await deleteProduct(productId);
    if (error) {
      setGeneralError(error);
    } else {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    }
    setDeletingId(null);
  };

  return (
    <div className="mx-auto p-6 max-w-7xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Products</h1>

      {generalError && (
        <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-200">{generalError}</p>
        </div>
      )}

      {/* CREATE FORM */}
      <div className="mb-8 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Add New Product</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="product-name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Name
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className={`w-full p-2 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-price" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Price
              </label>
              <input
                id="product-price"
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                step="0.01"
                min="0"
                className={`w-full p-2 rounded-md border ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
            </div>
            
            <div>
              <label htmlFor="product-stock" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Stock
              </label>
              <input
                id="product-stock"
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                min="0"
                className={`w-full p-2 rounded-md border ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stock}</p>}
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-primary text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 hover:bg-primary/90 disabled:opacity-50"
            disabled={addLoading}
          >
            {addLoading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="overflow-x-auto rounded-lg bg-white dark:bg-gray-800 shadow-md">
  <table className="min-w-full">
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Name
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Price
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Stock
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
      {products.length === 0 ? (
        <tr>
          <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            No products found.
          </td>
        </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.price !== null && product.price !== undefined
                      ? currencyFormatter.format(product.price)
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() =>
                        setEditingProduct({
                          id: product.id,
                          name: product.name ?? '',
                          price: product.price?.toString() ?? '',
                          stock: product.stock?.toString() ?? '',
                        })
                      }
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      disabled={deletingId === product.id}
                    >
                      {deletingId === product.id ? 'Deleting...' : 'Delete'}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Edit Product</h2>
            
            {generalError && (
              <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20">
                <p className="text-red-800 dark:text-red-200">{generalError}</p>
              </div>
            )}
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className={`w-full p-2 rounded-md border ${editErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {editErrors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editErrors.name}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-price" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Price
                  </label>
                  <input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className={`w-full p-2 rounded-md border ${editErrors.price ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {editErrors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editErrors.price}</p>}
                </div>
                
                <div>
                  <label htmlFor="edit-stock" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Stock
                  </label>
                  <input
                    id="edit-stock"
                    type="number"
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className={`w-full p-2 rounded-md border ${editErrors.stock ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {editErrors.stock && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editErrors.stock}</p>}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 hover:bg-primary/90 disabled:opacity-50"
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