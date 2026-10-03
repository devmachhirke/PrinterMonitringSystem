'use client';

import { Wrench, Calendar, UserCheck, Plus } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>Technician Maintenance Log</h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Schedule servicing, log drum replacements, and track technician activity.</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Log Servicing Activity
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>Laser Drum & Fuser Assembly Replacement</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>HP LaserJet Enterprise M507 — Replaced image drum unit due to line artifacts.</p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                <span><UserCheck size={12} style={{ display: 'inline', marginRight: '4px' }} /> Performed by: Tech Admin</span>
                <span><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} /> Date: 2026-09-28</span>
              </div>
            </div>
            <span className="badge badge-online">COMPLETED</span>
          </div>

          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>Paper Roller Cleaning & Calibration</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Canon ImageRUNNER ADVANCE DX — Routine 60-day maintenance check.</p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                <span><UserCheck size={12} style={{ display: 'inline', marginRight: '4px' }} /> Performed by: Senior Technician</span>
                <span><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} /> Date: 2026-09-15</span>
              </div>
            </div>
            <span className="badge badge-online">COMPLETED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
