'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RefreshCw, Activity, Bell, Search, Wifi, WifiOff, LogOut, User } from 'lucide-react';
import { pollAllPrinters, getSavedSession, clearSession, UserSession } from '@/lib/api';
import { usePrinterSocket } from '@/lib/usePrinterSocket';

interface HeaderProps {
  onRefresh?: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [polling, setPolling] = useState(false);
  const [lastPolled, setLastPolled] = useState<string>('Just now');
  const [session, setSession] = useState<UserSession | null>(null);

  const { isConnected } = usePrinterSocket();

  const syncSession = () => {
    setSession(getSavedSession());
  };

  useEffect(() => {
    syncSession();
    window.addEventListener('session-updated', syncSession);
    return () => window.removeEventListener('session-updated', syncSession);
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

  const handleLogout = () => {
    clearSession();
    setSession(null);
    router.push('/login');
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
        {/* Real-time WebSocket Live Connection Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: isConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
          border: isConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: isConnected ? '#10b981' : '#f43f5e'
        }}>
          {isConnected ? <Wifi size={14} className="pulse-icon" /> : <WifiOff size={14} />}
          <span>{isConnected ? 'STOMP WebSockets Live' : 'WebSocket Reconnecting...'}</span>
        </div>

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

        {/* LOGOUT / USER PROFILE BUTTON */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingLeft: '12px',
          borderLeft: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.3)'
            }}>
              {session?.fullName?.charAt(0) || session?.username?.charAt(0) || <User size={16} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                {session?.fullName || session?.username || 'Admin'}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                @{session?.username || 'admin'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out of Portal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: '#fb7185',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginLeft: '4px'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
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
