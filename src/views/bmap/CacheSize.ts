import { CacheOptions } from "./typing";

export class CacheSize {

  #cacheSize: number;

  #enabled: boolean;

  constructor(opt?: CacheOptions) {
    this.#cacheSize = opt?.cacheSize ?? 256;
    this.#enabled = opt?.enabled ?? true;
  }

  async cacheable<T>(resource: () => Promise<T>, key: string): Promise<T> {
    if (!this.#enabled) {
      return resource();
    }
    return resource();
  }
}