'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUsers, fetchAuditLogs, getSavedSession, hasAdminAccess, UserItem, AuditLogItem, UserSession } from '@/lib/api';
import StatCard from '@/components/StatCard';
import { Users, Shield, ShieldCheck, FileText, UserPlus, Clock, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AdminConsolePage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<UserSession | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const s = getSavedSession();
      setSession(s);
      if (hasAdminAccess(s)) {
        const [uData, lData] = await Promise.all([
          fetchUsers(),
          fetchAuditLogs()
        ]);
        setUsers(uData);
        setLogs(lData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleSessionUpdate = () => {
      const s = getSavedSession();
      setSession(s);
      if (hasAdminAccess(s)) {
        loadData();
      }
    };
    window.addEventListener('session-updated', handleSessionUpdate);
    return () => window.removeEventListener('session-updated', handleSessionUpdate);
  }, []);

  const isAdmin = hasAdminAccess(session);

  if (!loading && !isAdmin) {
    return (
      <div className="glass-panel" style={{ padding: '48px 32px', textAlign: 'center', maxWidth: '600px', margin: '60px auto', borderRadius: '20px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fb7185',
          marginBottom: '20px'
        }}>
          <ShieldAlert size={34} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
          Access Denied -- Administrator Privileges Required
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '28px', lineHeight: 1.6 }}>
          The User Directory Management console and System Audit Logs are strictly restricted to accounts with <strong>ADMINISTRATOR</strong> roles. Your current access level is <strong>{session?.roles?.[0]?.replace('ROLE_', '') || 'GUEST / NON_ADMIN'}</strong>.
        </p>
        <button
          onClick={() => router.push('/')}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '0.9rem' }}
        >
          Return to Monitoring Dashboard
        </button>
      </div>
    );
  }

  const getRoleName = (r: any): string => {
    if (!r) return '';
    if (typeof r === 'string') return r;
    if (typeof r === 'object') return r.name || r.role || r.authority || '';
    return String(r);
  };

  const hasRole = (u: UserItem, target: string): boolean => {
    if (!u || !u.roles || !Array.isArray(u.roles)) return false;
    return u.roles.some(r => getRoleName(r).toUpperCase().includes(target.toUpperCase()));
  };

  const adminUsersCount = (users || []).filter(u => hasRole(u, 'ADMIN')).length;
  const techUsersCount = (users || []).filter(u => hasRole(u, 'TECHNICIAN')).length;

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
                  const roleStr = (u.roles && Array.isArray(u.roles))
                    ? u.roles.map(r => getRoleName(r).replace(/^ROLE_/, '')).filter(Boolean).join(', ')
                    : 'USER';
                  const isAdmin = roleStr.toUpperCase().includes('ADMIN');

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
