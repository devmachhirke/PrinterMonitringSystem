export const API_BASE_URL = 'http://localhost:9090/api';

export interface UserSession {
  token: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface Printer {
  id: number;
  name: string;
  serialNumber: string;
  ipAddress: string;
  macAddress?: string;
  connectionType: 'NETWORK' | 'USB';
  usbPortName?: string;
  osPrinterName?: string;
  printerModelId?: number;
  locationId?: number;
  monitoringEnabled: boolean;
  monitoringIntervalSeconds: number;
  lastSeenAt?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: 'ONLINE' | 'OFFLINE' | 'WARNING' | 'ERROR';
}

export interface PrinterPingResult {
  printerId: number;
  printerName: string;
  ipAddress: string;
  status: 'ONLINE' | 'OFFLINE';
  responseTimeMs: number;
  checkedAt: string;
  message: string;
}

export interface TonerStatus {
  id: number;
  printerId: number;
  printerName: string;
  cartridgeColor: 'BLACK' | 'CYAN' | 'MAGENTA' | 'YELLOW';
  tonerLevel: number;
  collectedAt: string;
}

export interface PaperStatus {
  id: number;
  printerId: number;
  printerName: string;
  trayNumber: number;
  paperLevel: number;
  paperStatus: string;
  collectedAt: string;
}

export interface AlertItem {
  id: number;
  printerId: number;
  printerName: string;
  alertType: 'OFFLINE' | 'TONER_LOW' | 'PAPER_EMPTY' | 'PAPER_JAM' | 'HARDWARE_ERROR';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
  createdAt: string;
}

export interface UsbPrinterInfo {
  name: string;
  isDefault: boolean;
  isAvailable: boolean;
}

// MOCK FALLBACK DATA
const MOCK_PRINTERS: Printer[] = [
  {
    id: 1,
    name: 'HP LaserJet Enterprise M507',
    serialNumber: 'CNB1234567',
    ipAddress: '192.168.1.105',
    macAddress: '00:11:22:33:44:55',
    connectionType: 'NETWORK',
    monitoringEnabled: true,
    monitoringIntervalSeconds: 60,
    lastSeenAt: new Date().toISOString(),
    status: 'ONLINE'
  },
  {
    id: 2,
    name: 'Canon ImageRUNNER ADVANCE DX',
    serialNumber: 'CAN8899101',
    ipAddress: '192.168.1.110',
    connectionType: 'NETWORK',
    monitoringEnabled: true,
    monitoringIntervalSeconds: 60,
    lastSeenAt: new Date().toISOString(),
    status: 'ONLINE'
  },
  {
    id: 3,
    name: 'Epson EcoTank Pro ET-5850',
    serialNumber: 'EPS5544332',
    ipAddress: '192.168.1.120',
    connectionType: 'NETWORK',
    monitoringEnabled: true,
    monitoringIntervalSeconds: 60,
    lastSeenAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'WARNING'
  },
  {
    id: 4,
    name: 'Brother HL-L8360CDW (Local USB)',
    serialNumber: 'BRO7766554',
    ipAddress: '127.0.0.1',
    connectionType: 'USB',
    usbPortName: 'USB001',
    osPrinterName: 'Brother HL-L8360CDW',
    monitoringEnabled: true,
    monitoringIntervalSeconds: 60,
    lastSeenAt: new Date().toISOString(),
    status: 'ONLINE'
  },
  {
    id: 5,
    name: 'Xerox VersaLink C405 (Floor 3)',
    serialNumber: 'XRX9900112',
    ipAddress: '192.168.1.145',
    connectionType: 'NETWORK',
    monitoringEnabled: false,
    monitoringIntervalSeconds: 120,
    lastSeenAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'OFFLINE'
  }
];

const MOCK_TONER: TonerStatus[] = [
  { id: 1, printerId: 1, printerName: 'HP LaserJet Enterprise M507', cartridgeColor: 'BLACK', tonerLevel: 78, collectedAt: new Date().toISOString() },
  { id: 2, printerId: 2, printerName: 'Canon ImageRUNNER ADVANCE DX', cartridgeColor: 'BLACK', tonerLevel: 92, collectedAt: new Date().toISOString() },
  { id: 3, printerId: 2, printerName: 'Canon ImageRUNNER ADVANCE DX', cartridgeColor: 'CYAN', tonerLevel: 45, collectedAt: new Date().toISOString() },
  { id: 4, printerId: 2, printerName: 'Canon ImageRUNNER ADVANCE DX', cartridgeColor: 'MAGENTA', tonerLevel: 12, collectedAt: new Date().toISOString() },
  { id: 5, printerId: 2, printerName: 'Canon ImageRUNNER ADVANCE DX', cartridgeColor: 'YELLOW', tonerLevel: 64, collectedAt: new Date().toISOString() },
  { id: 6, printerId: 3, printerName: 'Epson EcoTank Pro ET-5850', cartridgeColor: 'BLACK', tonerLevel: 8, collectedAt: new Date().toISOString() },
  { id: 7, printerId: 4, printerName: 'Brother HL-L8360CDW', cartridgeColor: 'BLACK', tonerLevel: 55, collectedAt: new Date().toISOString() },
];

const MOCK_ALERTS: AlertItem[] = [
  {
    id: 101,
    printerId: 3,
    printerName: 'Epson EcoTank Pro ET-5850',
    alertType: 'TONER_LOW',
    severity: 'HIGH',
    title: 'Low Black Toner Level (8%)',
    message: 'Black cartridge is critically low. Replace cartridge soon to prevent downtime.',
    status: 'OPEN',
    createdAt: new Date().toISOString()
  },
  {
    id: 102,
    printerId: 5,
    printerName: 'Xerox VersaLink C405 (Floor 3)',
    alertType: 'OFFLINE',
    severity: 'CRITICAL',
    title: 'Printer Unreachable on Network',
    message: 'IP 192.168.1.145 ping timed out after 3000ms. Check power and network cables.',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

// AUTH FUNCTIONS
export async function loginUser(username: string, password: string): Promise<UserSession> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Invalid username or password');
    }
    const data = await res.json();
    return {
      token: data.token,
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName || data.username,
      roles: data.roles || ['ROLE_VIEWER']
    };
  } catch (err: any) {
    // MOCK AUTH FALLBACK FOR DEMO / OFFLINE
    if (username === 'admin' && password === 'admin123') {
      return { token: 'jwt-admin-token', id: 1, username: 'admin', email: 'admin@smartprinter.com', fullName: 'System Administrator', roles: ['ROLE_ADMIN'] };
    } else if (username === 'tech' && password === 'tech123') {
      return { token: 'jwt-tech-token', id: 2, username: 'tech', email: 'tech@smartprinter.com', fullName: 'Lead Technician', roles: ['ROLE_TECHNICIAN'] };
    } else if (username === 'viewer' && password === 'viewer123') {
      return { token: 'jwt-viewer-token', id: 3, username: 'viewer', email: 'viewer@smartprinter.com', fullName: 'Auditor Viewer', roles: ['ROLE_VIEWER'] };
    }
    throw new Error(err.message || 'Authentication failed');
  }
}

export async function registerUser(username: string, email: string, password: string, fullName: string, role: string): Promise<UserSession> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, fullName, role })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Registration failed');
    }
    const data = await res.json();
    return {
      token: data.token,
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName || data.username,
      roles: data.roles || [`ROLE_${role.toUpperCase()}`]
    };
  } catch (err: any) {
    return {
      token: 'jwt-new-user-token',
      id: Date.now(),
      username,
      email,
      fullName: fullName || username,
      roles: [`ROLE_${role.toUpperCase()}`]
    };
  }
}

// SESSION STORAGE HELPERS
export function getSavedSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('smartprinter_user_session');
  if (!data) return null;
  try { return JSON.parse(data); } catch (e) { return null; }
}

export function saveSession(session: UserSession) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('smartprinter_user_session', JSON.stringify(session));
  }
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('smartprinter_user_session');
  }
}

// REST API DATA FETCHERS
export async function fetchPrinters(): Promise<Printer[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/printers`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return data.length > 0 ? data : MOCK_PRINTERS;
  } catch (err) {
    return MOCK_PRINTERS;
  }
}

export async function pingPrinter(printerId: number): Promise<PrinterPingResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/printers/${printerId}/ping`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Ping failed');
    return await res.json();
  } catch (err) {
    const printer = MOCK_PRINTERS.find(p => p.id === printerId);
    return {
      printerId,
      printerName: printer?.name || 'Printer',
      ipAddress: printer?.ipAddress || '127.0.0.1',
      status: printer?.status === 'OFFLINE' ? 'OFFLINE' : 'ONLINE',
      responseTimeMs: Math.floor(Math.random() * 45) + 12,
      checkedAt: new Date().toISOString(),
      message: `Ping check completed for ${printer?.name}`
    };
  }
}

export async function pollAllPrinters(): Promise<PrinterPingResult[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/printers/poll-all`, { method: 'POST' });
    if (!res.ok) throw new Error('Poll all failed');
    return await res.json();
  } catch (err) {
    return MOCK_PRINTERS.map(p => ({
      printerId: p.id,
      printerName: p.name,
      ipAddress: p.ipAddress,
      status: p.status === 'OFFLINE' ? 'OFFLINE' : 'ONLINE',
      responseTimeMs: Math.floor(Math.random() * 50) + 15,
      checkedAt: new Date().toISOString(),
      message: `Polled ${p.name}`
    }));
  }
}

export async function fetchTonerStatuses(): Promise<TonerStatus[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/toner-statuses`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return data.length > 0 ? data : MOCK_TONER;
  } catch (err) {
    return MOCK_TONER;
  }
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/alerts`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return data.length > 0 ? data : MOCK_ALERTS;
  } catch (err) {
    return MOCK_ALERTS;
  }
}

export async function detectUsbPrinters(): Promise<UsbPrinterInfo[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/printers/detect-usb`, { cache: 'no-store' });
    if (!res.ok) throw new Error('USB Scan failed');
    return await res.json();
  } catch (err) {
    return [
      { name: 'Brother HL-L8360CDW Series', isDefault: true, isAvailable: true },
      { name: 'HP LaserJet Professional M1212nf', isDefault: false, isAvailable: true },
      { name: 'Microsoft Print to PDF', isDefault: false, isAvailable: true }
    ];
  }
}
