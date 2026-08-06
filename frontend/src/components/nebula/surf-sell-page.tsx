"use client";

import { useState } from "react";
import { LoaderCircle, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";

import { useNebula } from "./nebula-provider";
import { NoticeBanner } from "./shared-notice";
import { SignalPill } from "./signal-pill";
import { SiteChrome } from "./site-chrome";

export function SurfSellPage() {
  const {
    walletId,
    publishAsset,
    isUploadBusy,
    notice,
    clearNotice,
  } = useNebula();
  const [form, setForm] = useState({
    assetName: "",
    price: "",
    attributes: "",
    file: null as File | null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.assetName || !form.price || !form.file) return;

    await publishAsset({
      assetName: form.assetName,
      price: Number(form.price),
      file: form.file,
    });
  };

  return (
    <SiteChrome>
      <main className="mx-auto w-full max-w-[1880px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <div className="glass-panel rounded-[38px] p-6 sm:p-8">
            <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
              <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,12,31,0.94),rgba(11,12,22,0.9))] p-6 sm:p-8">
                <SignalPill tone="accent">Surf sell</SignalPill>
                <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
                  Publish your software into the NEBULAverse mempool.
                </h1>
                <p className="mt-4 text-sm leading-8 text-nebula-muted">
                  This portal is for sellers. Define your software name, price, artifact file, and
                  attribute details. Once submitted, the product enters the mempool and becomes visible
                  after miner verification and block mining.
                </p>

                <div className="mt-8 grid gap-3">
                  <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/78">
                    Seller identity: {walletId || "Connect wallet before publishing"}
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/78">
                    Output: Product enters mempool, then updates after miner settlement.
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/78">
                    Trust: Sandbox verification and integrity hash are attached by the backend flow.
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="glass-panel rounded-[32px] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <SignalPill tone="success">Seller tool</SignalPill>
                    <h2 className="mt-4 text-3xl font-semibold text-white">List a new software product</h2>
                  </div>
                  <div className="rounded-3xl border border-nebula-accent/20 bg-nebula-accent/10 p-3 text-nebula-accent">
                    <UploadCloud className="size-6" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-nebula-muted">
                      Software name
                    </span>
                    <input
                      value={form.assetName}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, assetName: event.target.value }))
                      }
                      placeholder="nebula-suite.py"
                      className="w-full rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-nebula-accent/50"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-nebula-muted">
                      Price (VC)
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, price: event.target.value }))
                      }
                      placeholder="10"
                      className="w-full rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-nebula-accent/50"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-nebula-muted">
                      Attribute info
                    </span>
                    <textarea
                      value={form.attributes}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, attributes: event.target.value }))
                      }
                      placeholder="Describe what the software does, who it is for, and important attributes buyers should know."
                      className="h-36 w-full rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-nebula-accent/50"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-nebula-muted">
                      Artifact file
                    </span>
                    <input
                      type="file"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          file: event.target.files?.[0] ?? null,
                        }))
                      }
                      className="block w-full rounded-[22px] border border-dashed border-white/15 bg-black/20 px-4 py-[14px] text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-nebula-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-950"
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isUploadBusy || !walletId}
                      className="inline-flex items-center gap-2 rounded-full bg-nebula-accent px-5 py-3 text-sm font-medium text-slate-950 shadow-[0_0_24px_rgba(216,140,255,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ecb1ff] disabled:opacity-50"
                    >
                      {isUploadBusy ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                      {isUploadBusy ? "Sending to mempool" : "Publish to mempool"}
                    </button>
                    <div className="inline-flex items-center gap-2 text-sm text-nebula-muted">
                      <ShieldCheck className="size-4 text-nebula-signal" />
                      Product updates after miner verification.
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {notice ? (
            <div className="mx-auto max-w-[1180px]" onClick={clearNotice}>
              <NoticeBanner tone={notice.tone} message={notice.message} />
            </div>
          ) : null}
        </section>
      </main>
    </SiteChrome>
  );
}
