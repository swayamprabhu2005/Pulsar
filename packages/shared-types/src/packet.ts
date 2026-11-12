export type PacketType =
  | 'EMERGENCY'
  | 'MESSAGE'
  | 'ANNOUNCEMENT'
  | 'SAFEWALK_PING'
  | 'ACK'
  | 'RELAY_STATUS';

export type Priority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type TransportType = 'INTERNET' | 'WIFI_DIRECT' | 'BLE' | 'RELAY_LORA';

export type DeliveryState =
  | 'QUEUED'
  | 'FORWARDING'
  | 'SENT_TO_SERVER'
  | 'DELIVERED_MESH'
  | 'DELIVERED'
  | 'READ'
  | 'EXPIRED'
  | 'FAILED';

export interface EncryptionMeta {
  algorithm: 'X25519-XSALSA20-POLY1305' | 'ED25519-SIGNED' | 'NONE';
  senderPublicKey?: string;
  nonce?: string;
}

export interface MeshPacket {
  packetId: string;
  sourceDeviceId: string;
  destinationId: string;
  messageType: PacketType;
  priority: Priority;
  ttl: number;
  createdAt: number;
  expiresAt: number;
  encryption: EncryptionMeta;
  payload: string;
  deliveryState: DeliveryState;
  signature: string;
  hopTrace?: string[];
}
