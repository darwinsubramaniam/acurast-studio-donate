import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssetSelector } from './AssetSelector';
import { ASSETS } from '../lib/assets';

describe('<AssetSelector />', () => {
  it('renders one tab per donatable asset', () => {
    render(<AssetSelector selectedKey="ACU" onSelect={() => {}} busy={false} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(ASSETS.length);
    for (const a of ASSETS) {
      expect(screen.getByRole('tab', { name: a.label })).toBeInTheDocument();
    }
  });

  it('marks only the selected asset as active', () => {
    render(<AssetSelector selectedKey="DOT" onSelect={() => {}} busy={false} />);
    expect(screen.getByRole('tab', { name: 'DOT' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'ACU' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onSelect with the asset key when a tab is clicked', async () => {
    const onSelect = vi.fn();
    render(<AssetSelector selectedKey="ACU" onSelect={onSelect} busy={false} />);
    await userEvent.click(screen.getByRole('tab', { name: 'USDC' }));
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('USDC');
  });

  it('disables every tab while busy (mid chain-switch)', async () => {
    const onSelect = vi.fn();
    render(<AssetSelector selectedKey="ACU" onSelect={onSelect} busy={true} />);
    for (const tab of screen.getAllByRole('tab')) {
      expect(tab).toBeDisabled();
    }
    await userEvent.click(screen.getByRole('tab', { name: 'DOT' }));
    expect(onSelect).not.toHaveBeenCalled();
  });
});
