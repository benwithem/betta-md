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
  meta?: object;
}

export interface KVNamespace {
  get: (key: string, options?: Partial<KVNamespaceGetOptions<undefined>>) => Promise<string | null>;
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

export type RequestContext = {
  env: CloudflareEnv;
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
};

export function getRequestContext(): RequestContext {
  return (globalThis as any).getRequestContext();
}

export type MaintenanceLog = {
  id: number;
  maintenance_type: string;
  water_change_amount?: number;
  filter_cleaned: number;
  substrate_vacuumed: number;
  plants_trimmed: number;
  equipment_cleaned?: string;
  products_used?: string;
  notes?: string;
  ph?: number;
  ammonia?: number;
  nitrite?: number;
  nitrate?: number;
  temperature?: number;
  created_at: string;
};

export type WaterParameters = {
  id: number;
  ph: number;
  temperature?: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  gh?: number;
  kh?: number;
  tds?: number;
  created_at: string;
  notes?: string;
};

export type Equipment = {
  id: number;
  equipment_type: string;
  brand?: string;
  model?: string;
  purchase_date?: string;
  last_maintenance?: string;
  maintenance_interval?: number;
  status: 'active' | 'broken' | 'replaced';
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Inhabitant = {
  id: number;
  species: string;
  count: number;
  date_added: string;
  status: 'active' | 'deceased' | 'removed';
  notes?: string;
  created_at: string;
  updated_at: string;
};