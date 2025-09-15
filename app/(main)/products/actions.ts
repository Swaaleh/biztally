//app/(main)/products/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/app/_utils/supabase/server';
import { Database } from '@/app/_utils/supabase/db-types';

type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export async function createProduct(productData: ProductInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error creating product:', error);
    }
    return { error: error.message || 'Failed to create product.' };
  }

  // Revalidate the products page to show the new product
  revalidatePath('/products');

  return { data };
}

export async function updateProduct(id: string, updatedData: ProductUpdate) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .update(updatedData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error updating product:', error);
    }
    return { error: error.message || 'Failed to update product.' };
  }

  revalidatePath('/products');

  return { data };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error deleting product:', error);
    }
    return { error: error.message || 'Failed to delete product.' };
  }

  revalidatePath('/products');

  return { success: true };
}