import { Injectable } from '@nestjs/common';
import * as NodeCache from 'node-cache';

const cache = new NodeCache();
const HALF_DAY_IN_SECONDS = 43200;

@Injectable()
export class CacheService {
  getCache<T>(key:string):T {
    const data = cache.get(key);
    return data as T;
  }

  setCache<T>(key: string, data: T):void {
    cache.set(
      key,
      data,
      HALF_DAY_IN_SECONDS
    );
  }
}
