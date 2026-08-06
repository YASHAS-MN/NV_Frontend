"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ShieldCheck, Wallet } from "lucide-react";

import { useWallet } from "@/context/wallet-context";
import { useNebula } from "./nebula-provider";
import { SiteChrome } from "./site-chrome";

export function HomePage() {
  const { walletId } = useWallet();
  const { isWalletBusy, generateWallet } = useNebula();

  return (
    <SiteChrome>
      <main className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-[1880px] flex-col px-4 pb-8 sm:px-6 lg:px-8">
        <section className="relative flex min-h-[86vh] flex-1 flex-col overflow-hidden rounded-[44px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,12,28,0.46),rgba(4,7,19,0.7))] px-6 py-10 text-center sm:px-10 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,_rgba(126,88,255,0.14),_transparent_20%),radial-gradient(circle_at_48%_22%,_rgba(98,166,255,0.16),_transparent_22%),linear-gradient(180deg,_rgba(255,255,255,0.01),_rgba(5,8,22,0.5))]" />
          <motion.div
            className="absolute inset-x-[24%] top-[18%] h-[42vh] rounded-full bg-[radial-gradient(circle,_rgba(133,104,255,0.22)_0%,_rgba(84,126,255,0.14)_32%,_rgba(34,71,148,0.04)_56%,_transparent_78%)] opacity-90 blur-3xl"
            animate={{ scale: [1, 1.04, 1], opacity: [0.7, 0.92, 0.7] }}
            transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 rounded-full border border-white/6" />
          </motion.div>

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
            <motion.div
              className="absolute left-1/2 top-[48%] h-[22rem] w-[72rem] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.06] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)] opacity-50 blur-sm"
              animate={{ opacity: [0.22, 0.48, 0.22], scaleX: [0.96, 1.02, 0.96] }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/68"
            >
              <ShieldCheck className="size-3.5" />
              Autonomous software exchange
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [1, 1.012, 1],
              }}
              transition={{
                duration: 0.95,
                delay: 0.15,
                ease: "easeOut",
                scale: {
                  duration: 7,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
              }}
              className="mx-auto flex max-w-full items-end justify-center gap-2 text-center"
            >
              <span className="text-[clamp(5rem,15vw,11.5rem)] font-semibold leading-[0.9] tracking-[0.16em] text-white">
                NEBULA
              </span>
              <motion.span
                animate={{ opacity: [0.68, 1, 0.68], y: [0, -1.5, 0] }}
                transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="mb-[0.8rem] text-[clamp(1.1rem,2vw,1.9rem)] tracking-[0.32em] text-white/78 sm:mb-[1rem]"
              >
                verse
              </motion.span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.32, ease: "easeOut" }}
              className="mt-6 max-w-4xl text-[clamp(1.1rem,2vw,1.7rem)] leading-9 text-white/82"
            >
              Trade code. Commission creation. Settle with trust.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.45, ease: "easeOut" }}
              className="mt-12 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/surf"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
              >
                Enter Surf
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/manual"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <BookOpen className="size-4" />
                How to use
              </Link>
            </motion.div>
          </div>

          <div className="relative z-10 mt-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.55, ease: "easeOut" }}
              className="group relative mx-auto flex w-full max-w-[980px] flex-col gap-4 overflow-hidden rounded-[30px] border border-white/12 bg-[rgba(12,8,21,0.84)] p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.04),transparent)] opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="text-left">
                <div className="text-xs uppercase tracking-[0.28em] text-white/50">Browser wallet</div>
                <div className="mt-3 text-lg font-medium text-white">
                  {walletId ? `Active Nebula ID: ${walletId}` : "Generate a Nebula wallet to begin."}
                </div>
                <div className="mt-2 text-sm text-white/62">
                  {walletId ? "Your verified identity is persistent in this browser, and your account dashboard is now available from the navigation bar." : "Private key downloads as `nebula_vault.pem`, while uploads are signed in-browser automatically."}
                </div>
              </div>
              {walletId ? (
                <Link
                  href="/surf/buy"
                  className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-nebula-accent px-7 py-4 text-sm font-medium text-slate-950 shadow-[0_0_28px_rgba(216,140,255,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ecb1ff]"
                >
                  Go to Dashboard <ArrowRight className="size-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => void generateWallet()}
                  disabled={isWalletBusy}
                  className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-nebula-accent px-7 py-4 text-sm font-medium text-slate-950 shadow-[0_0_28px_rgba(216,140,255,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ecb1ff] disabled:opacity-60"
                >
                  {isWalletBusy ? <Wallet className="size-4 animate-pulse" /> : <Wallet className="size-4" />}
                  Generate wallet
                </button>
              )}
            </motion.div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
