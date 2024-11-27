export interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
  dump: () => Promise<ArrayBuffer>;
  batch: (statements: D1PreparedStatement[]) => Promise<D1Result[]>;
  exec: (query: string) => Promise<D1Result>;
}

export interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = unknown>(colName?: string) => Promise<T | null>;
  run: () => Promise<D1Result>;
  all: <T = unknown>() => Promise<D1Result<T>>;
}

export interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta?: Record<string, unknown>;
}

export interface KVNamespace {
  get: (key: string, options?: Partial<KVNamespacePutOptions>) => Promise<string | null>;
  put: (key: string, value: string | ReadableStream | ArrayBuffer, options?: KVNamespacePutOptions) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  KV: KVNamespace;
}

export interface CloudflareEnv extends Env {
  DB: D1Database;
}

export interface RequestContext {
  env: CloudflareEnv;
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
}

export interface KVNamespacePutOptions {
  expiration?: number;
  expirationTtl?: number;
  metadata?: Record<string, unknown>;
}

// Add this function to get the request context
export function getRequestContext(): RequestContext {
  // @ts-expect-error Cloudflare Workers runtime provides this global
  return globalThis.process?.env?.CLOUDFLARE_CONTEXT || {};
}