import { createClient } from "./_utils/supabase-server";
import { redirect } from "next/navigation";


export default function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-2 text-lg">Welcome back, {user.email}!</p>
      <p>This is your personalized dashboard content area</p>
    </main>
  );
}
