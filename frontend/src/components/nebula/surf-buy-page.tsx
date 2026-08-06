"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Coins,
  Globe,
  LoaderCircle,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type { MarketAsset } from "@/lib/nebula-types";
import { inferCategory } from "@/lib/catalog-utils";
import { cn } from "@/lib/utils";
import { useNebula } from "./nebula-provider";
import { NoticeBanner } from "./shared-notice";
import { SignalPill } from "./signal-pill";
import { SiteChrome } from "./site-chrome";

const languages = [
  { flag: "US", label: "English" },
  { flag: "IN", label: "Hindi" },
  { flag: "JP", label: "Japanese" },
];

const categories = [
  "All",
  "Code",
  "Applications",
  "Graphics",
  "Digital Art",
  "Documents",
  "Presentations",
];

const sortModes = [
  "Most trusted",
  "Newest",
  "Price: low to high",
  "Price: high to low",
];

const trustModes = [
  "Sandbox validation surfaced",
  "Integrity hash visible on every card",
  "TRENDS page will rank using review signals",
];

export function SurfBuyPage() {
  return <SurfBuyPageContent />;
}

export function SurfBuyPageContent({
  showSellPrompt = false,
  prompt,
}: {
  showSellPrompt?: boolean;
  prompt?: React.ReactNode;
}) {
  const {
    walletId,
    balance,
    marketState,
    isRefreshing,
    pendingBuyAsset,
    pendingOrdersCount,
    purchaseListing,
    isAssetPendingForWallet,
    hasOrderForWallet,
    notice,
    clearNotice,
    claimDevFaucet,
    isWalletBusy,
  } = useNebula();
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState(languages[0].label);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortMode, setSortMode] = useState(sortModes[0]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const entries = useMemo(() => {
    const filtered = Object.entries(marketState).filter(([assetName]) => {
      const matchesQuery = assetName.toLowerCase().includes(query.toLowerCase());
      if (activeCategory === "All") return matchesQuery;
      return matchesQuery && inferCategory(assetName) === activeCategory;
    });

    if (sortMode === "Newest") return [...filtered].reverse();
    if (sortMode === "Price: low to high") return [...filtered].sort((a, b) => a[1].price - b[1].price);
    if (sortMode === "Price: high to low") return [...filtered].sort((a, b) => b[1].price - a[1].price);

    return [...filtered].sort((a, b) => Number(b[1].verified) - Number(a[1].verified));
  }, [activeCategory, marketState, query, sortMode]);

  return (
    <SiteChrome>
      <main className="mx-auto w-full max-w-[1880px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <div className="glass-panel overflow-hidden rounded-[36px] px-5 py-5 sm:px-6">
            <div className="space-y-5">
              <div className="grid gap-4 xl:grid-cols-[0.22fr_0.56fr_0.22fr] xl:items-center">
                <div className="flex justify-start">
                  <button
                    onClick={() => setFiltersOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/76 transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    <SlidersHorizontal className="size-4" />
                    Filters
                  </button>
                </div>

                <div className="flex justify-center">
                  <div className="flex w-full max-w-[920px] items-center gap-3 rounded-full border border-white/10 bg-black/20 px-5 py-4">
                    <Search className="size-4 text-white/55" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search verified software, tools, assets, and documents"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/34"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/76">
                    <Globe className="size-4" />
                    <select
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      className="bg-transparent outline-none"
                    >
                      {languages.map((item) => (
                        <option key={item.label} value={item.label} className="bg-slate-900">
                          {item.flag} {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/76">
                    {walletId || "Guest account"}
                  </div>
                  <Link
                    href="/orders"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/76 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                  >
                    <ShoppingBag className="size-4" />
                    Orders
                    {pendingOrdersCount > 0 ? (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-nebula-accent px-1.5 py-0.5 text-[10px] font-semibold text-slate-950">
                        {pendingOrdersCount}
                      </span>
                    ) : null}
                  </Link>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,12,31,0.9),rgba(11,12,22,0.92))] p-6 sm:p-7"
              >
                <SignalPill tone="accent">Surf buy</SignalPill>
                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  Discover and buy verified software in the NEBULAverse marketplace.
                </h1>
                <p className="mt-4 max-w-4xl text-sm leading-8 text-nebula-muted">
                  Browse live listings, inspect trust signals, and move into escrow-backed transactions.
                  This portal is for buyers only.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/78">
                    <Coins className="size-4 text-nebula-accent" />
                    Wallet balance: {walletId && balance !== null ? `${balance.toFixed(1)} VC` : "--"}
                  </div>
                  <button
                    onClick={() => void claimDevFaucet()}
                    disabled={!walletId || isWalletBusy}
                    className="inline-flex items-center gap-2 rounded-full border border-nebula-accent/25 bg-nebula-accent/12 px-4 py-2.5 text-sm text-white transition hover:-translate-y-0.5 hover:bg-nebula-accent/18 disabled:opacity-50"
                  >
                    {isWalletBusy ? <LoaderCircle className="size-4 animate-spin" /> : <Coins className="size-4" />}
                    Claim faucet
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {notice ? (
            <div className="mx-auto max-w-[1280px]" onClick={clearNotice}>
              <NoticeBanner tone={notice.tone} message={notice.message} />
            </div>
          ) : null}

          {showSellPrompt ? prompt : null}

          <div className="space-y-6">
            <div>
              <SignalPill tone="accent">Catalog</SignalPill>
              <h2 className="mt-4 text-4xl font-semibold text-white">
                {isRefreshing ? "Refreshing the ledger..." : `${entries.length} curated results in ${activeCategory}`}
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {entries.map(([assetName, asset], index) => (
                <BuyCard
                  key={assetName}
                  assetName={assetName}
                  asset={asset}
                  balance={balance}
                  isBuying={pendingBuyAsset === assetName}
                  isPending={isAssetPendingForWallet(assetName)}
                  isLocked={hasOrderForWallet(assetName)}
                  index={index}
                  onPurchase={purchaseListing}
                />
              ))}
            </div>
          </div>
        </section>

        <AnimatePresence>
          {filtersOpen ? (
            <>
              <motion.button
                type="button"
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[6px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFiltersOpen(false)}
              />
              <motion.aside
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed left-6 top-28 z-50 w-[360px] rounded-[32px] border border-white/10 bg-[rgba(12,8,21,0.94)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-white/48">Filter panel</div>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Sort and category controls</h3>
                  </div>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  <PanelGroup title="Sort options">
                    {sortModes.map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setSortMode(mode)}
                        className={cn(
                          "rounded-[20px] border px-4 py-3 text-left text-sm transition hover:-translate-y-0.5",
                          sortMode === mode
                            ? "border-nebula-accent/30 bg-nebula-accent/12 text-white"
                            : "border-white/10 bg-white/5 text-white/68 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </PanelGroup>

                  <PanelGroup title="Categories">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                          "rounded-[20px] border px-4 py-3 text-left text-sm transition hover:-translate-y-0.5",
                          activeCategory === category
                            ? "border-nebula-accent/30 bg-nebula-accent/12 text-white"
                            : "border-white/10 bg-white/5 text-white/68 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </PanelGroup>

                  <PanelGroup title="Trust signals">
                    {trustModes.map((item) => (
                      <div
                        key={item}
                        className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/72"
                      >
                        {item}
                      </div>
                    ))}
                  </PanelGroup>
                </div>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>
      </main>
    </SiteChrome>
  );
}

function BuyCard({
  assetName,
  asset,
  balance,
  isBuying,
  isPending,
  isLocked,
  index,
  onPurchase,
}: {
  assetName: string;
  asset: MarketAsset;
  balance: number | null;
  isBuying: boolean;
  isPending: boolean;
  isLocked: boolean;
  index: number;
  onPurchase: (assetName: string, asset: MarketAsset) => Promise<void>;
}) {
  const { currentWalletId, isLoading } = useNebula();
  
  // Get the wallet ID from BOTH Context and LocalStorage to prevent null on refresh
  const persistentWalletId = currentWalletId || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('nebula.browser-wallet') || '{}')?.nebulaId : null);
  
  // Logic Guards (Calculated on every render)
  const isOwner = Boolean(persistentWalletId && persistentWalletId === asset.owner);
  const hasFunds = balance !== null && balance >= asset.price;
  const isPendingPurchase = isPending;
  const isPurchasedAsset = useMemo(() => isLocked, [isLocked]);
  const isPurchased = useMemo(() => isOwner || isPurchasedAsset || isPendingPurchase, [isOwner, isPurchasedAsset, isPendingPurchase]);
  const isChecking = isLoading || !persistentWalletId;

  const category = inferCategory(asset.original_filename || assetName);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmPurchase = async () => {
    await onPurchase(assetName, asset);
    setShowConfirm(false);
  };

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(17,11,29,0.88),rgba(8,9,18,0.92))] p-4 transition duration-300 hover:-translate-y-1 hover:border-nebula-accent/22">
       {showConfirm && !isPurchased ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 p-6 text-center backdrop-blur-md">
          <h4 className="text-lg font-semibold text-white">Confirm Purchase</h4>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Are you sure you want to purchase <strong className="text-white">{assetName}</strong> for{" "}
            <strong className="text-nebula-accent">{asset.price} VC</strong>?
          </p>
          <div className="mt-6 flex w-full items-center justify-center gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isBuying}
              className="rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => void handleConfirmPurchase()}
              disabled={isBuying || !hasFunds}
              className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-full bg-nebula-accent px-6 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-[#ecb1ff] disabled:opacity-50"
            >
              {isBuying ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {isBuying ? "Processing Order..." : "Confirm"}
            </button>
          </div>
        </div>
      ) : null}

      <div className={cn("relative h-72 overflow-hidden rounded-[24px]", cardGradient(index))}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,_rgba(255,255,255,0.18),_transparent_16%),linear-gradient(180deg,transparent,rgba(3,6,18,0.48))]" />
        <div className="absolute left-4 top-4">
          <SignalPill tone={asset.verified ? "success" : "warning"}>
            {asset.verified ? "Verified" : "Pending"}
          </SignalPill>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/52">{category}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{assetName}</div>
          </div>
          <div className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/72">
            {asset.price} VC
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="line-clamp-2 text-sm leading-7 text-nebula-muted">
          Verified artifact routed through NEBULAverse sandbox validation and listed for escrow-backed exchange.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-[20px] border border-white/10 bg-white/5 p-3 text-sm text-white/90">
        <div className="flex flex-col gap-1 rounded-[14px] bg-black/10 p-3">
          <span className="text-[10px] uppercase text-white/50 tracking-[0.24em] font-semibold">Price</span>
          <span className="text-sm font-medium text-white">{asset.price} VC</span>
        </div>
        {asset.attributes && Object.entries(asset.attributes).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1 rounded-[14px] bg-black/10 p-3">
            <span className="text-[10px] uppercase text-white/50 tracking-[0.24em] font-semibold">{key}</span>
            <span className="text-sm font-medium text-white truncate">{String(value)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-2 text-xs text-white/60">
        <span className="rounded-full border border-white/10 px-3 py-2">Owner: {asset.owner.slice(0, 12)}...</span>
        <span className="rounded-full border border-white/10 px-3 py-2 break-all">Hash: {asset.integrity_hash.slice(0, 18)}...</span>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-white/42">Escrow price</div>
          <div className="mt-2 text-2xl font-semibold text-white">
            {asset.price} <span className="text-sm text-nebula-accent">VC</span>
          </div>
          {!isOwner && currentWalletId && !hasFunds ? (
            <div className="mt-2 text-xs text-[#ffbecb]">
              Faucet funds required before this buy can enter the mempool.
            </div>
          ) : null}
        </div>
        
        <button 
          disabled={isChecking || isOwner || isPurchased}
          onClick={() => setShowConfirm(true)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: isChecking ? '#eee' : (isOwner ? '#888' : '#4CAF50'),
            color: isChecking ? '#333' : (isOwner ? '#eee' : '#0a0a0a')
          }}
        >
          {isChecking 
            ? "Syncing..." 
            : isOwner 
              ? "Your Asset" 
              : isPurchased 
                ? "✓ Purchased" 
                : "Buy Now"}
        </button>
      </div>
    </article>
  );
}

function PanelGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 text-xs uppercase tracking-[0.26em] text-white/44">{title}</div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function cardGradient(index: number) {
  const gradients = [
    "bg-[linear-gradient(135deg,_rgba(177,90,255,0.34),_rgba(99,48,148,0.26),_rgba(113,255,220,0.14))]",
    "bg-[linear-gradient(135deg,_rgba(255,124,167,0.2),_rgba(157,62,132,0.22),_rgba(47,26,62,0.5))]",
    "bg-[linear-gradient(135deg,_rgba(194,121,255,0.28),_rgba(113,64,196,0.24),_rgba(30,18,52,0.5))]",
    "bg-[linear-gradient(135deg,_rgba(113,255,220,0.16),_rgba(140,89,255,0.22),_rgba(16,18,42,0.48))]",
  ];

  return gradients[index % gradients.length];
}
