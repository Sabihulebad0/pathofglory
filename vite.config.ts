// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const TSS_START_PACKAGES = [
  "@tanstack/react-start",
  "@tanstack/react-start-client",
  "@tanstack/react-start-server",
  "@tanstack/start-client-core",
  "@tanstack/start-server-core",
];

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    environments: {
      ssr: {
        build: {
          rollupOptions: {
            output: {
              // @tanstack/start-server-core calls `createCsrfMiddleware(...)` at module
              // scope, and that function lives in start-client-core. Splitting the two
              // packages across chunks makes those chunks import each other (the server
              // namespace is re-exported back through the chunk holding the csrf helper).
              // ESM then runs the consumer first, so the still-unassigned `var` reads as
              // undefined: "createCsrfMiddleware is not a function", every request 500s.
              // Chunking differs per preset — Vercel splits them, Cloudflare doesn't — so
              // keeping the whole Start family in one chunk removes the cross-chunk edges
              // entirely and makes the server build behave the same on every target.
              manualChunks(id) {
                const normalised = id.split("\\").join("/");
                if (TSS_START_PACKAGES.some((pkg) => normalised.includes(`/${pkg}/`))) {
                  return "tss-start";
                }
              },
            },
          },
        },
      },
    },
  },
});
