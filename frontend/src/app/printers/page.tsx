'use client';

import { useEffect, useState } from 'react';
import { fetchPrinters, pingPrinter, Printer } from '@/lib/api';
import { Printer as PrinterIcon, Plus, Search, Zap, CheckCircle2, XCircle } from 'lucide-react';

export default function PrintersPage() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrinters().then(data => {
      setPrinters(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>Printer Fleet Management</h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Register, configure, and monitor network & USB connected printers.</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} />
          <span>Add New Printer</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {printers.map(printer => {
          const isOnline = printer.status !== 'OFFLINE';
          return (
            <div key={printer.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: isOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PrinterIcon size={22} color={isOnline ? '#34d399' : '#fb7185'} />
                  </div>
                  <span className={`badge ${isOnline ? 'badge-online' : 'badge-offline'}`}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{printer.name}</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>S/N: {printer.serialNumber}</p>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Connection</span>
                    <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{printer.connectionType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>IP / USB Port</span>
                    <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{printer.ipAddress}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Monitoring</span>
                    <span style={{ color: printer.monitoringEnabled ? '#34d399' : '#fb7185', fontWeight: 600 }}>
                      {printer.monitoringEnabled ? 'Enabled (60s)' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => pingPrinter(printer.id)}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '0.8rem' }}
                >
                  <Zap size={14} /> Ping Test
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
