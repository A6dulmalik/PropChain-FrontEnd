'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { useWalletStore } from '@/store/walletStore';

const WalletModal = dynamic(
  () => import('./WalletModal').then((m) => m.WalletModal),
  { ssr: false },
);

const WALLET_OPTIONS = [
  { id: 'metamask', name: 'MetaMask', installUrl: 'https://metamask.io/download/' },
  { id: 'walletconnect', name: 'WalletConnect', description: 'Scan a QR code with any mobile wallet' },
  { id: 'coinbase', name: 'Coinbase Wallet', installUrl: 'https://www.coinbase.com/wallet' },
] as const;

export function WalletDisconnectedView() {
  const { isConnecting, error } = useWalletStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWalletGuide, setShowWalletGuide] = useState(false);

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </svg>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Connect Your Wallet
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose a wallet to start browsing and purchasing tokenised properties.
        </p>
      </div>

      <div className="flex flex-col w-full gap-2">
        {WALLET_OPTIONS.map((wallet) => (
          <button
            key={wallet.id}
            onClick={handleOpenModal}
            disabled={isConnecting}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left text-sm font-medium text-gray-900 dark:text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {wallet.name}
            {wallet.description && (
              <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                {wallet.description}
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowWalletGuide(!showWalletGuide)}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
        aria-expanded={showWalletGuide}
      >
        What is a wallet?
      </button>

      {showWalletGuide && (
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left space-y-2">
          <p>
            A crypto wallet is a browser extension or mobile app that lets you interact with
            blockchain networks. It stores your keys and lets you sign transactions.
          </p>
          <p>
            <strong>Don&apos;t have one?</strong> Install MetaMask, Coinbase Wallet, or use
            WalletConnect to link any compatible mobile wallet.
          </p>
        </div>
      )}

      <WalletModal isOpen={isModalOpen} onClose={handleCloseModal} />

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</div>
      )}
    </div>
  );
}
