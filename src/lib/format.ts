import { encodeAddress } from '@polkadot/util-crypto';

/** Re-encode an address to a target SS58 prefix; returns the input on failure. */
export function reencode(address: string, prefix: number): string {
  try {
    return encodeAddress(address, prefix);
  } catch {
    return address;
  }
}

export function truncate(addr: string, head = 6, tail = 6): string {
  return addr.length > head + tail ? `${addr.slice(0, head)}…${addr.slice(-tail)}` : addr;
}
