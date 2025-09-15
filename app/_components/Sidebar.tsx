// _components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  UserGroupIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Sales', href: '/sales', icon: ShoppingCartIcon },
    { name: 'Products', href: '/products', icon: ChartBarIcon },
    { name: 'Customers', href: '/customers', icon: UserGroupIcon },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0 bg-gray-800 dark:bg-gray-800">
      <div className="h-full overflow-y-auto px-3 py-4">
      <div className="flex items-center justify-between mb-6 px-4">
          <h1 className="text-xl font-bold text-white">Biztally</h1>
          <ThemeToggle />
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center rounded-lg p-2 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}