"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BookOpen, ChevronDown, Download, LogOut, ShieldCheck, ShoppingBag, TrendingUp, X } from "lucide-react";
import { createBrowserShellAdapter } from "@/lib/module-shell";

import { useWallet } from "@/context/wallet-context";
import { cn } from "@/lib/utils";
import { useNebula } from "./nebula-provider";

function formatHandyId(walletId: string) {
  if (!walletId) {
    return "";
  }

  if (walletId.length <= 20) {
    return walletId;
  }

  return `${walletId.slice(0, 16)}...${walletId.slice(-4)}`;
}

const navigation = [
  { href: "/", label: "HOME" },
  { href: "/surf/buy", label: "SURF", children: [
    { href: "/surf/buy", label: "BUY" },
    { href: "/surf/sell", label: "SELL" },
  ] },
  { href: "/orders", label: "ORDERS", icon: ShoppingBag },
  { href: "/trends", label: "TRENDS", icon: TrendingUp },
  { href: "/customize", label: "CUSTOMIZE" },
  { href: "/login", label: "LOGIN" },
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { pendingOrdersCount } = useNebula();
  const { walletId, balance, disconnectWallet, downloadVault } = useWallet();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const handyId = formatHandyId(walletId);
  const shellAdapter = useMemo(() => createBrowserShellAdapter(), []);

  // Inside your main App component
  useEffect(() => {
    const savedTab = shellAdapter.getStorageItem('activeTab');
    if (savedTab) {
      if (savedTab !== pathname && pathname === "/") {
        shellAdapter.navigate(savedTab);
      }
    }
  }, [pathname, shellAdapter]);

  // Update your tab switching function
  const handleTabChange = (tabName: string) => {
    shellAdapter.setStorageItem('activeTab', tabName);
  };

  return (
    <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-40 mx-auto w-full max-w-[1880px] px-4 pb-4 pt-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-6 justify-self-start">
          <Link href="/" className="flex items-end gap-1 text-white">
            <span className="text-xl font-semibold tracking-[0.42em]">NEBULA</span>
            <span className="pb-[3px] text-xs tracking-[0.28em] text-white/68">verse</span>
          </Link>
          <Link
            href="/manual"
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/70 transition hover:border-white/20 hover:text-white lg:inline-flex"
          >
            <BookOpen className="size-3.5" />
            How to use
          </Link>
        </div>

        <nav className="relative flex items-center gap-2 justify-self-center rounded-full border border-white/10 bg-[rgba(12,8,21,0.82)] px-3 py-2 backdrop-blur-xl">
          {navigation.map((item) => {
            if (item.label === "LOGIN" && walletId) {
              return (
                <div key="account" className="group relative">
                  <button
                    onClick={() => setShowAccountModal(true)}
                    className="relative inline-flex items-center gap-2 rounded-full border border-nebula-accent/20 bg-nebula-accent/10 px-4 py-2 text-xs tracking-[0.26em] text-white transition duration-200 hover:-translate-y-0.5 hover:bg-nebula-accent/20"
                    aria-label="Open account dashboard"
                  >
                    <ShieldCheck className="relative z-10 size-3.5 text-nebula-accent" />
                    <span className="relative z-10 font-medium text-nebula-accent">ACCOUNT</span>
                  </button>
                </div>
              );
            }

            const isActive = pathname === item.href || item.children?.some((child) => child.href === pathname);
            const Icon = item.icon;

            return (
              <div
                key={item.href}
                className="group relative"
              >
                <Link
                  href={item.href}
                  onClick={() => handleTabChange(item.href)}
                  className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-[0.26em] text-white/64 transition duration-200 hover:-translate-y-0.5 hover:text-white"
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-nebula-accent/20 bg-nebula-accent/10"
                      transition={{ type: "spring", stiffness: 340, damping: 28 }}
                    />
                  ) : null}
                  <span className={cn("relative z-10", isActive && "text-white")}>
                    {item.label}
                  </span>
                  {Icon ? <Icon className={cn("relative z-10 size-3.5", isActive && "text-white")} /> : null}
                  {item.children ? <ChevronDown className={cn("relative z-10 size-3.5", isActive && "text-white")} /> : null}
                  {item.href === "/orders" && pendingOrdersCount > 0 ? (
                    <span className="relative z-10 inline-flex min-w-5 items-center justify-center rounded-full bg-nebula-accent px-1.5 py-0.5 text-[10px] font-semibold tracking-normal text-slate-950">
                      {pendingOrdersCount}
                    </span>
                  ) : null}
                </Link>

                {item.children ? (
                  <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-0 w-44 -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="rounded-[24px] border border-white/10 bg-[rgba(12,8,21,0.95)] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => handleTabChange(child.href)}
                          className={cn(
                            "block rounded-[18px] px-4 py-3 text-xs tracking-[0.26em] text-white/68 transition hover:bg-white/8 hover:text-white",
                            childActive && "bg-nebula-accent/12 text-white",
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="hidden justify-self-end lg:block" />
        </div>
      </header>

      <AnimatePresence>
        {showAccountModal && walletId && (
          <motion.div
            key="account-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAccountModal(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
        )}
        {showAccountModal && walletId && (
          <motion.aside
            key="account-sidebar"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-[400px] flex-col border-l border-white/10 bg-[rgba(12,8,21,0.95)] p-6 shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold tracking-wider text-white">ACCOUNT HUB</h3>
                <button onClick={() => setShowAccountModal(false)} className="rounded-full bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white">
                  <X className="size-4" />
                </button>
              </div>

              <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,12,31,0.9),rgba(11,12,22,0.92))] p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_rgba(126,88,255,0.15),_transparent_60%)]" />
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-white/50">Handy ID</div>
                  <div className="mt-2 text-sm font-medium text-white/90">{handyId}</div>
                  <div className="mt-2 text-xs text-white/48 break-all">{walletId}</div>
                  
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-white/50">Virtual Currency (VC)</div>
                    <div className="mt-2 text-4xl font-semibold text-nebula-accent">{balance !== null ? balance.toFixed(1) : '--'} <span className="text-lg">VC</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <button onClick={() => { downloadVault(); setShowAccountModal(false); }} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white">
                  <Download className="size-4" /> Download Vault (.pem)
                </button>
                <button onClick={() => { disconnectWallet(); setShowAccountModal(false); }} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500 transition hover:bg-red-500/20">
                  <LogOut className="size-4" /> Disconnect Identity
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {children}

      <footer className="mx-auto mt-20 w-full max-w-[1680px] px-5 pb-10 sm:px-8 lg:px-10">
        <div className="glass-panel rounded-[32px] px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="text-sm tracking-[0.36em] text-white/58">ABOUT NEBULA</div>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Peer-powered software trade with verification, escrow, and creator-driven customization.
              </h2>
              <p className="mt-4 text-sm leading-8 text-nebula-muted">
                Nebula is being shaped as a decentralized software exchange where trusted artifacts,
                custom requests, and miner-backed settlement can live inside one cinematic experience.
                The frontend you are seeing is now the real product shell, not a prototype skin.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-white/72">
              <Link href="/surf/buy" className="inline-flex items-center gap-2 hover:text-white">
                Enter Surf
                <ArrowUpRight className="size-4" />
              </Link>
              <Link href="/orders" className="inline-flex items-center gap-2 hover:text-white">
                Open Orders
                <ArrowUpRight className="size-4" />
              </Link>
              <Link href="/trends" className="inline-flex items-center gap-2 hover:text-white">
                Explore Trends
                <ArrowUpRight className="size-4" />
              </Link>
              <Link href="/customize" className="inline-flex items-center gap-2 hover:text-white">
                Open Customize
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
