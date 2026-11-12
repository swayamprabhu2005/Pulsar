import type { MeshPacket } from '@pulsar/shared-types';
import { DedupCache } from './dedup/DedupCache';
import { PacketEngine } from './packet/PacketEngine';
import { StorageQueueAdapter, MemoryStorageQueue } from './store/StorageQueue';
import { TransportAdapter, TransportPeer } from './transport/TransportAdapter';

export interface MeshNodeConfig {
  deviceId: string;
  maxHops?: number;
}

export class MeshNode {
  private deviceId: string;
  private dedupCache: DedupCache;
  private queue: StorageQueueAdapter;
  private transports: TransportAdapter[] = [];
  private onAppMessageReceived?: (packet: MeshPacket) => void;

  constructor(config: MeshNodeConfig, queue?: StorageQueueAdapter) {
    this.deviceId = config.deviceId;
    this.dedupCache = new DedupCache();
    this.queue = queue ?? new MemoryStorageQueue();
  }

  public registerTransport(adapter: TransportAdapter): void {
    this.transports.push(adapter);
    adapter.onPacketReceived((packet, peer) => this.handleIncomingPacket(packet, peer));
  }

  public setAppListener(listener: (packet: MeshPacket) => void): void {
    this.onAppMessageReceived = listener;
  }

  public async broadcastOrSend(packet: MeshPacket): Promise<void> {
    // Add to local dedup so we never re-forward our own origin packet
    this.dedupCache.hasOrAdd(packet.packetId);
    await this.queue.enqueue(packet);
    await this.attemptForward(packet);
  }

  public async handleIncomingPacket(packet: MeshPacket, _fromPeer: TransportPeer): Promise<void> {
    // 1. Expiration check
    if (PacketEngine.isExpired(packet)) {
      return;
    }

    // 2. Dedup check (critical: anti-flood loops)
    if (this.dedupCache.hasOrAdd(packet.packetId)) {
      return; // Already seen, drop silently
    }

    // 3. Check if target is this device or a broadcast
    const isBroadcast = packet.destinationId === 'BROADCAST' || packet.destinationId.startsWith('CHANNEL_');
    const isForMe = packet.destinationId === this.deviceId || isBroadcast;

    if (isForMe && this.onAppMessageReceived) {
      this.onAppMessageReceived(packet);
    }

    // 4. Relay forwarding: decrement TTL and forward if hops remain
    const forwardedPacket = PacketEngine.decrementTtl(packet, this.deviceId);
    if (forwardedPacket) {
      await this.queue.enqueue(forwardedPacket);
      await this.attemptForward(forwardedPacket);
    }
  }

  private async attemptForward(packet: MeshPacket): Promise<void> {
    for (const transport of this.transports) {
      try {
        const available = await transport.isAvailable();
        if (!available) continue;

        const peers = await transport.discoverPeers();
        for (const peer of peers) {
          // Do not loop back to immediate previous hop
          const lastHop = packet.hopTrace?.[packet.hopTrace.length - 1];
          if (peer.id === lastHop) continue;

          await transport.sendPacket(peer.id, packet);
        }
      } catch {
        // Continue to other transports gracefully
      }
    }
  }

  public getDeviceId(): string {
    return this.deviceId;
  }

  public getQueue(): StorageQueueAdapter {
    return this.queue;
  }
}
