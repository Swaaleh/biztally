//app/(main)/dashboard/components/LogoutButton.tsx
'use client';
import { useState } from "react";
import { logout } from "@/app/(auth)/actions";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/50 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "Logging out..." : "Log Out"}
    </button>
  );
}