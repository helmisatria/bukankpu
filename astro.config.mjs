import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  vite: {
    plugins: [TanStackRouterVite()],
  },
  adapter: cloudflare({
    runtime: {
      mode: "local",
      type: "pages",
      bindings: {
        DB: {
          type: "d1",
        },
        KV: {
          type: "kv",
        },
      },
    },
  }),
  integrations: [
    react(),
    tailwind(),
  ],
});
