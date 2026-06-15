# Acurast Studio — Donate

A small, **non-custodial** wallet-connect donation page for
[Acurast Studio](https://github.com/darwinsubramaniam/acurast-studio). Connect a
Polkadot-ecosystem browser wallet and donate **ACU**, **DOT**, **USDC** or **USDT**
straight to the maintainer — the page never holds or routes funds.

> **DOT, USDC and USDT all settle on Polkadot Asset Hub**, never the relay chain.
> ACU is sent on the Acurast network. Switching between DOT / USDC / USDT is instant
> (they share Asset Hub); only ACU is on a separate chain.

**Live:** https://darwinsubramaniam.github.io/acurast-studio-donate/

## How it works

Everything runs in the browser — there is no backend:

1. [**LunoKit**](https://github.com/Luno-lab/LunoKit) handles wallet connection + UI and,
   under the hood, opens a [**Dedot**](https://github.com/dedotdev/dedot) client to a
   public RPC node over WebSocket.
2. Your wallet extension (Polkadot.js / Talisman / SubWallet) signs the transfer —
   `balances.transferKeepAlive` for native ACU/DOT, or `assets.transferKeepAlive` for
   the USDC/USDT assets on Asset Hub.
3. The signed transaction is submitted directly to the chain. The page only ever sees
   public data; it has no keys and no server.

Your connected wallet's balance for the selected asset is shown above the amount field,
and a copy-address + QR fallback is always available for anyone without an extension.

## Supported assets

| Asset | Network | How it's sent | Destination address |
|---|---|---|---|
| **ACU** | Acurast | `balances.transferKeepAlive` (12 dp) | `5EqCVoSXfLwwEj7zxWvmCMvmiVXZSgeHTj5anpm4sAN6SgXp` |
| **DOT** | Polkadot Asset Hub | `balances.transferKeepAlive` (10 dp) | `13mVe8hbX8DQgG8Wv9ymLWkva7XD8zCRYDp4x7kRRFPcd4ei` |
| **USDT** | Polkadot Asset Hub | `assets.transferKeepAlive(1984, …)` (6 dp) | `13mVe8hbX8DQgG8Wv9ymLWkva7XD8zCRYDp4x7kRRFPcd4ei` |
| **USDC** | Polkadot Asset Hub | `assets.transferKeepAlive(1337, …)` (6 dp) | `13mVe8hbX8DQgG8Wv9ymLWkva7XD8zCRYDp4x7kRRFPcd4ei` |

USDt is asset id **1984** and USDC is asset id **1337** on Polkadot Asset Hub (both 6
decimals). The same Polkadot account (`13mVe8…`, SS58 prefix 0) receives DOT and both
stablecoins on Asset Hub.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run typecheck  # tsc --noEmit
npm run build      # type-check + production build to dist/
npm run preview    # serve the built dist/ under the Pages base path
```

Tech: Vite + React + TypeScript, [LunoKit](https://github.com/Luno-lab/LunoKit)
(`@luno-kit/react` + `@luno-kit/ui`) for wallet connection and UI, and
[Dedot](https://github.com/dedotdev/dedot) (bundled by LunoKit) as the lightweight
Polkadot client. Acurast is added as a custom `Chain`; Polkadot Asset Hub is built in.

## Deploy

Pushes to `main` build and publish to GitHub Pages via
[`.github/workflows/pages.yml`](.github/workflows/pages.yml). Enable it once under
**Settings → Pages → Source → GitHub Actions**.

> The Vite `base` is `'/acurast-studio-donate/'` to match the project-page URL. Change it
> if you rename the repo or use a custom domain.

## License

[MIT](./LICENSE)
