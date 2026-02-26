import {useLogger} from "#server/utils/logger";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cacheStore = new Map<string, CacheEntry<any>>();

export function cached<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  key: string,
  cacheTimeMinutes = 40,
): (...args: Args) => Promise<T> {
  const logger = useLogger('cache');
  const cacheTimeMs = cacheTimeMinutes * 60 * 1000;

  logger.info({
    key,
    cacheTimeMinutes,
  }, `create cache`);
  return async (...args: Args): Promise<T> => {
    logger.info({
      key,
      cacheTimeMs,
    }, 'run cache function');
    const cachedEntry = cacheStore.get(key);
    const now = Date.now();

    if (cachedEntry && (now - cachedEntry.timestamp < cacheTimeMs)) {
      logger.info({
        key,
        cacheTimeMs,
      }, '📤 return cached data');
      return cachedEntry.data;
    }

    logger.info({
      key,
      cacheTimeMs,
    }, '🚚 skip cache and made request');

    const result = await fn(...args);

    logger.info({
      key,
      cacheTimeMs,
    }, '📥 set data to cache');

    cacheStore.set(key, { data: result, timestamp: now });

    return result;
  };
}

export const deleteCache = (key: string) => {
  const logger = useLogger('cache');
  logger.info({
      key
  }, 'run delete cache function');
  if (cacheStore.has(key)) {
    cacheStore.delete(key);
    logger.info({
      key
    }, 'cache successfully deleted');
  } else {
    logger.info({
      key
    }, 'cache does not exist');
    return 1;
  }
};

export const readCachedKeys = () => {
  console.log(cacheStore.size, cacheStore.keys())
  return cacheStore.keys().toArray();
};

export const readCache = (key: string) => {
  return cacheStore.get(key);
};
