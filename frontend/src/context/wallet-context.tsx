"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { useNebula } from "@/components/nebula/nebula-provider";

type WalletContextValue = {
  walletId: string;
  balance: number | null;
  refreshBalance: () => Promise<void>;
  downloadVault: () => void;
  disconnectWallet: () => void;
};

const walletIdStorageKey = "nebula.wallet-id";
const walletBalanceStorageKey = "nebula.wallet-balance";

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    walletId: nebulaWalletId,
    balance: nebulaBalance,
    refreshProtocolState,
    downloadVault,
    disconnectWallet,
  } = useNebula();
  const [storedWalletId, setStoredWalletId] = useState("");
  const [storedBalance, setStoredBalance] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const persistedWalletId = window.localStorage.getItem(walletIdStorageKey) ?? "";
    const persistedBalance = window.localStorage.getItem(walletBalanceStorageKey);

    setStoredWalletId(persistedWalletId);
    setStoredBalance(persistedBalance ? Number(persistedBalance) : null);
  }, []);

  const walletId = nebulaWalletId || storedWalletId;
  const balance = nebulaBalance ?? storedBalance;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (nebulaWalletId) {
      window.localStorage.setItem(walletIdStorageKey, nebulaWalletId);
      setStoredWalletId(nebulaWalletId);
    } else {
      window.localStorage.removeItem(walletIdStorageKey);
      setStoredWalletId("");
    }
  }, [nebulaWalletId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (nebulaBalance !== null) {
      window.localStorage.setItem(walletBalanceStorageKey, String(nebulaBalance));
      setStoredBalance(nebulaBalance);
    } else if (!nebulaWalletId) {
      window.localStorage.removeItem(walletBalanceStorageKey);
      setStoredBalance(null);
    }
  }, [nebulaBalance, nebulaWalletId]);

  const refreshBalance = useCallback(async () => {
    await refreshProtocolState();
  }, [refreshProtocolState]);

  useEffect(() => {
    if (!walletId) {
      return;
    }

    void refreshBalance();
  }, [pathname, refreshBalance, walletId]);

  const value = useMemo(
    () => ({
      walletId,
      balance,
      refreshBalance,
      downloadVault,
      disconnectWallet,
    }),
    [walletId, balance, refreshBalance, downloadVault, disconnectWallet],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used within WalletProvider.");
  }

  return context;
}
