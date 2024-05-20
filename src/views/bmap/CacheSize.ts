import { CacheOptions } from "./typing";

export class CacheSize {

  private cacheSize: number;

  private enabled: boolean;

  constructor(opt?: CacheOptions) {
    this.cacheSize = opt?.cacheSize ?? 256;
    this.enabled = opt?.enabled ?? true;
  }

  async cacheable<T>(resource: () => Promise<T>, key: string): Promise<T> {
    return new Promise((resolve, reject) => {
    });
  }
}