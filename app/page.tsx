// app/page.tsx
import { createClient } from '@/app/_utils/supabase/server';
import { redirect } from 'next/navigation';

// Data types for our sales data
interface SalesItem {
  quantity: number;
  unit_price: number;
  products: {
    name: string;
  };
}

// This is our Server Component for the Dashboard page
export default async function HomePage() {
  // Use our server-side Supabase client to fetch data securely
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch sales data from Supabase
  const { data: metrics, error } = await supabase
    .rpc('get_dashboard_metrics');

  // Handle any errors during data fetching
  if (error) {
    console.error('Error fetching sales data:', error);
    return <div className="text-red-500">Error fetching data.</div>;
  }

  // --- Calculations for our Dashboard Metrics ---

  // Calculate total revenue from all sales
  const totalRevenue = metrics?.[0]?.total_revenue ?? 0;

  // Calculate top-selling products
  // const productSales: { [key: string]: number } = {};
  // sales.forEach((sale) => {
  //   sale.sales_items.forEach((item: SalesItem) => {
  //     const productName = item.products.name;
  //     const totalSold = item.quantity;
  //     productSales[productName] = (productSales[productName] || 0) + totalSold;
  //   });
  // });

  // const sortedProducts = Object.entries(productSales).sort(
  //   ([, a], [, b]) => b - a,
  // );
  const topSellingProduct = metrics?.[0]?.top_selling_product || 'N/A';

  return (
    <main>
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-2 text-lg text-gray-600">
        Welcome back, {user.email}! Here's your business summary.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue Card */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-medium text-gray-500">Total Revenue</h2>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>

        {/* Top Selling Product Card */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-medium text-gray-500">
            Top Selling Product
          </h2>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {topSellingProduct}
          </p>
        </div>
      </div>
    </main>
  );
}