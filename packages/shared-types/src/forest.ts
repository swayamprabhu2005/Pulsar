export interface ForestZone {
  id: string;
  name: string;
  region: string;
  isActive: boolean;
}

export interface RelayStation {
  id: string;
  relayUid: string;
  zoneId: string;
  firmwareVersion: string;
  transportCapabilities: Array<'BLE' | 'WIFI' | 'LORA'>;
  latitude?: number;
  longitude?: number;
  batteryLevel?: number;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  lastSeen: string;
}

export interface TripGroup {
  id: string;
  guideId: string;
  zoneId: string;
  name: string;
  joinCode: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CLOSED';
  expiresAt: string;
}
