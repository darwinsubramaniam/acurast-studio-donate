# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page, **non-custodial** donation app for Acurast Studio. The browser connects a
Polkadot-ecosystem wallet extension and submits a transfer extrinsic directly to the chain.
There is **no backend** — the page only ever sees public on-chain data, holds no keys, and
routes no funds. Donors send **ACU** (Acurast network) or **DOT / USDC / USDT** (all on
Polkadot Asset Hub).

## Commands

```bash
npm run dev        # Vite dev server
npm run typecheck  # tsc --noEmit (strict; noUnusedLocals/Parameters on)
npm run build      # typecheck THEN vite build → dist/
npm run preview    # serve dist/ under the GitHub Pages base path
npm test           # vitest run (once); npm run test:watch for watch mode
```

Testing is **Vitest + Testing Library** (jsdom). Specs live next to the code as
`*.test.ts(x)` under `src/`; matched by `test.include` in `vite.config.ts`, with jest-dom
matchers registered in `src/test/setup.ts`. `vitest/globals` is in `tsconfig` types so
`describe/it/expect` need no import and `tsc` covers test files during `build`. There is
**no linter** — `typecheck` + `test` are the static gates.

When testing money math (`src/lib/amount.ts`) or asset routing constants
(`src/lib/assets.ts` — `assetId`, `decimals`, `dest`), assert exact expected values:
a wrong constant there misdirects real funds. Components that lean on LunoKit hooks
(`DonateForm`, `App`, `useAssetBalance`) need those hooks mocked; the presentational
`AssetSelector` is tested directly without mocks as the reference example.

## Architecture

The whole transfer flow is driven by one data structure. To add/change an asset or
destination, edit `src/lib/assets.ts` — almost nothing else needs to change.

- **`src/lib/assets.ts`** — the single source of truth. `ASSETS: DonationAsset[]` defines
  every donatable token: its decimals, which chain it lives on (`chainGenesisHash`), whether
  it's `kind: 'native'` (balances pallet) or `kind: 'asset'` (Asset Hub assets pallet, needs
  `assetId`), destination address, presets, and Subscan link base. Components map over this
  array; they contain no per-asset logic.
- **`src/lib/chains.ts`** — Acurast is **not** a built-in LunoKit chain, so it's hand-defined
  as a `Chain` (genesisHash/ss58/decimals were read from the live RPC). `polkadotAssetHub` is
  re-exported from LunoKit. These two chains are registered in `src/config.ts`.
- **`src/config.ts`** — `createConfig` registers the two chains + three desktop connectors
  (Polkadot.js, SubWallet, Talisman). Scope is desktop browser extensions only — no
  WalletConnect/mobile.
- **`src/lib/amount.ts`** — all token amounts are `bigint` planck; conversion is string-based
  (`toPlanck`/`formatPlanck`) to avoid float rounding, because dedot extrinsics take bigint.

### Chain-switching model (important)

DOT, USDC and USDT all share Polkadot Asset Hub, so switching among them is a pure UI change.
Only crossing **to/from ACU** triggers an actual `switchChainAsync`. `App.tsx` derives
`ready = onChain && isApiReady && !switching` and gates the donate form on it; `selectAsset`
only switches chains when `chain.genesisHash !== next.chainGenesisHash`.

### Transaction & balance dispatch

The `native` vs `asset` distinction selects both the extrinsic and the balance query:

- **native (ACU, DOT):** `api.tx.balances.transferKeepAlive(dest, planck)`; balance from
  `system.account().data.free`.
- **asset (USDt=1984, USDC=1337):** `api.tx.assets.transferKeepAlive(assetId, dest, planck)`;
  balance from `assets.account([assetId, address]).balance`.

`useAssetBalance` subscribes live and unsubscribes on cleanup. dedot's default-client query
generics are loose, so `api.query` is cast to `any` there — intentional, not a gap to "fix".

### Stack

Vite + React 19 + TypeScript. **LunoKit** (`@luno-kit/react` hooks + `@luno-kit/ui`
`ConnectButton`/`LunoKitProvider`) handles wallet UX and bundles **dedot** as the Polkadot
client. Provider tree (`src/main.tsx`): `QueryClientProvider` → `LunoKitProvider` → `App`.

**Do not bump `dedot` / `@dedot/chaintypes` independently.** The `api` object comes from
LunoKit, which pins `dedot@0.16.0` / `@dedot/chaintypes@0.152.0` (and declares them as peers
at `^0.16.0` / `^0.152.0`). Our code never imports `dedot` directly — only LunoKit hooks — so
a direct bump to dedot 1.x is *inert* (LunoKit keeps using 0.16.0) and just duplicates dedot
in `node_modules`. Keep our direct ranges matched to LunoKit's (`^0.16.0` / `^0.152.0`) so the
tree dedupes. dedot only moves when LunoKit moves (dedot 1.0.0 is a breaking major).

## Build & deploy gotchas

- **Vite `base` is `/acurast-studio-donate/`** to match the GitHub Pages project URL. If the
  repo is renamed or a custom domain is used, change it. Static assets in `public/` (e.g. the
  Acurast chain icon) must be referenced via `import.meta.env.BASE_URL`, not absolute `/` —
  see `chains.ts` `chainIconUrl`.
- **node polyfills are required:** dedot/WalletConnect reference `Buffer`/`process`/`global`,
  shimmed by `vite-plugin-node-polyfills` + `define: { global: 'globalThis' }` in
  `vite.config.ts`. Removing these breaks the browser build.
- `vite.config.ts` deliberately silences two non-issues: an `INVALID_ANNOTATION` warning from
  the transitive `ox` package and the chunk-size warning (the wallet/crypto stack is large by
  nature). Don't treat their reappearance as new problems.
- **Deploy:** every push to `main` builds and publishes to GitHub Pages via
  `.github/workflows/pages.yml`. No manual deploy step.
