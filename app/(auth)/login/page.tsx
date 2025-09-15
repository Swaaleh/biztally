// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { login } from '@/app/(auth)/actions';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-primary dark:bg-gray-800 p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl text-primary dark:text-white font-bold">Biztally</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-primary dark:text-gray-300">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full rounded-md border border-border-color px-3 py-2 focus:border-primary focus:outline-none bg-primary dark:bg-gray-700 text-primary dark:text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-primary dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full rounded-md border border-border-color px-3 py-2 focus:border-primary focus:outline-none bg-primary dark:bg-gray-700 text-primary dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary py-2 text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}