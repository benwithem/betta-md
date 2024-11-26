import { NextRequest } from 'next/server';

export interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface D1Database {
  prepare(sql: string): {
    bind(params: unknown[]): {
      first<T>(): Promise<T | undefined>;
    };
  };
}

export interface CloudflareEnv {
  MY_KV_NAMESPACE: KVNamespace;
  DB: D1Database;
  USER_ID?: number;
}

export function getRequestContext(): {
  env: CloudflareEnv;
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
} {
  const ctx = (globalThis as any).getRequestContext();
  const userId = ctx.env.USER_ID;

  return {
    env: {
      ...ctx.env,
      userId,
    },
    waitUntil: ctx.waitUntil,
    passThroughOnException: ctx.passThroughOnException,
  };
}