import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { ClientProvider } from '@/components/providers/client-provider';
import { AuthProvider } from '@/components/providers/auth-provider';

// Initialize Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DistantDuo - Stay Connected Across Distances',
  description: 'Keep your long-distance relationship strong with DistantDuo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ClientProvider>
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
              <Header />
              <main className="max-w-6xl mx-auto p-4">
                {children}
              </main>
            </div>
          </ClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}