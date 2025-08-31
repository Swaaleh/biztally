import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from './_components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Biztally',
  description: 'A simple sales tracker for small businesses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <main className="ml-64 w-full p-8">
            {/* The main content for each page will be rendered here */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}