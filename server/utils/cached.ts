interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cacheStore = new Map<string, CacheEntry<any>>();

export function cached<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  key: string,
  cacheTimeMinutes: number
): (...args: Args) => Promise<T> {
  const cacheTimeMs = cacheTimeMinutes * 60 * 1000;

  return async (...args: Args): Promise<T> => {
    const cachedEntry = cacheStore.get(key);
    const now = Date.now();

    if (cachedEntry && (now - cachedEntry.timestamp < cacheTimeMs)) {
      // Cache hit and still valid
      return cachedEntry.data;
    }

    // Cache miss or expired, call the original function
    const result = await fn(...args);

    // Store the new result in cache
    cacheStore.set(key, { data: result, timestamp: now });

    return result;
  };
}