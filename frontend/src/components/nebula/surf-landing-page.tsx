"use client";

import Link from "next/link";

import { SurfBuyPageContent } from "./surf-buy-page";

export function SurfLandingPage() {
  return (
    <SurfBuyPageContent
      showSellPrompt
      prompt={
        <div className="mx-auto max-w-[1120px] rounded-[26px] border border-nebula-accent/18 bg-[linear-gradient(135deg,rgba(20,12,34,0.92),rgba(11,12,22,0.94))] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm leading-7 text-white/78">
              Looking here to sell something? Open the seller portal and publish your software to the mempool.
            </div>
            <Link
              href="/surf/sell"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Sell
            </Link>
          </div>
        </div>
      }
    />
  );
}
