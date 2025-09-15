// app/(main)/layout.tsx
import { redirect } from "next/navigation";
import Sidebar from "../_components/Sidebar";
import { createClient } from "../_utils/supabase/server";
import LogoutButton from "./dashboard/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Auth is handled by middleware. No redirect or check here.

  return (
  <div className="flex min-h-screen bg-primary dark:bg-gray-900">
    <Sidebar />
    <div className="flex flex-col flex-1 ml-0 sm:ml-64">
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-border-color sm:ml-64">
        <div className="flex items-center px-6 py-4 relative">
          {/* App name only on desktop */}
          <h1 className="text-2xl font-bold text-primary dark:text-white hidden sm:block">Biztally</h1>
          {/* Centered user email on mobile, right on desktop */}
          <div className="flex-1 flex justify-center sm:justify-end items-center">
            <span className="text-sm text-secondary dark:text-gray-300 truncate max-w-xs text-center sm:text-right">
              {user?.email}
            </span>
            <div className="ml-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
  );
}