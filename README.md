# Acurast Studio — Donate

A small, **non-custodial** wallet-connect donation page for
[Acurast Studio](https://github.com/darwinsubramaniam/acurast-studio). Connect a
Polkadot-ecosystem browser wallet and send **ACU** (Acurast) or **DOT** (Polkadot)
straight to the maintainer — the page never holds or routes funds.

**Live:** https://darwinsubramaniam.github.io/acurast-studio-donate/

## How it works

Everything runs in the browser — there is no backend:

1. The page talks to a public RPC node over WebSocket (`@polkadot/api`).
2. Your wallet extension (Polkadot.js / Talisman / SubWallet) signs a
   `balances.transferKeepAlive` to the donation address.
3. The signed transaction is submitted directly to the chain. The page only ever sees
   public data; it has no keys and no server.

A copy-address + QR fallback is always shown for anyone without an extension.

## Donation addresses

| Network | Address |
|---|---|
| **ACU** (Acurast, SS58 prefix 42) | `5EqCVoSXfLwwEj7zxWvmCMvmiVXZSgeHTj5anpm4sAN6SgXp` |
| **DOT** (Polkadot, SS58 prefix 0) | `13mVe8hbX8DQgG8Wv9ymLWkva7XD8zCRYDp4x7kRRFPcd4ei` |

## Develop

```bash
npm install
npm run dev        # local dev server
npm run typecheck  # tsc --noEmit
npm run build      # type-check + production build to dist/
npm run preview    # serve the built dist/ under the Pages base path
```

Tech: Vite + React + TypeScript, `@polkadot/api` + `@polkadot/extension-dapp`, with
`vite-plugin-node-polyfills` for the `Buffer`/`process` shims the Polkadot libs need.

## Deploy

Pushes to `main` build and publish to GitHub Pages via
[`.github/workflows/pages.yml`](.github/workflows/pages.yml). Enable it once under
**Settings → Pages → Source → GitHub Actions**.

> The Vite `base` is `'/acurast-studio-donate/'` to match the project-page URL. Change it
> if you rename the repo or use a custom domain.

## License

[MIT](./LICENSE)
