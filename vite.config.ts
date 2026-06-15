import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// Project page lives at https://<owner>.github.io/acurast-studio-donate/, so all
// asset URLs must be prefixed with the repo name.
export default defineConfig({
  base: '/acurast-studio-donate/',
  plugins: [
    react(),
    // @polkadot/* / dedot reference Buffer / process / global, which don't exist
    // in the browser. These polyfills shim them at build time.
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
    }),
  ],
  define: { global: 'globalThis' },
  build: {
    // The wallet/crypto stack (dedot + LunoKit + WalletConnect) is inherently large;
    // ~578 kB raw is ~180 kB gzipped, which is fine. Raise the soft limit so the
    // expected size doesn't surface as a warning.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      onwarn(warning, warn) {
        // `ox` (a transitive dep via WalletConnect) ships /*#__PURE__*/ annotations
        // in positions Rolldown can't interpret. Harmless tree-shaking hints in a
        // third-party package — silence the noise, surface everything else.
        if (warning.code === 'INVALID_ANNOTATION') return;
        warn(warning);
      },
    },
  },
});
