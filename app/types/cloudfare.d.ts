// types/cloudflare.d.ts

interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
  }
  
  interface Env {
    MY_KV_NAMESPACE: KVNamespace;
    // Add other bindings here
  }
  
  declare global {
    function getRequestContext(): {
      env: Env;
      waitUntil(promise: Promise<any>): void;
      passThroughOnException(): void;
    };
  }
  
  export {};