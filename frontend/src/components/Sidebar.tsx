'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Printer, 
  LayoutDashboard, 
  Droplet, 
  AlertTriangle, 
  Wrench, 
  Usb,
  LogOut,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { getSavedSession, clearSession, UserSession } from '@/lib/api';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Printer Fleet', href: '/printers', icon: Printer },
  { name: 'Toner & Paper', href: '/consumables', icon: Droplet },
  { name: 'Alerts & Errors', href: '/alerts', icon: AlertTriangle },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'USB & Network Scan', href: '/discovery', icon: Usb },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const s = getSavedSession();
    setSession(s);
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    setSession(null);
    router.push('/login');
  };

  // Don't render sidebar on standalone auth pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const primaryRole = session?.roles?.[0]?.replace('ROLE_', '') || 'GUEST';

  return (
    <aside style={{
      width: '260px',
      minHeight: '100vh',
      background: 'rgba(12, 18, 32, 0.95)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 50
    }}>
      {/* BRAND HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px 28px 12px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #0284c7 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
        }}>
          <Printer size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            SmartPrinter
          </h1>
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
            Enterprise Telemetry
          </p>
        </div>
      </div>

      {/* USER SESSION CARD */}
      <div className="glass-panel" style={{ padding: '12px 14px', marginBottom: '20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
              {session?.fullName || 'User Portal'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              @{session?.username || 'guest'}
            </div>
          </div>
          <span style={{
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.65rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            background: primaryRole === 'ADMIN' ? 'rgba(244, 63, 94, 0.2)' : primaryRole === 'TECHNICIAN' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)',
            color: primaryRole === 'ADMIN' ? '#fb7185' : primaryRole === 'TECHNICIAN' ? '#fbbf24' : '#38bdf8',
            border: '1px solid var(--border-subtle)'
          }}>
            {primaryRole}
          </span>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px 8px 12px' }}>
          Monitoring Center
        </p>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#38bdf8' : '#94a3b8',
                background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid transparent',
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              }}
            >
              <Icon size={18} color={isActive ? '#38bdf8' : '#94a3b8'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT BUTTON */}
      <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
        {session ? (
          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', color: '#fb7185', padding: '10px' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        ) : (
          <Link
            href="/login"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px', textDecoration: 'none' }}
          >
            Sign In / Register
          </Link>
        )}
      </div>
    </aside>
  );
}
