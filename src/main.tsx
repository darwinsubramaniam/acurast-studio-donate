import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { LunoKitProvider } from '@luno-kit/ui';
import '@luno-kit/ui/styles.css';
import { config, queryClient } from './config';
import App from './App';
import './styles.css';

// Clickjacking guard. GitHub Pages can't send X-Frame-Options / CSP
// frame-ancestors, so if we're loaded inside an iframe, break out to the top
// before the wallet UI renders. (A sandboxed frame may block the redirect; then
// there's nothing more we can do client-side — the wallet's own signing prompt
// remains the trust anchor.)
if (window.self !== window.top) {
  try {
    window.top!.location.href = window.self.location.href;
  } catch {
    /* cross-origin / sandboxed top frame blocked the navigation */
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LunoKitProvider config={config}>
        <App />
      </LunoKitProvider>
    </QueryClientProvider>
  </StrictMode>,
);
