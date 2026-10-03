'use client';

import { useEffect, useState } from 'react';
import { fetchUsers, fetchAuditLogs, UserItem, AuditLogItem } from '@/lib/api';
import StatCard from '@/components/StatCard';
import { Users, Shield, ShieldCheck, FileText, UserPlus, Clock, Lock, CheckCircle2 } from 'lucide-react';

export default function AdminConsolePage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [uData, lData] = await Promise.all([
        fetchUsers(),
        fetchAuditLogs()
      ]);
      setUsers(uData);
      setLogs(lData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const adminUsersCount = users.filter(u => u.roles?.some(r => r.includes('ADMIN'))).length;
  const techUsersCount = users.filter(u => u.roles?.some(r => r.includes('TECHNICIAN'))).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          User Administration &amp; Audit Logs
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
          Role-Based Access Control (RBAC), user directory management, and system security event audit trails.
        </p>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <StatCard
          title="TOTAL REGISTERED USERS"
          value={users.length}
          subtitle="Active directory accounts"
          icon={Users}
          iconColor="56, 189, 248"
        />
        <StatCard
          title="ADMINISTRATORS"
          value={adminUsersCount}
          subtitle="Full access privileges"
          icon={ShieldCheck}
          iconColor="244, 63, 94"
        />
        <StatCard
          title="FIELD TECHNICIANS"
          value={techUsersCount}
          subtitle="Maintenance & operational roles"
          icon={Shield}
          iconColor="245, 158, 11"
        />
        <StatCard
          title="AUDIT LOG TRAIL EVENTS"
          value={logs.length}
          subtitle="Recorded system activity events"
          icon={FileText}
          iconColor="16, 185, 129"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* USERS DIRECTORY TABLE */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#38bdf8" />
              <span>User Accounts Directory</span>
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: '#64748b', fontSize: '0.75rem' }}>
                  <th style={{ padding: '12px 14px' }}>USER</th>
                  <th style={{ padding: '12px 14px' }}>EMAIL</th>
                  <th style={{ padding: '12px 14px' }}>ROLES</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const roleStr = u.roles ? u.roles.map(r => r.replace('ROLE_', '')).join(', ') : 'USER';
                  const isAdmin = roleStr.includes('ADMIN');

                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '14px', fontWeight: 600, color: '#f8fafc' }}>
                        {u.fullName || u.username}
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 400 }}>@{u.username}</div>
                      </td>
                      <td style={{ padding: '14px', color: '#cbd5e1' }}>{u.email}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: isAdmin ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color: isAdmin ? '#fb7185' : '#38bdf8'
                        }}>
                          {roleStr}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ color: u.active !== false ? '#34d399' : '#fb7185', fontWeight: 600, fontSize: '0.78rem' }}>
                          {u.active !== false ? '● Active' : '○ Suspended'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AUDIT LOG TIMELINE */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#10b981" />
            <span>Security Audit Log Activity Trail</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {logs.map(log => (
              <div
                key={log.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderLeft: '4px solid #38bdf8',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                  <span>{log.action}</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 400 }}>
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recent'}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0 }}>
                  {log.details}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  <span>User: <strong style={{ color: '#94a3b8' }}>@{log.username}</strong></span>
                  <span>IP: <strong style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{log.ipAddress}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
