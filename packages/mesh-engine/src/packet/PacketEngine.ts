import type { MeshPacket, PacketType, Priority } from '@pulsar/shared-types';

export interface CreatePacketOptions {
  sourceDeviceId: string;
  destinationId: string;
  messageType: PacketType;
  priority?: Priority;
  ttl?: number;
  ttlMs?: number;
  payload: string;
  senderPublicKey?: string;
  signature?: string;
}

export class PacketEngine {
  public static createPacket(opts: CreatePacketOptions): MeshPacket {
    const now = Date.now();
    const ttlMs = opts.ttlMs ?? 1000 * 60 * 60 * 24; // 24 hours default
    const ttl = opts.ttl ?? (opts.priority === 'CRITICAL' ? 10 : 7);

    return {
      packetId: `pkt_${now}_${Math.random().toString(36).slice(2, 10)}`,
      sourceDeviceId: opts.sourceDeviceId,
      destinationId: opts.destinationId,
      messageType: opts.messageType,
      priority: opts.priority ?? 'NORMAL',
      ttl,
      createdAt: now,
      expiresAt: now + ttlMs,
      encryption: {
        algorithm: opts.senderPublicKey ? 'X25519-XSALSA20-POLY1305' : 'NONE',
        senderPublicKey: opts.senderPublicKey,
      },
      payload: opts.payload,
      deliveryState: 'QUEUED',
      signature: opts.signature ?? '',
      hopTrace: [opts.sourceDeviceId],
    };
  }

  public static isExpired(packet: MeshPacket): boolean {
    return Date.now() >= packet.expiresAt;
  }

  public static decrementTtl(packet: MeshPacket, forwarderDeviceId: string): MeshPacket | null {
    if (packet.ttl <= 1) return null;
    return {
      ...packet,
      ttl: packet.ttl - 1,
      hopTrace: [...(packet.hopTrace ?? []), forwarderDeviceId],
    };
  }
}
