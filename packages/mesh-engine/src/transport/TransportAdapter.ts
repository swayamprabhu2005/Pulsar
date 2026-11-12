import type { MeshPacket } from '@pulsar/shared-types';

export interface TransportPeer {
  id: string;
  name: string;
  transport: 'BLE' | 'WIFI_DIRECT' | 'INTERNET';
  rssi?: number;
}

export interface TransportAdapter {
  name: string;
  isAvailable(): Promise<boolean>;
  discoverPeers(): Promise<TransportPeer[]>;
  sendPacket(peerId: string, packet: MeshPacket): Promise<boolean>;
  onPacketReceived(callback: (packet: MeshPacket, peer: TransportPeer) => void): void;
}
