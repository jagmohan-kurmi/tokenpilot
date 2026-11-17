import type { CacheEntry } from './types';

export class SimpleCache<T> {
  private entries = new Map<string, CacheEntry<T>>();

  constructor(private readonly ttlMs: number = 300_000) {}

  get(key: string): T | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T): void {
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs
    });
  }

  clear(): void {
    this.entries.clear();
  }
}
