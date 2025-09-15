// app/(main)/products/components/ProductEditModal.tsx
'use client';
import { ValidationErrors, validateProduct } from '@/app/_utils/helpers';
import { ProductUpdate } from './types';
import { useState } from 'react';

interface ProductEditModalProps {
  editingProduct: {
    id: string;
    name: string;
    price: string;
    stock: string;
  } | null;
  onUpdate: (product: ProductUpdate) => Promise<void>;
  onClose: () => void;
  loading: boolean;
  errors: ValidationErrors;
  setErrors: (errors: ValidationErrors) => void;
}

export default function ProductEditModal({ editingProduct, onUpdate, onClose, loading, errors, setErrors }: ProductEditModalProps) {
  const [localProduct, setLocalProduct] = useState(editingProduct);

  if (!editingProduct) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localProduct) return;
    const { valid, errors: validationErrors } = validateProduct(localProduct);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }
    setErrors({ name: '', price: '', stock: '' });
    await onUpdate({
      id: localProduct.id,
      name: localProduct.name,
      price: parseFloat(localProduct.price),
      stock: parseInt(localProduct.stock, 10),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg border border-border-color">
        <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
            <input
              id="edit-name"
              type="text"
              value={localProduct?.name ?? ''}
              onChange={(e) => setLocalProduct({ ...localProduct!, name: e.target.value })}
              className={`w-full p-2 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-price" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
              <input
                id="edit-price"
                type="number"
                step="0.01"
                min="0"
                value={localProduct?.price ?? ''}
                onChange={(e) => setLocalProduct({ ...localProduct!, price: e.target.value })}
                className={`w-full p-2 rounded-md border ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
            </div>
            <div>
              <label htmlFor="edit-stock" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
              <input
                id="edit-stock"
                type="number"
                min="0"
                value={localProduct?.stock ?? ''}
                onChange={(e) => setLocalProduct({ ...localProduct!, stock: e.target.value })}
                className={`w-full p-2 rounded-md border ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stock}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
