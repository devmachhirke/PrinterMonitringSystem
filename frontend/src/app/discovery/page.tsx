'use client';

import { useEffect, useState } from 'react';
import { detectUsbPrinters, createPrinter, UsbPrinterInfo, getSavedSession, hasTechnicianAccess, UserSession } from '@/lib/api';
import { Usb, RefreshCw, CheckCircle2, ArrowRight, ShieldCheck, Printer as PrinterIcon, Lock } from 'lucide-react';
import Link from 'next/link';

export default function DiscoveryPage() {
  const [printers, setPrinters] = useState<UsbPrinterInfo[]>([]);
  const [scanning, setScanning] = useState(false);
  const [importingName, setImportingName] = useState<string | null>(null);
  const [importedNames, setImportedNames] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);

  const syncSession = () => {
    setSession(getSavedSession());
  };

  useEffect(() => {
    syncSession();
    window.addEventListener('session-updated', syncSession);
    return () => window.removeEventListener('session-updated', syncSession);
  }, []);

  const isTechOrAdmin = hasTechnicianAccess(session);


  const handleScan = async () => {
    setScanning(true);
    setNotification(null);
    try {
      const results = await detectUsbPrinters();
      setPrinters(results);
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleImportPrinter = async (printer: UsbPrinterInfo) => {
    setImportingName(printer.name);
    setNotification(null);
    try {
      await createPrinter({
        name: printer.name,
        connectionType: 'USB',
        usbPortName: 'USB001',
        osPrinterName: printer.name,
        serialNumber: `USB-${Math.floor(Math.random() * 899999 + 100000)}`,
        monitoringEnabled: true,
        monitoringIntervalSeconds: 60
      });

      setImportedNames(prev => new Set(prev).add(printer.name));
      setNotification(`Printer "${printer.name}" imported into monitoring fleet successfully!`);
    } catch (err: any) {
      console.error(err);
      setNotification(`Failed to import printer: ${err.message || 'Error occurred'}`);
    } finally {
      setImportingName(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>USB &amp; Local OS Printer Scanner</h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Discover printers connected via USB ports or installed in local OS print spooler.</p>
        </div>
        <button 
          onClick={() => isTechOrAdmin && handleScan()} 
          disabled={scanning || !isTechOrAdmin} 
          className={isTechOrAdmin ? "btn-primary" : "btn-secondary"}
          style={{ opacity: isTechOrAdmin ? 1 : 0.65, cursor: isTechOrAdmin ? 'pointer' : 'not-allowed' }}
          title={isTechOrAdmin ? 'Scan local USB and spooler services' : 'Technician or Admin access required to scan'}
        >
          {isTechOrAdmin ? (
            <RefreshCw size={16} className={scanning ? 'spin' : ''} />
          ) : (
            <Lock size={15} color="#fb7185" />
          )}
          <span>{isTechOrAdmin ? (scanning ? 'Scanning Local OS...' : 'Scan USB & Print Services') : 'Tech Access Required'}</span>
        </button>

      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="glass-panel" style={{
          padding: '16px 20px',
          borderRadius: '12px',
          borderLeft: '4px solid #10b981',
          background: 'rgba(16, 185, 129, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={22} color="#34d399" />
            <div>
              <span style={{ fontSize: '0.92rem', color: '#f8fafc', fontWeight: 600 }}>{notification}</span>
              <div style={{ marginTop: '4px' }}>
                <Link href="/printers" style={{ color: '#38bdf8', fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  View in Printer Fleet <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
          <button onClick={() => setNotification(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            Dismiss
          </button>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '24px' }}>
        {printers.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Usb size={32} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>No USB scan performed yet</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '6px', maxWidth: '440px', margin: '6px auto 20px auto' }}>
              Click the scan button above to query Windows Spooler and Java Print Service API for locally attached USB printers.
            </p>
            <button onClick={handleScan} disabled={scanning} className="btn-primary" style={{ margin: '0 auto' }}>
              <RefreshCw size={15} className={scanning ? 'spin' : ''} />
              <span>Start USB Scan</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1' }}>
                DETECTED LOCAL PRINTERS ({printers.length})
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Ready to import into monitoring service
              </span>
            </div>

            {printers.map((p, idx) => {
              const isImported = importedNames.has(p.name);
              const isImporting = importingName === p.name;

              return (
                <div key={idx} style={{ 
                  padding: '18px 20px', 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-subtle)',
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(168, 85, 247, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <PrinterIcon size={20} color="#c084fc" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{p.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {p.isDefault ? '⭐ Default System Printer' : 'Local USB / OS Spooler'}
                        </span>
                        <span style={{ fontSize: '0.72rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 600 }}>
                          AVAILABLE
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => isTechOrAdmin && handleImportPrinter(p)}
                    disabled={isImported || isImporting || !isTechOrAdmin}
                    className={isImported ? 'btn-secondary' : isTechOrAdmin ? 'btn-primary' : 'btn-secondary'}
                    style={{ 
                      fontSize: '0.82rem', 
                      padding: '8px 16px',
                      opacity: (isImported || !isTechOrAdmin) ? 0.65 : 1,
                      cursor: (isImported || !isTechOrAdmin) ? 'not-allowed' : 'pointer'
                    }}
                    title={isTechOrAdmin ? 'Import printer into monitoring fleet' : 'Technician or Admin access required'}
                  >
                    {isImported ? (
                      <>
                        <ShieldCheck size={14} color="#34d399" />
                        <span style={{ color: '#34d399' }}>Imported ✓</span>
                      </>
                    ) : isTechOrAdmin ? (
                      <>
                        <Usb size={14} />
                        <span>{isImporting ? 'Importing...' : 'Import into Monitoring'}</span>
                      </>
                    ) : (
                      <>
                        <Lock size={13} color="#94a3b8" />
                        <span>Tech Access Required</span>
                      </>
                    )}
                  </button>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
