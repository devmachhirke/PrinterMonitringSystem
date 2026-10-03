'use client';

import { useEffect, useState } from 'react';
import { getSavedSession, hasTechnicianAccess, UserSession } from '@/lib/api';
import { Wrench, Calendar, UserCheck, Plus, Lock, X, CheckCircle2 } from 'lucide-react';

interface MaintenanceItem {
  id: number;
  title: string;
  printerName: string;
  description: string;
  performedBy: string;
  date: string;
  status: string;
}

export default function MaintenancePage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [logs, setLogs] = useState<MaintenanceItem[]>([
    {
      id: 1,
      title: 'Laser Drum & Fuser Assembly Replacement',
      printerName: 'HP LaserJet Enterprise M507',
      description: 'Replaced image drum unit due to line artifacts.',
      performedBy: 'Tech Admin',
      date: '2026-09-28',
      status: 'COMPLETED'
    },
    {
      id: 2,
      title: 'Paper Roller Cleaning & Calibration',
      printerName: 'Canon ImageRUNNER ADVANCE DX',
      description: 'Routine 60-day maintenance check and roller cleaning.',
      performedBy: 'Senior Technician',
      date: '2026-09-15',
      status: 'COMPLETED'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrinter, setNewPrinter] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const syncSession = () => {
    setSession(getSavedSession());
  };

  useEffect(() => {
    syncSession();
    window.addEventListener('session-updated', syncSession);
    return () => window.removeEventListener('session-updated', syncSession);
  }, []);

  const isTechOrAdmin = hasTechnicianAccess(session);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrinter.trim()) return;

    const newEntry: MaintenanceItem = {
      id: Date.now(),
      title: newTitle,
      printerName: newPrinter,
      description: newDesc || 'Scheduled maintenance completed.',
      performedBy: session?.fullName || 'Technician',
      date: new Date().toISOString().split('T')[0],
      status: 'COMPLETED'
    };

    setLogs([newEntry, ...logs]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewPrinter('');
    setNewDesc('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>Technician Maintenance Log</h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Schedule servicing, log drum replacements, and track technician activity.</p>
        </div>
        <button
          onClick={() => isTechOrAdmin && setIsModalOpen(true)}
          disabled={!isTechOrAdmin}
          className={isTechOrAdmin ? "btn-primary" : "btn-secondary"}
          style={{ opacity: isTechOrAdmin ? 1 : 0.65, cursor: isTechOrAdmin ? 'pointer' : 'not-allowed' }}
          title={isTechOrAdmin ? 'Log new servicing activity' : 'Technician or Admin role required'}
        >
          {isTechOrAdmin ? <Plus size={16} /> : <Lock size={15} color="#fb7185" />}
          <span>{isTechOrAdmin ? 'Log Servicing Activity' : 'Tech Access Required'}</span>
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {logs.map(log => (
            <div key={log.id} style={{ padding: '18px 20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{log.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                  <strong style={{ color: '#cbd5e1' }}>{log.printerName}</strong> &bull; {log.description}
                </p>
                <div style={{ display: 'flex', gap: '18px', marginTop: '10px', fontSize: '0.78rem', color: '#64748b' }}>
                  <span><UserCheck size={13} style={{ display: 'inline', marginRight: '4px' }} /> Performed by: <strong style={{ color: '#94a3b8' }}>{log.performedBy}</strong></span>
                  <span><Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Date: <strong style={{ color: '#94a3b8' }}>{log.date}</strong></span>
                </div>
              </div>
              <span className="badge badge-online">{log.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ADD LOG MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', borderRadius: '16px', background: 'var(--panel-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Log Servicing Record</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Service Activity Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Toner Cartridge & Roller Replacement"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.6)', color: '#f8fafc', fontSize: '0.88rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Printer Name / Model *</label>
                <input
                  type="text"
                  placeholder="e.g. HP LaserJet Enterprise M507"
                  value={newPrinter}
                  onChange={e => setNewPrinter(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.6)', color: '#f8fafc', fontSize: '0.88rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Technician Notes &amp; Findings</label>
                <textarea
                  placeholder="Describe parts replaced or cleaning performed..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.6)', color: '#f8fafc', fontSize: '0.88rem', minHeight: '80px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Maintenance Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
