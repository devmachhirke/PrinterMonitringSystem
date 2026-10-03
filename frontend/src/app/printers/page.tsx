'use client';

import { useEffect, useState } from 'react';
import { fetchPrinters, pingPrinter, createPrinter, Printer, PrinterPingResult, CreatePrinterPayload, getSavedSession, hasAdminAccess, hasTechnicianAccess, UserSession } from '@/lib/api';
import { Printer as PrinterIcon, Plus, Zap, CheckCircle2, XCircle, RefreshCw, X, Lock } from 'lucide-react';

export default function PrintersPage() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [pingingId, setPingingId] = useState<number | null>(null);
  const [lastPingResult, setLastPingResult] = useState<PrinterPingResult | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);

  // Add Printer Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const syncSession = () => {
    setSession(getSavedSession());
  };

  useEffect(() => {
    syncSession();
    window.addEventListener('session-updated', syncSession);
    return () => window.removeEventListener('session-updated', syncSession);
  }, []);

  const isAdmin = hasAdminAccess(session);
  const isTechOrAdmin = hasTechnicianAccess(session);


  const [formData, setFormData] = useState<CreatePrinterPayload>({
    name: '',
    serialNumber: '',
    connectionType: 'NETWORK',
    ipAddress: '',
    macAddress: '',
    usbPortName: '',
    monitoringEnabled: true,
    monitoringIntervalSeconds: 60
  });

  const loadPrinters = async () => {
    setLoading(true);
    try {
      const data = await fetchPrinters();
      setPrinters(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrinters();
  }, []);

  const handlePingTest = async (printerId: number) => {
    setPingingId(printerId);
    setLastPingResult(null);
    try {
      const result = await pingPrinter(printerId);
      setLastPingResult(result);
      
      setPrinters(prev => prev.map(p => {
        if (p.id === printerId) {
          return {
            ...p,
            status: result.status,
            lastSeenAt: result.status === 'ONLINE' ? result.checkedAt : p.lastSeenAt
          };
        }
        return p;
      }));
    } catch (err) {
      console.error('Ping test failed:', err);
    } finally {
      setPingingId(null);
    }
  };

  const handleCreatePrinterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Printer name is required.');
      return;
    }

    if (formData.connectionType === 'NETWORK' && !formData.ipAddress?.trim()) {
      setFormError('IP Address is required for Network printers.');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdPrinter = await createPrinter(formData);
      setPrinters(prev => [createdPrinter, ...prev]);
      setSuccessMsg(`Printer "${createdPrinter.name}" registered successfully!`);
      setIsModalOpen(false);

      // Reset form
      setFormData({
        name: '',
        serialNumber: '',
        connectionType: 'NETWORK',
        ipAddress: '',
        macAddress: '',
        usbPortName: '',
        monitoringEnabled: true,
        monitoringIntervalSeconds: 60
      });
    } catch (err: any) {
      setFormError(err.message || 'Failed to save printer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>Printer Fleet Management</h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Register, configure, and monitor network &amp; USB connected printers.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={loadPrinters} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            className={isAdmin ? "btn-primary" : "btn-secondary"}
            onClick={() => {
              if (isAdmin) setIsModalOpen(true);
            }}
            style={{ opacity: isAdmin ? 1 : 0.7, cursor: isAdmin ? 'pointer' : 'not-allowed' }}
            title={isAdmin ? 'Add new printer to fleet' : 'Only ADMIN users can add printers'}
          >
            {isAdmin ? <Plus size={16} /> : <Lock size={15} color="#fb7185" />}
            <span>{isAdmin ? 'Add New Printer' : 'Admin Access Required'}</span>
          </button>
        </div>

      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="glass-panel" style={{
          padding: '14px 20px',
          borderRadius: '12px',
          borderLeft: '4px solid #10b981',
          background: 'rgba(16, 185, 129, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={20} color="#34d399" />
            <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Ping Result Toast Banner */}
      {lastPingResult && (
        <div className="glass-panel" style={{
          padding: '16px 20px',
          borderRadius: '12px',
          borderLeft: `4px solid ${lastPingResult.status === 'ONLINE' ? '#10b981' : '#f43f5e'}`,
          background: lastPingResult.status === 'ONLINE' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {lastPingResult.status === 'ONLINE' ? (
              <CheckCircle2 size={22} color="#34d399" />
            ) : (
              <XCircle size={22} color="#fb7185" />
            )}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Ping Result: {lastPingResult.printerName} is {lastPingResult.status}
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                {lastPingResult.message} &bull; Latency: <strong style={{ color: '#cbd5e1' }}>{lastPingResult.responseTimeMs} ms</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={() => setLastPingResult(null)}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Printer List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {printers.map(printer => {
          const isOnline = printer.status !== 'OFFLINE';
          const isPinging = pingingId === printer.id;

          return (
            <div key={printer.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>S/N: {printer.serialNumber || 'N/A'}</p>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Connection</span>
                    <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{printer.connectionType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>IP / USB Port</span>
                    <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{printer.ipAddress || printer.usbPortName || 'USB Local'}</span>
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
                  onClick={() => isTechOrAdmin && handlePingTest(printer.id)}
                  disabled={isPinging || !isTechOrAdmin}
                  className={isTechOrAdmin ? "btn-primary" : "btn-secondary"}
                  style={{ 
                    flex: 1, 
                    justifyContent: 'center', 
                    padding: '8px 12px', 
                    fontSize: '0.82rem', 
                    opacity: (!isTechOrAdmin || isPinging) ? 0.65 : 1,
                    cursor: isTechOrAdmin ? 'pointer' : 'not-allowed'
                  }}
                  title={isTechOrAdmin ? 'Execute live ICMP/TCP ping test' : 'Technician or Admin role required to ping'}
                >
                  {isTechOrAdmin ? (
                    <Zap size={14} className={isPinging ? 'spin' : ''} />
                  ) : (
                    <Lock size={13} color="#94a3b8" />
                  )}
                  <span>{isTechOrAdmin ? (isPinging ? 'Testing Ping...' : 'Ping Test') : 'Tech Access Required'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ADD NEW PRINTER MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--panel-bg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '10px' }}>
                  <PrinterIcon size={20} color="#38bdf8" />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Register New Printer</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', fontSize: '0.84rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePrinterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Printer Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., HP LaserJet Enterprise M507"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Connection Type
                  </label>
                  <select
                    value={formData.connectionType}
                    onChange={e => setFormData({ ...formData, connectionType: e.target.value as 'NETWORK' | 'USB' })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      background: '#1e293b',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  >
                    <option value="NETWORK">Network (IP Address)</option>
                    <option value="USB">USB Connection</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Serial Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CNB123456"
                    value={formData.serialNumber}
                    onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      background: 'rgba(15, 23, 42, 0.6)',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {formData.connectionType === 'NETWORK' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    IP Address *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 192.168.1.105"
                    value={formData.ipAddress}
                    onChange={e => setFormData({ ...formData, ipAddress: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      background: 'rgba(15, 23, 42, 0.6)',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      fontFamily: 'monospace',
                      outline: 'none'
                    }}
                    required
                  />
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    USB Port / OS Printer Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., USB001 or Brother HL-L8360CDW"
                    value={formData.usbPortName}
                    onChange={e => setFormData({ ...formData, usbPortName: e.target.value, osPrinterName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      background: 'rgba(15, 23, 42, 0.6)',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Register Printer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
