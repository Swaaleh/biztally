// app/(main)/products/components/types.ts
import { Database } from '@/app/_utils/supabase/db-types';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
