export interface CacheManagerPort {
  zadd(key: string, score: number, value: string): Promise<void>;
  zrevrange(key: string, start: number, stop: number): Promise<string[]>;
  zremrangebyrank(key: string, start: number, stop: number): Promise<void>;
  expire(key: string, ttl: number): Promise<void>;
}
