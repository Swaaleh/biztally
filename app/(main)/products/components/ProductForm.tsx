// app/(main)/products/components/ProductForm.tsx
'use client';
import { useState } from 'react';
import { ValidationErrors, validateProduct } from '@/app/_utils/helpers';
import { ProductInsert } from './types';

interface ProductFormProps {
  onCreate: (product: ProductInsert) => Promise<void>;
  loading: boolean;
  errors: ValidationErrors;
  setErrors: (errors: ValidationErrors) => void;
}

export default function ProductForm({ onCreate, loading, errors, setErrors }: ProductFormProps) {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { valid, errors: validationErrors } = validateProduct(newProduct);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }
    setErrors({ name: '', price: '', stock: '' });
    await onCreate({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock, 10),
    });
    setNewProduct({ name: '', price: '', stock: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        className="bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
}
