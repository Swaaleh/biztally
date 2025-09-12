'use server';

import { createClient } from '@/app/_utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error);
    return { error: 'Invalid credentials. Please try again.' };
  }

  // Redirect to dashboard on successful login
  return redirect('/');
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error);
    // You can handle this error, but for a simple logout, it's often not needed.
  }

  // Redirect to login page after signing out
  return redirect('/login');
}