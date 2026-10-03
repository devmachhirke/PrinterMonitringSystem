import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  trend?: string;
}

export default function StatCard({ title, value, subtitle, icon: Icon, iconColor, trend }: StatCardProps) {
  return (
    <div className="glass-panel" style={{ padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>{title}</span>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: `rgba(${iconColor}, 0.12)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={20} color={`rgb(${iconColor})`} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em' }}>{value}</span>
        {trend && (
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399' }}>{trend}</span>
        )}
      </div>

      {subtitle && (
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>{subtitle}</p>
      )}
    </div>
  );
}
