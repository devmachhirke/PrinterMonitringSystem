'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { RefreshCw, Activity, Bell, Search, UserCheck } from 'lucide-react';
import { pollAllPrinters, getSavedSession, UserSession } from '@/lib/api';

interface HeaderProps {
  onRefresh?: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
  const pathname = usePathname();
  const [polling, setPolling] = useState(false);
  const [lastPolled, setLastPolled] = useState<string>('Just now');
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    setSession(getSavedSession());
  }, [pathname]);

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const handlePollAll = async () => {
    setPolling(true);
    try {
      await pollAllPrinters();
      setLastPolled(new Date().toLocaleTimeString());
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setPolling(false);
    }
  };

  return (
    <header style={{
      height: '74px',
      background: 'rgba(10, 14, 26, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div style={{ position: 'relative', width: '340px' }}>
        <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search printer name, IP, serial number..."
          style={{
            width: '100%',
            padding: '10px 14px 10px 42px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            color: '#f8fafc',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94a3b8' }}>
          <Activity size={14} color="#38bdf8" />
          <span>Last polled: <strong style={{ color: '#f8fafc' }}>{lastPolled}</strong></span>
        </div>

        <button
          onClick={handlePollAll}
          disabled={polling}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          <RefreshCw size={15} style={{ animation: polling ? 'spin 1s linear infinite' : 'none' }} />
          <span>{polling ? 'Polling Network...' : 'Ping All Printers'}</span>
        </button>

        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer'
        }}>
          <Bell size={18} color="#94a3b8" />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#f43f5e'
          }}></span>
        </div>

        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </header>
  );
}
