// Redis utility for production rate limiting and caching
import Redis from 'ioredis';

// Redis client instance
let redisClient: Redis | null = null;

// Initialize Redis connection
export function initRedis(): Redis {
  if (redisClient) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    console.warn('REDIS_URL not found in environment variables. Falling back to memory storage.');
    return null as any;
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redisClient.on('error', (err: Error) => {
      console.error('Redis connection error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });

    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    return null as any;
  }
}

// Get Redis client
export function getRedisClient(): Redis | null {
  if (!redisClient) {
    return initRedis();
  }
  return redisClient;
}

// Close Redis connection
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

// Redis-based rate limiting
export async function redisRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number; resetTime?: number }> {
  const client = getRedisClient();
  
  if (!client) {
    // Fallback to memory-based rate limiting
    console.warn('Redis not available, falling back to memory rate limiting');
    return memoryRateLimit(identifier, maxRequests, windowMs);
  }

  const key = `rate_limit:${identifier}`;
  const windowSeconds = Math.ceil(windowMs / 1000);
  const now = Math.floor(Date.now() / 1000);
  const pipeline = client.pipeline();

  try {
    // Use Redis sliding window algorithm
    const results = await pipeline
      .zremrangebyscore(key, 0, now - windowSeconds) // Remove old entries
      .zcard(key) // Count current entries
      .zadd(key, now, `${now}-${Math.random()}`) // Add current request
      .expire(key, windowSeconds) // Set expiration
      .exec();

    const currentCount = results?.[1]?.[1] as number || 0;
    const remaining = Math.max(0, maxRequests - currentCount - 1);
    const success = currentCount < maxRequests;
    const resetTime = now + windowSeconds;

    return { success, remaining, resetTime };
  } catch (error) {
    console.error('Redis rate limiting error:', error);
    // Fallback to memory-based rate limiting
    return memoryRateLimit(identifier, maxRequests, windowMs);
  }
}

// Memory-based rate limiting (fallback)
const memoryRateStore = new Map<string, { count: number; resetTime: number }>();

function memoryRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number; resetTime?: number } {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up old entries
  memoryRateStore.forEach((value, key) => {
    if (value.resetTime < now) {
      memoryRateStore.delete(key);
    }
  });
  
  // Check current rate limit
  const current = memoryRateStore.get(identifier);
  
  if (!current) {
    memoryRateStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }
  
  if (current.count >= maxRequests) {
    return { 
      success: false, 
      remaining: 0,
      resetTime: current.resetTime
    };
  }
  
  current.count++;
  return { success: true, remaining: maxRequests - current.count };
}

// Redis-based caching
export async function redisCache(
  key: string,
  value: any,
  ttlSeconds: number = 3600
): Promise<void> {
  const client = getRedisClient();
  
  if (!client) {
    console.warn('Redis not available, skipping cache operation');
    return;
  }

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error('Redis cache error:', error);
  }
}

// Get cached value
export async function redisGetCache(key: string): Promise<any | null> {
  const client = getRedisClient();
  
  if (!client) {
    return null;
  }

  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis get cache error:', error);
    return null;
  }
}

// Delete cache key
export async function redisDeleteCache(key: string): Promise<void> {
  const client = getRedisClient();
  
  if (!client) {
    return;
  }

  try {
    await client.del(key);
  } catch (error) {
    console.error('Redis delete cache error:', error);
  }
}