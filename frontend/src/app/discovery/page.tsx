'use client';

import { useState } from 'react';
import { detectUsbPrinters, UsbPrinterInfo } from '@/lib/api';
import { Usb, RefreshCw, CheckCircle, Search } from 'lucide-react';

export default function DiscoveryPage() {
  const [printers, setPrinters] = useState<UsbPrinterInfo[]>([]);
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    setScanning(true);
    const results = await detectUsbPrinters();
    setPrinters(results);
    setScanning(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>USB & Local OS Printer Scanner</h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Discover printers connected via USB ports or installed in local OS print spooler.</p>
        </div>
        <button onClick={handleScan} disabled={scanning} className="btn-primary">
          <RefreshCw size={16} className={scanning ? 'spin-anim' : ''} />
          <span>{scanning ? 'Scanning Local OS...' : 'Scan USB & Print Services'}</span>
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        {printers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            <Usb size={40} color="#64748b" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>No USB scan performed yet</p>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Click the scan button above to query Java Print Service API on local host.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {printers.map((p, idx) => (
              <div key={idx} style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{p.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {p.isDefault ? '⭐ Default System Printer' : 'Local Print Service'}
                  </span>
                </div>
                <button className="btn-secondary" style={{ fontSize: '0.8rem' }}>
                  Import into Monitoring
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
