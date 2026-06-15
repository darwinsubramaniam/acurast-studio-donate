import { useChain, useChains, useSwitchChain } from '@luno-kit/react';

// ACU / DOT tabs. Switching the chain swaps the RPC + destination address,
// because each chain carries its own Dedot client + donation address.
export function NetworkToggle() {
  const chains = useChains();
  const { chain } = useChain();
  const { switchChainAsync, isPending } = useSwitchChain();

  return (
    <div className="net-toggle" role="tablist" aria-label="Donation network">
      {chains.map((c) => {
        const active = chain?.genesisHash === c.genesisHash;
        return (
          <button
            key={c.genesisHash}
            type="button"
            role="tab"
            aria-selected={active}
            className={active ? 'net-tab active' : 'net-tab'}
            disabled={isPending}
            onClick={() => {
              if (!active) void switchChainAsync({ chainId: c.genesisHash }).catch(() => {});
            }}
          >
            {c.nativeCurrency.symbol}
          </button>
        );
      })}
    </div>
  );
}
