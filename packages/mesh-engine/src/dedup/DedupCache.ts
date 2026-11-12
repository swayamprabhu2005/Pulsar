export class DedupCache {
  private cache: Map<string, number> = new Map();
  private maxEntries: number;
  private defaultTtlMs: number;

  constructor(maxEntries = 2000, defaultTtlMs = 1000 * 60 * 60) {
    this.maxEntries = maxEntries;
    this.defaultTtlMs = defaultTtlMs;
  }

  /**
   * Returns true if packet was already seen. If not seen, registers it.
   */
  public hasOrAdd(packetId: string, ttlMs = this.defaultTtlMs): boolean {
    const now = Date.now();
    const expiry = this.cache.get(packetId);

    if (expiry !== undefined) {
      if (expiry > now) {
        return true; // Already seen and still valid
      }
      this.cache.delete(packetId);
    }

    // Evict oldest if capacity reached
    if (this.cache.size >= this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(packetId, now + ttlMs);
    return false;
  }

  public purgeExpired(): void {
    const now = Date.now();
    for (const [key, expiry] of this.cache.entries()) {
      if (expiry <= now) {
        this.cache.delete(key);
      }
    }
  }

  public size(): number {
    return this.cache.size;
  }
}
