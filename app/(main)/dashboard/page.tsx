// app/(main)/dashboard/page.tsx
import { createClient } from '@/app/_utils/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="text-red-500">User not authenticated.</div>;
  }

  // Fetch all data in parallel
  const [
    { count: totalProducts },
    { count: totalCustomers },
    { data: salesData },
    { data: salesItems }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('sales').select('total_amount'),
    supabase.from('sales_items').select('product_id, quantity, products(name)')
  ]);

  // Calculate total revenue
  const totalRevenue = salesData?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;

  // Calculate top selling product
  let topSellingProduct = 'N/A';
  if (salesItems) {
    const productSales: Record<string, number> = {};
    
    salesItems.forEach(item => {
      const productName = (item.products as { name: string })?.name || 'Unknown';
      productSales[productName] = (productSales[productName] || 0) + (item.quantity || 0);
    });

    // Find the product with the highest total quantity
    let maxQuantity = 0;
    for (const [product, quantity] of Object.entries(productSales)) {
      if (quantity > maxQuantity) {
        maxQuantity = quantity;
        topSellingProduct = product;
      }
    }
  }

  return (
    <div className="flex flex-col">
      <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
      <p className="mt-2 text-lg mb-4 text-gray-600 dark:text-gray-300">
        Welcome back, {user.email}! Here's your business summary.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Revenue</h2>
          <p className="text-3xl font-bold text-blue-600">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Products</h2>
          <p className="text-3xl font-bold text-blue-600">{totalProducts || 0}</p>
        </div>
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Customers</h2>
          <p className="text-3xl font-bold text-blue-600">{totalCustomers || 0}</p>
        </div>
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Top Selling Product</h2>
          <p className="text-3xl font-bold text-green-600">{topSellingProduct}</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Recent Activity</h2>
        <p className="text-gray-600 dark:text-gray-400">Placeholder for recent sales, new orders, etc.</p>
      </div>
    </div>
  );
}