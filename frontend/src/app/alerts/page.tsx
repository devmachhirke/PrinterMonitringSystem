'use client';

import { useEffect, useState } from 'react';
import { fetchAlerts, AlertItem } from '@/lib/api';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    fetchAlerts().then(setAlerts);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>System Alerts & Diagnostics</h1>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Real-time hardware warnings, low toner notifications, and network outages.</p>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {alerts.map(alert => (
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
                    Printer: {alert.printerName} | Severity: {alert.severity}
                  </span>
                </div>
              </div>

              <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                <CheckCircle size={14} color="#34d399" /> Resolve Alert
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
