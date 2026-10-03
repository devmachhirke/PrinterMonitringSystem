'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { PrinterPingResult, TonerStatus, AlertItem } from './api';

export interface SnmpTelemetryData {
  printerId: number;
  printerName: string;
  ipAddress: string;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING' | 'ERROR';
  sysDescr?: string;
  sysUpTime?: string;
  hrPrinterStatus?: string;
  hrDetectedErrorState?: string;
  pageCount?: number;
  blackTonerPercent?: number;
  cyanTonerPercent?: number;
  magentaTonerPercent?: number;
  yellowTonerPercent?: number;
  paperLevelPercent?: number;
  snmpReachable: boolean;
  polledAt: string;
  message?: string;
}

export interface UsePrinterSocketReturn {
  isConnected: boolean;
  lastPing: PrinterPingResult | null;
  lastTelemetry: SnmpTelemetryData | null;
  lastAlert: AlertItem | null;
  latestPingsMap: Record<number, PrinterPingResult>;
  latestTelemetryMap: Record<number, SnmpTelemetryData>;
  connectionError: string | null;
}

const WS_URLS = [
  'ws://localhost:9090/ws-printer/websocket',
  'ws://localhost:9090/ws-printer'
];

export function usePrinterSocket(): UsePrinterSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastPing, setLastPing] = useState<PrinterPingResult | null>(null);
  const [lastTelemetry, setLastTelemetry] = useState<SnmpTelemetryData | null>(null);
  const [lastAlert, setLastAlert] = useState<AlertItem | null>(null);
  const [latestPingsMap, setLatestPingsMap] = useState<Record<number, PrinterPingResult>>({});
  const [latestTelemetryMap, setLatestTelemetryMap] = useState<Record<number, SnmpTelemetryData>>({});
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const parseStompFrames = (rawText: string) => {
    // STOMP frames are separated by null character \x00
    const rawFrames = rawText.split('\x00').filter(f => f.trim().length > 0);
    
    for (const frameText of rawFrames) {
      const lines = frameText.split('\n');
      const command = lines[0].trim();

      if (command === 'CONNECTED') {
        if (isMountedRef.current) {
          setIsConnected(true);
          setConnectionError(null);
        }

        // Subscribe to topics
        const subscribePing = `SUBSCRIBE\nid:sub-pings\ndestination:/topic/printer-pings\n\n\x00`;
        const subscribeTelemetry = `SUBSCRIBE\nid:sub-telemetry\ndestination:/topic/telemetry\n\n\x00`;
        const subscribeAlerts = `SUBSCRIBE\nid:sub-alerts\ndestination:/topic/alerts\n\n\x00`;

        socketRef.current?.send(subscribePing);
        socketRef.current?.send(subscribeTelemetry);
        socketRef.current?.send(subscribeAlerts);
      } else if (command === 'MESSAGE') {
        // Extract headers and body
        const bodyIndex = frameText.indexOf('\n\n');
        if (bodyIndex !== -1) {
          const headersText = frameText.substring(0, bodyIndex);
          const body = frameText.substring(bodyIndex + 2).replace(/\x00$/, '').trim();

          const destinationLine = headersText.split('\n').find(l => l.startsWith('destination:'));
          const destination = destinationLine ? destinationLine.split(':')[1].trim() : '';

          try {
            const data = JSON.parse(body);
            if (destination === '/topic/printer-pings' && isMountedRef.current) {
              setLastPing(data);
              if (data.printerId) {
                setLatestPingsMap(prev => ({ ...prev, [data.printerId]: data }));
              }
            } else if (destination === '/topic/telemetry' && isMountedRef.current) {
              setLastTelemetry(data);
              if (data.printerId) {
                setLatestTelemetryMap(prev => ({ ...prev, [data.printerId]: data }));
              }
            } else if (destination === '/topic/alerts' && isMountedRef.current) {
              setLastAlert(data);
            }
          } catch (e) {
            console.error('Error parsing STOMP JSON payload:', e);
          }
        }
      }
    }
  };

  const connect = useCallback(() => {
    if (!isMountedRef.current) return;

    let urlIdx = 0;
    const tryConnect = () => {
      if (!isMountedRef.current) return;
      const targetUrl = WS_URLS[urlIdx % WS_URLS.length];
      
      try {
        const ws = new WebSocket(targetUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          // Send STOMP CONNECT frame
          const connectFrame = `CONNECT\naccept-version:1.1,1.2\nheart-beat:10000,10000\n\n\x00`;
          ws.send(connectFrame);
        };

        ws.onmessage = (event) => {
          if (typeof event.data === 'string') {
            parseStompFrames(event.data);
          }
        };

        ws.onerror = () => {
          if (isMountedRef.current) {
            setConnectionError(`WebSocket error connecting to ${targetUrl}`);
          }
        };

        ws.onclose = () => {
          if (isMountedRef.current) {
            setIsConnected(false);
            urlIdx++;
            // Try reconnect after 5 seconds
            reconnectTimerRef.current = setTimeout(connect, 5000);
          }
        };
      } catch (err: any) {
        if (isMountedRef.current) {
          setIsConnected(false);
          setConnectionError(err.message || 'Failed to create WebSocket');
          reconnectTimerRef.current = setTimeout(connect, 5000);
        }
      }
    };

    tryConnect();
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      isMountedRef.current = false;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    lastPing,
    lastTelemetry,
    lastAlert,
    latestPingsMap,
    latestTelemetryMap,
    connectionError
  };
}
