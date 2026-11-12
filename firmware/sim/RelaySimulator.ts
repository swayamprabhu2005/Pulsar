import { MeshNode } from '@pulsar/mesh-engine';
import { PacketEngine } from '@pulsar/mesh-engine';
import type { MeshPacket } from '@pulsar/shared-types';

export interface SimulatedRelayStationConfig {
  relayId: string;
  zone: string;
  batteryLevel?: number;
}

/**
 * Software simulation of ESP32 Relay Station for local testing & CI
 * without requiring physical development boards.
 */
export class RelaySimulator {
  public readonly relayId: string;
  public readonly zone: string;
  public batteryLevel: number;
  public packetsForwarded = 0;
  private node: MeshNode;

  constructor(config: SimulatedRelayStationConfig) {
    this.relayId = config.relayId;
    this.zone = config.zone;
    this.batteryLevel = config.batteryLevel ?? 98;
    this.node = new MeshNode({ deviceId: this.relayId });
  }

  public async receivePacketFromDevice(packet: MeshPacket): Promise<boolean> {
    if (PacketEngine.isExpired(packet)) return false;

    this.packetsForwarded++;
    console.log(`[RelaySimulator:${this.relayId}] Forwarded packet: ${packet.packetId} (Priority: ${packet.priority})`);
    await this.node.broadcastOrSend(packet);
    return true;
  }

  public getStatus() {
    return {
      relayId: this.relayId,
      zone: this.zone,
      batteryLevel: this.batteryLevel,
      packetsForwarded: this.packetsForwarded,
      status: this.batteryLevel > 15 ? 'ONLINE' : 'DEGRADED',
      lastSeen: new Date().toISOString(),
    };
  }
}
