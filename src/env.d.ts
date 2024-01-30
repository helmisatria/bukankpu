/// <reference types="astro/client" />

type KVNamespace = import("@cloudflare/workers-types/experimental").KVNamespace;
type D1Database = import("@cloudflare/workers-types").D1Database;

type ENV = {
  SERVER_URL: string;
  KV_BINDING: KVNamespace;
  DB: D1Database;
};

type Runtime = import("@astrojs/cloudflare").AdvancedRuntime<ENV>;

declare namespace App {
  interface Locals extends Runtime {}
}
