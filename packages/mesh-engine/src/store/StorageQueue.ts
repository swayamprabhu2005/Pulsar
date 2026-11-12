import type { MeshPacket } from '@pulsar/shared-types';

export interface StorageQueueAdapter {
  enqueue(packet: MeshPacket): Promise<void>;
  dequeueEligible(limit?: number): Promise<MeshPacket[]>;
  markDelivered(packetId: string): Promise<void>;
  purgeExpired(): Promise<number>;
  count(): Promise<number>;
}

export class MemoryStorageQueue implements StorageQueueAdapter {
  private queue: MeshPacket[] = [];

  async enqueue(packet: MeshPacket): Promise<void> {
    this.queue.push(packet);
    // Sort highest priority first (CRITICAL > HIGH > NORMAL > LOW)
    const priorityWeight: Record<string, number> = {
      CRITICAL: 4,
      HIGH: 3,
      NORMAL: 2,
      LOW: 1,
    };
    this.queue.sort((a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0));
  }

  async dequeueEligible(limit = 20): Promise<MeshPacket[]> {
    const now = Date.now();
    return this.queue.filter((p) => p.expiresAt > now && p.deliveryState !== 'DELIVERED').slice(0, limit);
  }

  async markDelivered(packetId: string): Promise<void> {
    const pkt = this.queue.find((p) => p.packetId === packetId);
    if (pkt) pkt.deliveryState = 'DELIVERED';
  }

  async purgeExpired(): Promise<number> {
    const now = Date.now();
    const initial = this.queue.length;
    this.queue = this.queue.filter((p) => p.expiresAt > now);
    return initial - this.queue.length;
  }

  async count(): Promise<number> {
    return this.queue.length;
  }
}
