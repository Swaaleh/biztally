import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0">
      <div className="h-full overflow-y-auto bg-gray-800 px-3 py-4 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center rounded-lg p-2 text-white hover:bg-gray-700"
            >
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/sales"
              className="flex items-center rounded-lg p-2 text-white hover:bg-gray-700"
            >
              <span className="ml-3">Sales</span>
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className="flex items-center rounded-lg p-2 text-white hover:bg-gray-700"
            >
              <span className="ml-3">Products</span>
            </Link>
          </li>
          <li>
            <Link
              href="/customers"
              className="flex items-center rounded-lg p-2 text-white hover:bg-gray-700"
            >
              <span className="ml-3">Customers</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}