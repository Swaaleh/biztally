// _components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  UserGroupIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Sales', href: '/sales', icon: ShoppingCartIcon },
    { name: 'Products', href: '/products', icon: ChartBarIcon },
    { name: 'Customers', href: '/customers', icon: UserGroupIcon },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 sm:hidden p-2 rounded-md bg-primary text-white shadow focus:outline-none"
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="sr-only">Toggle sidebar</span>
        {/* Hamburger icon */}
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 transition-transform bg-gray-900 dark:bg-gray-800 border-r border-border-color shadow-lg ${
          open ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto px-3 py-4">
          <div className="flex items-center justify-between mb-6 px-4">
            {/* Remove duplicate Biztally name from sidebar */}
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
                        ? 'bg-blue-600 text-white shadow'
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
      {/* Overlay for mobile sidebar */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}