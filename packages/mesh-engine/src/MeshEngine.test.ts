import test from 'node:test';
import assert from 'node:assert';
import { DedupCache, PacketEngine, MeshNode, TransportAdapter, TransportPeer } from './index';
import type { MeshPacket } from '@pulsar/shared-types';

test('DedupCache catches duplicate packet IDs', () => {
  const cache = new DedupCache(100);
  assert.strictEqual(cache.hasOrAdd('pkt-1'), false);
  assert.strictEqual(cache.hasOrAdd('pkt-1'), true); // Duplicate!
  assert.strictEqual(cache.hasOrAdd('pkt-2'), false);
});

test('PacketEngine enforces TTL and hopTrace', () => {
  const pkt = PacketEngine.createPacket({
    sourceDeviceId: 'device-A',
    destinationId: 'device-C',
    messageType: 'EMERGENCY',
    priority: 'CRITICAL',
    payload: 'Help needed',
  });

  assert.strictEqual(pkt.ttl, 10);
  assert.deepStrictEqual(pkt.hopTrace, ['device-A']);

  const hopped = PacketEngine.decrementTtl(pkt, 'device-B');
  if (!hopped) {
    assert.fail('Expected hopped packet to be non-null');
    return;
  }
  assert.strictEqual(hopped.ttl, 9);
  assert.deepStrictEqual(hopped.hopTrace, ['device-A', 'device-B']);
});

test('Three-device Mesh Multi-Hop forwarding: A -> B -> C', async () => {
  const messagesReceivedAtC: MeshPacket[] = [];

  class MockDirectTransport implements TransportAdapter {
    name = 'MockDirect';
    public peerNodeMap: Map<string, MeshNode> = new Map();
    private listener?: (p: MeshPacket, peer: TransportPeer) => void;

    constructor(private ownerId: string) {}

    async isAvailable() { return true; }
    async discoverPeers(): Promise<TransportPeer[]> {
      const peers: TransportPeer[] = [];
      for (const id of this.peerNodeMap.keys()) {
        peers.push({ id, name: `Peer-${id}`, transport: 'BLE' });
      }
      return peers;
    }
    async sendPacket(peerId: string, packet: MeshPacket): Promise<boolean> {
      const target = this.peerNodeMap.get(peerId);
      if (target) {
        await target.handleIncomingPacket(packet, { id: this.ownerId, name: this.ownerId, transport: 'BLE' });
        return true;
      }
      return false;
    }
    onPacketReceived(cb: (p: MeshPacket, peer: TransportPeer) => void) {
      this.listener = cb;
    }
  }

  // Setup 3 nodes: A can reach B, B can reach C. A CANNOT reach C directly!
  const nodeA = new MeshNode({ deviceId: 'device-A' });
  const nodeB = new MeshNode({ deviceId: 'device-B' });
  const nodeC = new MeshNode({ deviceId: 'device-C' });

  const transportA = new MockDirectTransport('device-A');
  const transportB = new MockDirectTransport('device-B');
  const transportC = new MockDirectTransport('device-C');

  // A connects to B only
  transportA.peerNodeMap.set('device-B', nodeB);
  // B connects to both A and C
  transportB.peerNodeMap.set('device-A', nodeA);
  transportB.peerNodeMap.set('device-C', nodeC);
  // C connects to B only
  transportC.peerNodeMap.set('device-B', nodeB);

  nodeA.registerTransport(transportA);
  nodeB.registerTransport(transportB);
  nodeC.registerTransport(transportC);

  nodeC.setAppListener((packet) => {
    messagesReceivedAtC.push(packet);
  });

  // Node A sends an Emergency packet to Node C
  const emergencyPkt = PacketEngine.createPacket({
    sourceDeviceId: 'device-A',
    destinationId: 'device-C',
    messageType: 'EMERGENCY',
    priority: 'CRITICAL',
    payload: 'SOS Flash Flood coordinate (12.9716, 77.5946)',
  });

  await nodeA.broadcastOrSend(emergencyPkt);

  // Assert Node C received the message multi-hop routed through B
  assert.strictEqual(messagesReceivedAtC.length, 1);
  assert.strictEqual(messagesReceivedAtC[0].payload, 'SOS Flash Flood coordinate (12.9716, 77.5946)');
  assert.deepStrictEqual(messagesReceivedAtC[0].hopTrace, ['device-A', 'device-B']);
});
