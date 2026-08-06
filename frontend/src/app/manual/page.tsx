import Link from "next/link";
import { ArrowRight, BookOpenCheck, ShieldCheck, Wallet } from "lucide-react";

import { SiteChrome } from "@/components/nebula/site-chrome";

export default function Manual() {
  return (
    <SiteChrome>
      <main className="mx-auto w-full max-w-[1480px] px-5 pb-8 pt-4 sm:px-8 lg:px-10">
        <section className="glass-panel rounded-[34px] p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <BookOpenCheck className="size-3.5" />
            Manual
          </div>
          <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">How to use Nebula right now</h1>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
              <Wallet className="size-6 text-nebula-accent" />
              <h2 className="mt-5 text-xl font-semibold text-white">1. Login</h2>
              <p className="mt-3 text-sm leading-8 text-nebula-muted">
                Enter a wallet/public identity on the home or login page. Real wallet signature auth is planned next.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
              <ShieldCheck className="size-6 text-nebula-signal" />
              <h2 className="mt-5 text-xl font-semibold text-white">2. Upload or buy</h2>
              <p className="mt-3 text-sm leading-8 text-nebula-muted">
                Use Surf to publish verified artifacts, browse the ledger, and create escrow-backed purchases.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
              <ArrowRight className="size-6 text-nebula-warning" />
              <h2 className="mt-5 text-xl font-semibold text-white">3. Expand into requests</h2>
              <p className="mt-3 text-sm leading-8 text-nebula-muted">
                Use Customize for freelance-style requirements, peer boosts, and future delivery collaboration.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/surf"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
            >
              Go to Surf
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
