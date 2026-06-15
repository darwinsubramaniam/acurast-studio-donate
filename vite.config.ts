import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// Project page lives at https://<owner>.github.io/acurast-studio-donate/, so all
// asset URLs must be prefixed with the repo name.
export default defineConfig({
  base: '/acurast-studio-donate/',
  plugins: [
    react(),
    // @polkadot/* libraries reference Buffer / process / global, which don't
    // exist in the browser. These polyfills shim them at build time.
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
    }),
  ],
  define: { global: 'globalThis' },
});
