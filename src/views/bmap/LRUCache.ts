import { CacheOptions } from "./typing";

export class LRUCache<T> {
  #cacheLength: number;

  #enabled: boolean;

  #cacheables: Map<string, T> = new Map();

  constructor(opt?: CacheOptions) {
    this.#cacheLength = opt?.cacheLength ?? 256;
    this.#enabled = opt?.enabled ?? true;
  }

  async cacheable(resource: () => Promise<T>, key: string): Promise<T> {
    if (!this.#enabled) {
      return resource();
    }
    if (this.#cacheables.has(key)) {
      const value = this.#cacheables.get(key) as T;
      this.#cacheables.delete(key);
      this.#cacheables.set(key, value);
      return value;
    }
    const value = await resource();
    this.#cacheables.set(key, value);
    if (this.#cacheables.size >= this.#cacheLength) {
      const firstKey = this.#cacheables.keys().next().value;
      this.#cacheables.delete(firstKey);
    }
    return value;
  }

  delete(key: string) {
    this.#cacheables.delete(key);
  }
}
