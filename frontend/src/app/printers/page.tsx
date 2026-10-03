'use client';

import { useEffect, useState } from 'react';
import { 
  fetchPrinters, 
  pingPrinter, 
  createPrinter, 
  submitPrintJob, 
  printTestPage, 
  Printer, 
  PrinterPingResult, 
  CreatePrinterPayload, 
  PrintJobResponseData, 
  getSavedSession, 
  hasAdminAccess, 
  hasTechnicianAccess, 
  UserSession 
} from '@/lib/api';
import { Printer as PrinterIcon, Plus, Zap, CheckCircle2, XCircle, RefreshCw, X, Lock, FileText, Send } from 'lucide-react';

export default function PrintersPage() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [pingingId, setPingingId] = useState<number | null>(null);
  const [printingId, setPrintingId] = useState<number | null>(null);
  const [lastPingResult, setLastPingResult] = useState<PrinterPingResult | null>(null);
  const [lastPrintResult, setLastPrintResult] = useState<PrintJobResponseData | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);

  // Add Printer Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Custom Print Document Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPrinterForPrint, setSelectedPrinterForPrint] = useState<Printer | null>(null);
  const [documentTitle, setDocumentTitle] = useState('Official Company Notice');
  const [documentContent, setDocumentContent] = useState('This is a test printed document sent from Smart Printer Monitoring System.\n\nDate: ' + new Date().toLocaleDateString() + '\nAuthor: Administrator\nStatus: Verified');
  const [copies, setCopies] = useState(1);
  const [isPrintingJob, setIsPrintingJob] = useState(false);

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

  const handlePrintTestPage = async (printerId: number) => {
    setPrintingId(printerId);
    setLastPrintResult(null);
    try {
      const res = await printTestPage(printerId, session?.fullName || 'System Administrator');
      setLastPrintResult(res);
      setSuccessMsg(`Diagnostic test page sent to ${res.printerName}. Status: ${res.status}`);
    } catch (err: any) {
      console.error('Test page print failed:', err);
    } finally {
      setPrintingId(null);
    }
  };

  const handleCustomPrintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrinterForPrint) return;

    setIsPrintingJob(true);
    try {
      const res = await submitPrintJob({
        printerId: selectedPrinterForPrint.id,
        jobName: documentTitle,
        content: documentContent,
        copies: copies,
        printedBy: session?.fullName || 'System User'
      });

      setLastPrintResult(res);
      setSuccessMsg(`Document "${res.jobName}" successfully sent to ${selectedPrinterForPrint.name}! Status: ${res.status}`);
      setIsPrintModalOpen(false);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsPrintingJob(false);
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

              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => isTechOrAdmin && handlePingTest(printer.id)}
                    disabled={isPinging || !isTechOrAdmin}
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '0.78rem' }}
                  >
                    <Zap size={13} className={isPinging ? 'spin' : ''} color="#38bdf8" />
                    <span>{isPinging ? 'Pinging...' : 'Ping Test'}</span>
                  </button>

                  <button
                    onClick={() => handlePrintTestPage(printer.id)}
                    disabled={printingId === printer.id}
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '0.78rem' }}
                  >
                    <FileText size={13} color="#a855f7" />
                    <span>{printingId === printer.id ? 'Printing...' : 'Test Page'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSelectedPrinterForPrint(printer);
                    setIsPrintModalOpen(true);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.82rem' }}
                >
                  <Send size={14} />
                  <span>Print Custom Paper Document</span>
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

      {/* PRINT CUSTOM DOCUMENT MODAL */}
      {isPrintModalOpen && selectedPrinterForPrint && (
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
            maxWidth: '560px',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--panel-bg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '10px' }}>
                  <Send size={20} color="#a855f7" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    Send Document to Printer
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                    Target: <strong style={{ color: '#38bdf8' }}>{selectedPrinterForPrint.name}</strong> ({selectedPrinterForPrint.connectionType})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsPrintModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCustomPrintSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Document Title / Job Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Financial Audit Report"
                  value={documentTitle}
                  onChange={e => setDocumentTitle(e.target.value)}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Number of Copies
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={copies}
                  onChange={e => setCopies(parseInt(e.target.value) || 1)}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Paper Document Content / Text *
                </label>
                <textarea
                  rows={5}
                  value={documentContent}
                  onChange={e => setDocumentContent(e.target.value)}
                  placeholder="Type or paste the document text to be printed..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    const printWin = window.open('', '_blank');
                    if (printWin) {
                      printWin.document.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>${documentTitle}</title>
                            <style>
                              body { font-family: 'Courier New', monospace; padding: 40px; white-space: pre-wrap; font-size: 13pt; line-height: 1.5; }
                              .header { font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 16px; font-size: 16pt; }
                              .footer { margin-top: 30px; border-top: 1px solid #ccc; pt-2; font-size: 9pt; color: #666; }
                            </style>
                          </head>
                          <body>
                            <div class="header">${documentTitle}</div>
                            <div>${documentContent}</div>
                            <div class="footer">Target Printer: ${selectedPrinterForPrint.name} &bull; Date: ${new Date().toLocaleString()}</div>
                            <script>
                              window.onload = function() { window.print(); }
                            </script>
                          </body>
                        </html>
                      `);
                      printWin.document.close();
                    }
                  }}
                  style={{ fontSize: '0.8rem' }}
                >
                  <PrinterIcon size={14} color="#38bdf8" />
                  <span>Browser Print Window (Ctrl+P)</span>
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsPrintModalOpen(false)}
                    disabled={isPrintingJob}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isPrintingJob}
                    style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' }}
                  >
                    <Send size={15} />
                    <span>{isPrintingJob ? 'Transmitting to Hardware...' : 'Send Hardware Job'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
