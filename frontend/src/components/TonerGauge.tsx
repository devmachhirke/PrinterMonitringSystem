interface TonerGaugeProps {
  color: 'BLACK' | 'CYAN' | 'MAGENTA' | 'YELLOW';
  level: number;
}

const COLOR_MAP = {
  BLACK: { bg: '#334155', fill: '#0f172a', border: '#475569', label: 'Black (K)' },
  CYAN: { bg: 'rgba(6, 182, 212, 0.2)', fill: '#06b6d4', border: '#22d3ee', label: 'Cyan (C)' },
  MAGENTA: { bg: 'rgba(236, 72, 153, 0.2)', fill: '#ec4899', border: '#f472b6', label: 'Magenta (M)' },
  YELLOW: { bg: 'rgba(234, 179, 8, 0.2)', fill: '#eab308', border: '#fde047', label: 'Yellow (Y)' }
};

export default function TonerGauge({ color, level }: TonerGaugeProps) {
  const config = COLOR_MAP[color] || COLOR_MAP.BLACK;
  const isLow = level <= 15;

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
        <span style={{ fontWeight: 600, color: '#cbd5e1' }}>{config.label}</span>
        <span style={{ fontWeight: 700, color: isLow ? '#fb7185' : '#f8fafc' }}>
          {level}% {isLow ? '⚠️ Low' : ''}
        </span>
      </div>

      <div style={{
        height: '10px',
        width: '100%',
        borderRadius: '9999px',
        background: 'rgba(255, 255, 255, 0.06)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        padding: '1px'
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(100, Math.max(0, level))}%`,
          borderRadius: '9999px',
          background: isLow ? 'linear-gradient(90deg, #f43f5e, #fb7185)' : config.fill,
          boxShadow: `0 0 10px ${isLow ? '#f43f5e' : config.fill}`,
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>
    </div>
  );
}
