'use client';

import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSavedSession } from '@/lib/api';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = getSavedSession();
    if (!session && !isAuthPage) {
      setIsAuthenticated(false);
      router.replace('/login');
    } else if (session && isAuthPage) {
      setIsAuthenticated(true);
      router.replace('/');
    } else {
      setIsAuthenticated(!!session);
    }

    const handleSessionUpdate = () => {
      const updated = getSavedSession();
      setIsAuthenticated(!!updated);
    };

    window.addEventListener('session-updated', handleSessionUpdate);
    return () => window.removeEventListener('session-updated', handleSessionUpdate);
  }, [pathname, isAuthPage, router]);

  if (!mounted) {
    return (
      <html lang="en">
        <head>
          <title>SmartPrinter - Enterprise Telemetry &amp; Monitoring Portal</title>
        </head>
        <body style={{ background: '#0a0e1a', minHeight: '100vh' }} />
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>SmartPrinter - Enterprise Telemetry &amp; Monitoring Portal</title>
        <meta name="description" content="Real-time smart printer status monitoring, toner levels, paper trays, and predictive maintenance." />
      </head>
      <body>
        {isAuthPage || !isAuthenticated ? (
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
        ) : (
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
              <Header />
              <main style={{ flex: 1, padding: '32px' }}>
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
