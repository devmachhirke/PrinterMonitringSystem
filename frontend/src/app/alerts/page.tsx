'use client';

import { useEffect, useState } from 'react';
import { fetchAlerts, AlertItem, getSavedSession, hasTechnicianAccess, UserSession } from '@/lib/api';
import { AlertTriangle, CheckCircle, Lock } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [session, setSession] = useState<UserSession | null>(null);

  const syncSession = () => {
    setSession(getSavedSession());
  };

  useEffect(() => {
    fetchAlerts().then(setAlerts);
    syncSession();
    window.addEventListener('session-updated', syncSession);
    return () => window.removeEventListener('session-updated', syncSession);
  }, []);

  const isTechOrAdmin = hasTechnicianAccess(session);

  const handleResolveAlert = (alertId: number) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>System Alerts &amp; Diagnostics</h1>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Real-time hardware warnings, low toner notifications, and network outages.</p>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {alerts.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#34d399', fontSize: '0.95rem', fontWeight: 600 }}>
              <CheckCircle size={32} style={{ margin: '0 auto 8px auto', display: 'block' }} />
              All system alerts have been resolved. No active hardware warnings.
            </div>
          ) : (
            alerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: alert.severity === 'CRITICAL' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <AlertTriangle size={20} color={alert.severity === 'CRITICAL' ? '#fb7185' : '#fbbf24'} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{alert.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>{alert.message}</p>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                      Printer: <strong style={{ color: '#cbd5e1' }}>{alert.printerName}</strong> | Severity: <strong style={{ color: alert.severity === 'CRITICAL' ? '#fb7185' : '#fbbf24' }}>{alert.severity}</strong>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => isTechOrAdmin && handleResolveAlert(alert.id)}
                  disabled={!isTechOrAdmin}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 14px', opacity: isTechOrAdmin ? 1 : 0.65, cursor: isTechOrAdmin ? 'pointer' : 'not-allowed' }}
                  title={isTechOrAdmin ? 'Mark alert as resolved' : 'Technician or Admin role required'}
                >
                  {isTechOrAdmin ? (
                    <>
                      <CheckCircle size={14} color="#34d399" />
                      <span>Resolve Alert</span>
                    </>
                  ) : (
                    <>
                      <Lock size={13} color="#94a3b8" />
                      <span>Tech Access Required</span>
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
