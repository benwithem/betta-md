import { D1Database, getRequestContext } from '../types/cloudflare.d';

let db: D1Database;

export async function getDB(): Promise<D1Database> {
  if (!db) {
    const ctx = getRequestContext();
    db = ctx.env.DB;
  }
  return db;
}

export async function query(
  sql: string,
  params?: unknown[]
): Promise<unknown[]> {
  const db = await getDB();
  const result = await db.prepare(sql).bind(params || []).first<unknown[]>();
  return result || [];
}