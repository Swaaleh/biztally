// app/(auth)/actions.ts
'use server';

import { createClient } from '@/app/_utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Login error:', error);
    }
    return { error: error.message || 'Invalid credentials. Please try again.' };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Logout error:', error);
    }
    // Optionally return error to UI if needed
    return { error: error.message || 'Logout failed.' };
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}