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