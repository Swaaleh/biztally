// src/components/ThemeToggle.tsx
'use client';

import { useTheme } from '@/app/_components/ThemeProvider';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
  className="p-2 rounded-md bg-secondary dark:bg-gray-700 hover:bg-secondary/80 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
  <SunIcon className="h-5 w-5 text-yellow-500" />
      ) : (
  <MoonIcon className="h-5 w-5 text-primary" />
      )}
    </button>
  );
}