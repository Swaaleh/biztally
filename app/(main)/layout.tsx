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

  if (!user) {
    redirect('/login');
  }

  return (
  <div className="flex min-h-screen bg-primary dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-0 sm:ml-64">
        <header className="bg-primary dark:bg-gray-800 shadow">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-primary dark:text-white">Biztally</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-secondary dark:text-gray-300">
                {user.email}
              </span>
              <LogoutButton />
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