"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  claimFaucet,
  getBalance,
  getChain,
  getMarketState,
  getMempool,
  purchaseAsset,
  uploadAsset,
} from "@/lib/nebula-api";
import { createBrowserShellAdapter } from "@/lib/module-shell";
import {
  downloadNebulaVault,
  generateNebulaWallet,
  hashFile,
  importNebulaVault,
  signFileHash,
} from "@/lib/nebula-wallet";
import type {
  BrowserWallet,
  ChainResponse,
  MarketAsset,
  MarketState,
  MempoolResponse,
  WalletOrder,
} from "@/lib/nebula-types";

const walletStorageKey = "nebula.browser-wallet";
const ordersStorageKey = "nebula.orders";

const shellAdapter = createBrowserShellAdapter();

function readStorage(key: string) {
  return shellAdapter.getStorageItem(key);
}

function writeStorage(key: string, value: string) {
  shellAdapter.setStorageItem(key, value);
}

function removeStorage(key: string) {
  shellAdapter.removeStorageItem(key);
}

type NoticeTone = "info" | "success" | "error";

type Notice = {
  tone: NoticeTone;
  message: string;
};

type UploadInput = {
  assetName: string;
  price: number;
  file: File;
};

type NebulaContextValue = {
  walletId: string;
  walletPublicKey: string;
  hasWallet: boolean;
  balance: number | null;
  marketState: MarketState;
  mempool: MempoolResponse | null;
  chain: ChainResponse | null;
  orders: WalletOrder[];
  pendingOrdersCount: number;
  isRefreshing: boolean;
  isWalletLoading: boolean;
  isLedgerLoading: boolean;
  isWalletBusy: boolean;
  isUploadBusy: boolean;
  pendingBuyAsset: string | null;
  notice: Notice | null;
  listingCount: number;
  ownedAssets: number;
  queueCount: number;
  isAssetPendingForWallet: (assetName: string) => boolean;
  hasOrderForWallet: (assetName: string) => boolean;
  generateWallet: () => Promise<void>;
  importVault: (file: File) => Promise<void>;
  downloadVault: () => void;
  disconnectWallet: () => void;
  clearNotice: () => void;
  claimDevFaucet: () => Promise<void>;
  publishAsset: (input: UploadInput) => Promise<void>;
  purchaseListing: (assetName: string, asset: MarketAsset) => Promise<void>;
  refreshProtocolState: () => Promise<void>;
  currentWalletId: string;
  isLoading: boolean;
};

const NebulaContext = createContext<NebulaContextValue | null>(null);

function readStoredOrders() {
  if (typeof window === "undefined") {
    return [] as WalletOrder[];
  }

  const raw = readStorage(ordersStorageKey);
  if (!raw) {
    return [] as WalletOrder[];
  }

  try {
    return JSON.parse(raw) as WalletOrder[];
  } catch {
    return [] as WalletOrder[];
  }
}

function writeStoredOrders(orders: WalletOrder[]) {
  writeStorage(ordersStorageKey, JSON.stringify(orders));
}

function reconcileOrders(
  existingOrders: WalletOrder[],
  walletId: string,
  marketState: MarketState,
  mempool: MempoolResponse | null,
  chain: ChainResponse | null,
) {
  return existingOrders.map((order) => {
    if (order.buyerId !== walletId) {
      return order;
    }

    const isPendingInMempool = Boolean(
      mempool?.trades.some(
        (trade) =>
          trade.tx_type === "purchase" &&
          trade.sender === walletId &&
          trade.asset_name === order.assetName,
      ),
    );

    const isCompleted = marketState[order.assetName]?.owner === walletId;
    const isPresentInChain = Boolean(
      chain?.chain.some((block) =>
        block.transactions.some(
          (tx) =>
            tx.tx_type === "purchase" &&
            tx.sender === walletId &&
            tx.asset_name === order.assetName,
        ),
      ),
    );

    return {
      ...order,
      status: isCompleted || isPresentInChain ? "download" : isPendingInMempool ? "pending" : order.status,
      updatedAt: isCompleted || isPresentInChain || isPendingInMempool ? Date.now() : order.updatedAt,
    };
  });
}

function inferUploadCategory(filename: string) {
  const lower = filename.toLowerCase();

  if (lower.endsWith(".py")) return "code";
  if (lower.endsWith(".mp3") || lower.endsWith(".wav")) return "audio";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png")) return "image";

  return "unknown";
}

export function NebulaProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [wallet, setWallet] = useState<BrowserWallet | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [marketState, setMarketState] = useState<MarketState>({});
  const [mempool, setMempool] = useState<MempoolResponse | null>(null);
  const [chain, setChain] = useState<ChainResponse | null>(null);
  const [orders, setOrders] = useState<WalletOrder[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isWalletLoading, setIsWalletLoading] = useState(true);
  const [isWalletBusy, setIsWalletBusy] = useState(false);
  const [isUploadBusy, setIsUploadBusy] = useState(false);
  const [pendingBuyAsset, setPendingBuyAsset] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const walletId = wallet?.nebulaId ?? "";
  const walletPublicKey = wallet?.publicKeyPem ?? "";
  const hasWallet = Boolean(wallet);

  const listingCount = useMemo(() => Object.keys(marketState).length, [marketState]);

  const ownedAssets = useMemo(
    () =>
      walletId
        ? Object.entries(marketState).filter(([, asset]) => asset.owner === walletId)
            .length
        : 0,
    [marketState, walletId],
  );

  const queueCount = mempool?.count ?? 0;

  const walletOrders = useMemo(
    () => orders.filter((order) => order.buyerId === walletId).sort((a, b) => b.updatedAt - a.updatedAt),
    [orders, walletId],
  );

  const pendingOrdersCount = useMemo(
    () => walletOrders.filter((order) => order.status === "pending").length,
    [walletOrders],
  );

  const isAssetPendingForWallet = useCallback(
    (assetName: string) =>
      Boolean(
        walletId &&
          mempool?.trades.some(
            (trade) =>
              trade.tx_type === "purchase" &&
              trade.sender === walletId &&
              trade.asset_name === assetName,
          ),
      ),
    [mempool, walletId],
  );

  const hasOrderForWallet = useCallback(
    (assetName: string) =>
      Boolean(
        walletId &&
          orders.some(
            (order) =>
              order.buyerId === walletId &&
              order.assetName === assetName &&
              (order.status === "pending" || order.status === "download"),
          ),
      ),
    [orders, walletId],
  );

  const refreshProtocolState = useCallback(async () => {
    try {
      const [market, queuedTrades, chainState] = await Promise.all([
        getMarketState(),
        getMempool(),
        getChain(),
      ]);

      setMarketState(prev => ({ ...prev, ...market }));
      setMempool(queuedTrades);
      setChain(chainState);

      setOrders((currentOrders) => {
        const reconciled = reconcileOrders(currentOrders, walletId, market, queuedTrades, chainState);
        if (typeof window !== "undefined") {
          writeStoredOrders(reconciled);
        }
        return reconciled;
      });

      if (walletId) {
        const walletBalance = await getBalance(walletId);
        setBalance(walletBalance.balance);
      } else {
        setBalance(null);
      }
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nebula gateway is offline. Start the backend and refresh.",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [walletId]);

  useEffect(() => {
    const storedWallet = readStorage(walletStorageKey);

    if (storedWallet) {
      setWallet(JSON.parse(storedWallet) as BrowserWallet);
    }

    setOrders(readStoredOrders());
    setIsWalletLoading(false);
  }, []);

  useEffect(() => {
    void refreshProtocolState();

    const interval = window.setInterval(() => {
      void refreshProtocolState();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [refreshProtocolState]);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    setPendingBuyAsset(null);
    if (walletId) {
      void refreshProtocolState();
    }
  }, [pathname, refreshProtocolState, walletId]);

  const persistWallet = (nextWallet: BrowserWallet) => {
    writeStorage(walletStorageKey, JSON.stringify(nextWallet));
    setWallet(nextWallet);
  };

  const generateWalletHandler = async () => {
    setIsWalletBusy(true);
    try {
      const nextWallet = await generateNebulaWallet();
      persistWallet(nextWallet);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userWalletAddress', nextWallet.nebulaId);
      }
      downloadNebulaVault(nextWallet.privateKeyPem);
      setNotice({
        tone: "success",
        message: `Nebula wallet created. Your Nebula ID is ${nextWallet.nebulaId}. The private vault was downloaded as nebula_vault.pem.`,
      });
    } catch (error) {
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Wallet generation failed.",
      });
    } finally {
      setIsWalletBusy(false);
    }
  };

  const importVault = async (file: File) => {
    setIsWalletBusy(true);
    try {
      const pem = await file.text();
      const restoredWallet = await importNebulaVault(pem);
      persistWallet(restoredWallet);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userWalletAddress', restoredWallet.nebulaId);
      }
      setNotice({
        tone: "success",
        message: `Vault restored successfully. Active Nebula ID: ${restoredWallet.nebulaId}.`,
      });
    } catch (error) {
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Vault import failed.",
      });
    } finally {
      setIsWalletBusy(false);
    }
  };

  const downloadVault = () => {
    if (!wallet) {
      setNotice({ tone: "error", message: "Generate or import a Nebula wallet before downloading a vault." });
      return;
    }

    downloadNebulaVault(wallet.privateKeyPem);
    setNotice({ tone: "info", message: "Private vault downloaded again as nebula_vault.pem." });
  };

  const disconnectWallet = () => {
    removeStorage(walletStorageKey);
    setWallet(null);
    setBalance(null);
    setNotice({ tone: "info", message: "Nebula wallet cleared for this browser tab." });
  };

  const clearNotice = () => setNotice(null);

  const claimDevFaucet = async () => {
    if (!walletId) {
      setNotice({
        tone: "error",
        message: "Generate or import a Nebula wallet before claiming faucet funds.",
      });
      return;
    }

    setIsWalletBusy(true);

    try {
      const response = await claimFaucet(walletId);
      const refreshedBalance = await getBalance(walletId);
      setBalance(refreshedBalance.balance);
      setNotice({ tone: "success", message: response.message });
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Developer faucet request failed.",
      });
    } finally {
      setIsWalletBusy(false);
    }
  };

  const publishAsset = async (input: UploadInput) => {
    if (!wallet) {
      setNotice({
        tone: "error",
        message: "Generate or import a Nebula wallet before publishing an asset.",
      });
      return;
    }

    setIsUploadBusy(true);

    try {
      const fileHash = await hashFile(input.file);
      const signature = await signFileHash(wallet.privateKeyPem, fileHash);

      const response = await uploadAsset({
        sellerId: wallet.nebulaId,
        assetName: input.assetName.trim(),
        price: input.price,
        file: input.file,
        publicKeyPem: wallet.publicKeyPem,
        fileHash,
        signature,
        category: inferUploadCategory(input.file.name),
      });

      setNotice({ tone: "success", message: response.message });
      await refreshProtocolState();
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Asset upload did not reach the gateway.",
      });
    } finally {
      setIsUploadBusy(false);
    }
  };

  const purchaseListing = async (assetName: string, asset: MarketAsset) => {
    if (!walletId) {
      setNotice({
        tone: "error",
        message: "Generate or import a Nebula wallet before creating escrow.",
      });
      return;
    }

    setPendingBuyAsset(assetName);

    try {
      const response = await purchaseAsset({
        assetName,
        buyerId: walletId,
        sellerId: asset.owner,
        price: asset.price,
      });

      const newOrder: WalletOrder = {
        id: `${walletId}-${assetName}-${Date.now()}`,
        assetName,
        buyerId: walletId,
        sellerId: asset.owner,
        price: asset.price,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: "pending",
      };

      setOrders((currentOrders) => {
        const hasExistingOrder = currentOrders.some(
          (order) =>
            order.assetName === assetName &&
            order.buyerId === walletId &&
            order.status === "pending",
        );
        const nextOrders = hasExistingOrder ? currentOrders : [newOrder, ...currentOrders];
        writeStoredOrders(nextOrders);
        return nextOrders;
      });

      setNotice({ tone: "success", message: response.message });
      await refreshProtocolState();
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Escrow transaction could not be queued.",
      });
    } finally {
      setPendingBuyAsset(null);
    }
  };

  return (
    <NebulaContext.Provider
      value={{
        walletId,
        walletPublicKey,
        hasWallet,
        balance,
        marketState,
        mempool,
        chain,
        orders: walletOrders,
        pendingOrdersCount,
        isRefreshing,
        isWalletLoading,
        isLedgerLoading: isRefreshing,
        isWalletBusy,
        isUploadBusy,
        pendingBuyAsset,
        notice,
        listingCount,
        ownedAssets,
        queueCount,
        isAssetPendingForWallet,
        hasOrderForWallet,
        generateWallet: generateWalletHandler,
        importVault,
        downloadVault,
        disconnectWallet,
        clearNotice,
        claimDevFaucet,
        publishAsset,
        purchaseListing,
        refreshProtocolState,
        currentWalletId: walletId,
        isLoading: isWalletLoading || isRefreshing,
      }}
    >
      {children}
    </NebulaContext.Provider>
  );
}

export function useNebula() {
  const context = useContext(NebulaContext);

  if (!context) {
    throw new Error("useNebula must be used within NebulaProvider.");
  }

  return context;
}
