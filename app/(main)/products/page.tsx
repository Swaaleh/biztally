import { createClient } from '@/app/_utils/supabase/server';
import { Database } from '@/app/_utils/supabase/db-types';
import ProductsClientPage from './components/ProductsClientPage';

type Product = Database['public']['Tables']['products']['Row'];

export default async function ProductsPage() {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, stock')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return <div>Error fetching products.</div>;
  }

  return <ProductsClientPage initialProducts={products} />;
}