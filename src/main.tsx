import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { LunoKitProvider } from '@luno-kit/ui';
import '@luno-kit/ui/styles.css';
import { config, queryClient } from './config';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LunoKitProvider config={config}>
        <App />
      </LunoKitProvider>
    </QueryClientProvider>
  </StrictMode>,
);
