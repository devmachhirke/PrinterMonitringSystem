'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import TonerGauge from '@/components/TonerGauge';
import { 
  Printer as PrinterIcon, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Zap,
  CheckCircle2,
  XCircle,
  Radio
} from 'lucide-react';
import { fetchPrinters, fetchTonerStatuses, fetchAlerts, pingPrinter, Printer, TonerStatus, AlertItem, PrinterPingResult } from '@/lib/api';
import { usePrinterSocket } from '@/lib/usePrinterSocket';

export default function DashboardPage() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [tonerList, setTonerList] = useState<TonerStatus[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [pingingId, setPingingId] = useState<number | null>(null);
  const [pingResult, setPingResult] = useState<PrinterPingResult | null>(null);

  const { isConnected, lastPing, lastTelemetry, lastAlert } = usePrinterSocket();

  const loadData = async () => {
    try {
      const [pData, tData, aData] = await Promise.all([
        fetchPrinters(),
        fetchTonerStatuses(),
        fetchAlerts()
      ]);
      setPrinters(pData || []);
      setTonerList(tData || []);
      setAlerts(aData || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Listen for real-time STOMP WebSocket ping updates
  useEffect(() => {
    if (lastPing) {
      setPingResult(lastPing);
      setPrinters(prev => prev.map(p => {
        if (p.id === lastPing.printerId) {
          return {
            ...p,
            status: lastPing.status,
            lastSeenAt: lastPing.checkedAt
          };
        }
        return p;
      }));
    }
  }, [lastPing]);

  // Listen for real-time STOMP WebSocket SNMP telemetry updates
  useEffect(() => {
    if (lastTelemetry) {
      setPrinters(prev => prev.map(p => {
        if (p.id === lastTelemetry.printerId) {
          return {
            ...p,
            status: lastTelemetry.status,
            lastSeenAt: lastTelemetry.polledAt
          };
        }
        return p;
      }));

      // Update toner gauges in real time if Black/Cyan/Magenta/Yellow levels are reported
      if (lastTelemetry.blackTonerPercent !== undefined) {
        setTonerList(prev => {
          const updated = [...prev];
          const colors: Array<{ color: 'BLACK' | 'CYAN' | 'MAGENTA' | 'YELLOW'; level?: number }> = [
            { color: 'BLACK', level: lastTelemetry.blackTonerPercent },
            { color: 'CYAN', level: lastTelemetry.cyanTonerPercent },
            { color: 'MAGENTA', level: lastTelemetry.magentaTonerPercent },
            { color: 'YELLOW', level: lastTelemetry.yellowTonerPercent }
          ];

          colors.forEach(({ color, level }) => {
            if (level !== undefined && level >= 0) {
              const idx = updated.findIndex(t => t.printerId === lastTelemetry.printerId && t.cartridgeColor === color);
              if (idx !== -1) {
                updated[idx] = { ...updated[idx], tonerLevel: level, collectedAt: lastTelemetry.polledAt };
              } else {
                updated.push({
                  id: Date.now() + Math.random(),
                  printerId: lastTelemetry.printerId,
                  printerName: lastTelemetry.printerName,
                  cartridgeColor: color,
                  tonerLevel: level,
                  collectedAt: lastTelemetry.polledAt
                });
              }
            }
          });
          return updated;
        });
      }
    }
  }, [lastTelemetry]);

  // Listen for real-time alerts over WebSockets
  useEffect(() => {
    if (lastAlert) {
      setAlerts(prev => [lastAlert, ...prev.filter(a => a.id !== lastAlert.id)]);
    }
  }, [lastAlert]);

  const handlePing = async (id: number) => {
    setPingingId(id);
    setPingResult(null);
    try {
      const res = await pingPrinter(id);
      setPingResult(res);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setPingingId(null);
    }
  };


  const onlineCount = printers.filter(p => p.status !== 'OFFLINE').length;
  const offlineCount = printers.filter(p => p.status === 'OFFLINE').length;
  const openAlertsCount = alerts.filter(a => a.status === 'OPEN').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Monitoring Executive Dashboard
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
          Real-time network &amp; USB printer telemetry, status history, and system health.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <StatCard
          title="TOTAL MONITORED PRINTERS"
          value={printers.length}
          subtitle="Network & USB interfaces"
          icon={PrinterIcon}
          iconColor="56, 189, 248"
        />
        <StatCard
          title="ONLINE & READY"
          value={onlineCount}
          trend={`${Math.round((onlineCount / (printers.length || 1)) * 100)}% uptime`}
          subtitle="Active network sockets"
          icon={Wifi}
          iconColor="16, 185, 129"
        />
        <StatCard
          title="OFFLINE / UNREACHABLE"
          value={offlineCount}
          subtitle="Requires attention"
          icon={WifiOff}
          iconColor="244, 63, 94"
        />
        <StatCard
          title="ACTIVE SYSTEM ALERTS"
          value={openAlertsCount}
          subtitle="Consumables & Hardware"
          icon={AlertTriangle}
          iconColor="245, 158, 11"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                  Printer Fleet Live Status
                </h2>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: 'rgba(56, 189, 248, 0.12)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}>
                  <Radio size={12} className="pulse-icon" /> WebSocket Telemetry Stream Active
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                Real-time SNMP MIB &amp; ICMP ping updates streamed directly via Spring WebSockets (10s rate)
              </p>
            </div>
          </div>

          {pingResult && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '16px',
              borderRadius: '10px',
              borderLeft: `4px solid ${pingResult.status === 'ONLINE' ? '#10b981' : '#f43f5e'}`,
              background: pingResult.status === 'ONLINE' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem' }}>
                {pingResult.status === 'ONLINE' ? (
                  <CheckCircle2 size={18} color="#34d399" />
                ) : (
                  <XCircle size={18} color="#fb7185" />
                )}
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                  {pingResult.printerName}: {pingResult.message} ({pingResult.responseTimeMs} ms)
                </span>
              </div>
              <button
                onClick={() => setPingResult(null)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.78rem' }}
              >
                Dismiss
              </button>
            </div>
          )}


          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: '#64748b', fontSize: '0.75rem' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>PRINTER NAME</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>CONNECTION</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>IP / PORT</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {printers.map((printer) => {
                  const isOnline = printer.status !== 'OFFLINE';
                  return (
                    <tr key={printer.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#f8fafc' }}>
                        {printer.name}
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 400 }}>
                          S/N: {printer.serialNumber}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: printer.connectionType === 'USB' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color: printer.connectionType === 'USB' ? '#c084fc' : '#38bdf8'
                        }}>
                          {printer.connectionType}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#cbd5e1', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                        {printer.connectionType === 'USB' ? (printer.usbPortName || 'Local USB') : printer.ipAddress}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span className={`badge ${isOnline ? 'badge-online' : 'badge-offline'}`}>
                          <span className={`pulse-dot ${isOnline ? 'online' : 'offline'}`} />
                          {isOnline ? 'ONLINE' : 'OFFLINE'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handlePing(printer.id)}
                          disabled={pingingId === printer.id}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                          <Zap size={13} color="#38bdf8" />
                          <span>{pingingId === printer.id ? 'Pinging...' : 'Ping'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#f59e0b" />
              <span>Active System Alerts</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderLeft: `4px solid ${alert.severity === 'CRITICAL' ? '#f43f5e' : alert.severity === 'HIGH' ? '#f59e0b' : '#38bdf8'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
                    <span>{alert.title}</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>{alert.printerName}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
              Consumables Health
            </h2>
            {tonerList.slice(0, 5).map((t) => (
              <div key={t.id} style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>{t.printerName}</div>
                <TonerGauge color={t.cartridgeColor} level={t.tonerLevel} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
