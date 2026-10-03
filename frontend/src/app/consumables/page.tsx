'use client';

import { useEffect, useState } from 'react';
import { fetchTonerStatuses, TonerStatus } from '@/lib/api';
import TonerGauge from '@/components/TonerGauge';
import { Droplet, Layers, RefreshCw } from 'lucide-react';

export default function ConsumablesPage() {
  const [tonerList, setTonerList] = useState<TonerStatus[]>([]);

  useEffect(() => {
    fetchTonerStatuses().then(setTonerList);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>Toner & Consumables Telemetry</h1>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Real-time cartridge level tracking, paper tray status, and low consumable alerts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplet size={18} color="#38bdf8" /> Toner Cartridge Levels
          </h2>
          {tonerList.map(item => (
            <div key={item.id} style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>{item.printerName}</div>
              <TonerGauge color={item.cartridgeColor} level={item.tonerLevel} />
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#a855f7" /> Paper Tray Status
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: '#f8fafc' }}>HP LaserJet Enterprise - Tray 1 (A4)</span>
                <span className="badge badge-online">85% Full</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Capacity: 500 Sheets | Plain Paper</p>
            </div>

            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: '#f8fafc' }}>Canon ImageRUNNER - Tray 2 (Letter)</span>
                <span className="badge badge-warning">20% Low</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Capacity: 250 Sheets | Letter Format</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
