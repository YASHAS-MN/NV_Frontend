"use client";

import { useState } from "react";
import { LoaderCircle, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";

import { useNebula } from "./nebula-provider";
import { NoticeBanner } from "./shared-notice";
import { SignalPill } from "./signal-pill";
import { SiteChrome } from "./site-chrome";
import { submitWorkflow } from "@/lib/nebula-api";

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

  const [sandboxStatus, setSandboxStatus] = useState<"idle" | "running" | "completed" | "verifying" | "pending" | "rejected" | "finalized">("idle");
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [localNotice, setLocalNotice] = useState<{ tone: "success" | "error" | "info"; message: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.file) return;
    
    setSandboxStatus("running");
    setSandboxResult(null);
    setVerificationData(null);
    setLocalNotice(null);
    clearNotice();
    
    try {
      const response = await submitWorkflow(form.file);
      
      setSandboxResult(response.sandbox_result);
      
      if (response.status === "rejected") {
        setSandboxStatus("rejected");
        setLocalNotice({ tone: "error", message: response.message });
      } else {
        setVerificationData(response.on_chain_data);
        
        // Match the status_string returned by the backend (PENDING, FINALIZED, etc.)
        if (response.on_chain_data.status === "PENDING") {
           setSandboxStatus("pending");
        } else if (response.on_chain_data.status === "FINALIZED") {
           setSandboxStatus("finalized");
        } else {
           setSandboxStatus("completed");
        }

        setLocalNotice({ tone: "success", message: "Verification request successfully submitted." });
      }
    } catch (err) {
      setSandboxStatus("idle");
      setLocalNotice({
          tone: "error",
          message: err instanceof Error ? err.message : "Sandbox/Verification error"
      });
    }
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

                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        disabled={sandboxStatus === "running" || !form.file}
                        className="inline-flex items-center gap-2 rounded-full bg-nebula-accent px-5 py-3 text-sm font-medium text-slate-950 shadow-[0_0_24px_rgba(216,140,255,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ecb1ff] disabled:opacity-50"
                      >
                        {sandboxStatus === "running" ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                        {sandboxStatus === "running" ? "Executing Workflow..." : "Test in Sandbox & Verify"}
                      </button>
                      <div className="inline-flex items-center gap-2 text-sm text-nebula-muted">
                        <ShieldCheck className="size-4 text-nebula-signal" />
                        Execution triggers on-chain verification request.
                      </div>
                    </div>
                    
                    {/* Status Display Area */}
                    {sandboxStatus !== "idle" && (
                      <div className="mt-4 rounded-[24px] border border-white/10 bg-black/40 p-5 text-sm text-white/90">
                        <h3 className="mb-3 font-semibold text-white">Verification Workflow</h3>
                        <div className="space-y-2">
                          <p>Sandbox Status: <span className="text-nebula-accent">{sandboxStatus === "running" ? "Running..." : "Completed"}</span></p>
                          {sandboxResult && (
                            <>
                              <p>Transcript Hash: <span className="font-mono text-xs text-nebula-muted">{sandboxResult.transcript_hash || sandboxResult.hash}</span></p>
                              <p>Decision: <span className={sandboxResult.decision === "ACCEPT" ? "text-nebula-signal" : "text-nebula-warning"}>{sandboxResult.decision}</span></p>
                            </>
                          )}
                          {sandboxStatus === "rejected" && <p>Verification Status: <span className="text-nebula-warning">Not submitted (Sandbox Rejected)</span></p>}
                          {sandboxStatus === "pending" && verificationData && (
                            <>
                              <p>Verification Status: <span className="text-nebula-warning">Pending Finalization</span></p>
                              <p>Verification ID: <span className="font-mono text-xs text-nebula-muted">{verificationData.verification_id}</span></p>
                            </>
                          )}
                          {sandboxStatus === "finalized" && verificationData && (
                            <>
                              <p>Verification Status: <span className="text-nebula-signal">Finalized</span></p>
                              <p>Verification ID: <span className="font-mono text-xs text-nebula-muted">{verificationData.verification_id}</span></p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {notice ? (
            <div className="mx-auto max-w-[1180px]" onClick={clearNotice}>
              <NoticeBanner tone={notice.tone} message={notice.message} />
            </div>
          ) : localNotice ? (
            <div className="mx-auto max-w-[1180px]" onClick={() => setLocalNotice(null)}>
              <NoticeBanner tone={localNotice.tone} message={localNotice.message} />
            </div>
          ) : null}
        </section>
      </main>
    </SiteChrome>
  );
}
