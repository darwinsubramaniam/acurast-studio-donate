import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import App from './App';
import './styles.css';

const root = createRoot(document.getElementById('root')!);

// @polkadot/util-crypto signs/encodes via WASM; initialise it before first render
// so address re-encoding and signing are ready when the user interacts.
cryptoWaitReady().finally(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
