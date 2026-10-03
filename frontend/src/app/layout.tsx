'use client';

import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <html lang="en">
      <head>
        <title>SmartPrinter - Enterprise Telemetry &amp; Monitoring Portal</title>
        <meta name="description" content="Real-time smart printer status monitoring, toner levels, paper trays, and predictive maintenance." />
      </head>
      <body>
        {isAuthPage ? (
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
