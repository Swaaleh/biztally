import { useState } from "react";
import { logout } from "@/app/(main)/actions";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    // No need to manually redirect; the server action handles it.
  };

  return (
    <form onSubmit={handleLogout}>
    <button
      type="submit"
      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500"
      disabled={loading}
    >
      {loading ? "Logging out..." : "Log Out"}
    </button>
    </form>
  );
}
// Compare this snippet from app/%28main%29/actions.ts:
// 'use server';
//
// import { createClient } from '@/app/_utils/supabase/server';
// import { redirect } from 'next/navigation';
//
// export async function fetchUser() {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   return user;
// }
//
// export async function logout() {
//   const supabase = await createClient();     
//   const { error } = await supabase.auth.signOut();
//
//   if (error) {
//     console.error('Logout error:', error);
//     // You can handle this error, but for a simple logout, it's often not needed.
//   }