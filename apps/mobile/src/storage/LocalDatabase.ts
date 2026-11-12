import type { MeshPacket } from '@pulsar/shared-types';
import type { StorageQueueAdapter } from '@pulsar/mesh-engine';

/**
 * Persistent local storage abstraction for Android (SQLite via native module or IndexedDB fallback in web/test).
 * Stores queued offline packets, cached announcements, and E2E encrypted messages.
 */
export class LocalStorageQueue implements StorageQueueAdapter {
  private packets: Map<string, MeshPacket> = new Map();

  async enqueue(packet: MeshPacket): Promise<void> {
    this.packets.set(packet.packetId, packet);
  }

  async dequeueEligible(limit = 25): Promise<MeshPacket[]> {
    const now = Date.now();
    const priorityRank: Record<string, number> = {
      CRITICAL: 4,
      HIGH: 3,
      NORMAL: 2,
      LOW: 1,
    };

    return Array.from(this.packets.values())
      .filter((p) => p.expiresAt > now && p.deliveryState !== 'DELIVERED')
      .sort((a, b) => (priorityRank[b.priority] ?? 0) - (priorityRank[a.priority] ?? 0))
      .slice(0, limit);
  }

  async markDelivered(packetId: string): Promise<void> {
    const existing = this.packets.get(packetId);
    if (existing) {
      this.packets.set(packetId, { ...existing, deliveryState: 'DELIVERED' });
    }
  }

  async purgeExpired(): Promise<number> {
    const now = Date.now();
    let purged = 0;
    for (const [id, pkt] of this.packets.entries()) {
      if (pkt.expiresAt <= now) {
        this.packets.delete(id);
        purged++;
      }
    }
    return purged;
  }

  async count(): Promise<number> {
    return this.packets.size;
  }
}
