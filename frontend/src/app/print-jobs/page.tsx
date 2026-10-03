'use client';

import { useEffect, useState } from 'react';
import { fetchPrintJobs, fetchPrinters, submitPrintJob, printTestPage, PrintJobResponseData, Printer } from '@/lib/api';
import { usePrinterSocket } from '@/lib/usePrinterSocket';
import { FileText, Send, RefreshCw, CheckCircle2, XCircle, Clock, Ban, Printer as PrinterIcon } from 'lucide-react';

export default function PrintJobsPage() {
  const [jobs, setJobs] = useState<PrintJobResponseData[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Submit Job Form State
  const [selectedPrinterId, setSelectedPrinterId] = useState<number | ''>('');
  const [jobName, setJobName] = useState('Quarterly Telemetry Summary Report');
  const [content, setContent] = useState('Confidential Document Content for Hardware Print Spooler.\nPrinted At: ' + new Date().toLocaleString());
  const [copies, setCopies] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const { lastAlert } = usePrinterSocket();

  const loadData = async () => {
    setLoading(true);
    try {
      const [jData, pData] = await Promise.all([
        fetchPrintJobs(),
        fetchPrinters()
      ]);
      setJobs(jData);
      setPrinters(pData);
      if (pData.length > 0 && !selectedPrinterId) {
        setSelectedPrinterId(pData[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Listen for WebSocket print job notifications
  useEffect(() => {
    if (lastAlert && (lastAlert as any).jobName) {
      const newJob = lastAlert as unknown as PrintJobResponseData;
      setJobs(prev => [newJob, ...prev.filter(j => j.id !== newJob.id)]);
    }
  }, [lastAlert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrinterId) return;

    setIsSubmitting(true);
    setMsg(null);
    try {
      const result = await submitPrintJob({
        printerId: Number(selectedPrinterId),
        jobName,
        content,
        copies,
        printedBy: 'System Administrator'
      });

      setJobs(prev => [result, ...prev]);
      setMsg(`Print job #${result.id} (${result.jobName}) submitted. Status: ${result.status}`);
    } catch (err: any) {
      setMsg('Failed to submit print job: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestPage = async (pId: number) => {
    try {
      const result = await printTestPage(pId, 'Operator');
      setJobs(prev => [result, ...prev]);
      setMsg(`Test page dispatched to printer #${pId}. Status: ${result.status}`);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs = jobs.filter(j => {
    if (filterStatus === 'ALL') return true;
    return j.status === filterStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>Print Job Execution Console</h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Real-time hardware paper print job queue, status logs, and socket spooling.</p>
        </div>
        <button className="btn-secondary" onClick={loadData} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {msg && (
        <div className="glass-panel" style={{
          padding: '14px 20px',
          borderRadius: '12px',
          borderLeft: '4px solid #38bdf8',
          background: 'rgba(56, 189, 248, 0.08)',
          fontSize: '0.88rem',
          color: '#f8fafc',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>{msg}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>Dismiss</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* SUBMIT PRINT JOB FORM PANEL */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} color="#a855f7" />
            <span>Submit Hardware Print Job</span>
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Target Printer</label>
              <select
                value={selectedPrinterId}
                onChange={e => setSelectedPrinterId(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  border: '1px solid var(--border-subtle)',
                  color: '#f8fafc',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
                required
              >
                {printers.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.connectionType} - {p.ipAddress || p.usbPortName || 'USB'})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Document / Job Title</label>
              <input
                type="text"
                value={jobName}
                onChange={e => setJobName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  color: '#f8fafc',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Copies</label>
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
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  color: '#f8fafc',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Print Text Content</label>
              <textarea
                rows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  outline: 'none',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || printers.length === 0}
              style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' }}
            >
              <Send size={15} />
              <span>{isSubmitting ? 'Transmitting to Hardware...' : 'Submit Print Job'}</span>
            </button>
          </form>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '10px' }}>Quick Diagnostic Test Page</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {printers.slice(0, 3).map(p => (
                <button
                  key={p.id}
                  onClick={() => handleTestPage(p.id)}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px', fontSize: '0.78rem' }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                  <FileText size={13} color="#a855f7" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRINT JOB QUEUE HISTORY TABLE */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Print Job Queue Log</h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Full history of hardware print requests and transmission statuses</p>
            </div>

            {/* FILTER BUTTONS */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: filterStatus === st ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: filterStatus === st ? '#38bdf8' : '#94a3b8',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: '#64748b', fontSize: '0.75rem' }}>
                  <th style={{ padding: '12px 14px' }}>JOB NAME</th>
                  <th style={{ padding: '12px 14px' }}>TARGET PRINTER</th>
                  <th style={{ padding: '12px 14px' }}>COPIES</th>
                  <th style={{ padding: '12px 14px' }}>OPERATOR</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                  <th style={{ padding: '12px 14px' }}>TIME</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                      No print jobs match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map(j => {
                    const isOk = j.status === 'COMPLETED';
                    const isFail = j.status === 'FAILED';
                    const isPending = j.status === 'PENDING' || j.status === 'PROCESSING';

                    return (
                      <tr key={j.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '14px', fontWeight: 600, color: '#f8fafc' }}>
                          {j.jobName}
                          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 400 }}>Type: {j.documentType || 'TEXT'}</div>
                        </td>
                        <td style={{ padding: '14px', color: '#cbd5e1' }}>{j.printerName}</td>
                        <td style={{ padding: '14px', color: '#cbd5e1', fontWeight: 700 }}>{j.copies}</td>
                        <td style={{ padding: '14px', color: '#94a3b8' }}>{j.printedBy || 'Admin'}</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: isOk ? 'rgba(16, 185, 129, 0.15)' : isFail ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: isOk ? '#34d399' : isFail ? '#fb7185' : '#fbbf24'
                          }}>
                            {isOk && <CheckCircle2 size={13} />}
                            {isFail && <XCircle size={13} />}
                            {isPending && <Clock size={13} />}
                            {j.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px', color: '#64748b', fontSize: '0.78rem' }}>
                          {j.submittedAt ? new Date(j.submittedAt).toLocaleTimeString() : 'N/A'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
