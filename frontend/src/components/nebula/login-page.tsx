"use client";

import { useRef } from "react";
import { Download, FolderUp, Gem, LoaderCircle, ShieldCheck, Wallet } from "lucide-react";

import { useWallet } from "@/context/wallet-context";
import { useNebula } from "./nebula-provider";
import { NoticeBanner } from "./shared-notice";
import { SiteChrome } from "./site-chrome";

export function LoginPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { walletId, balance, downloadVault, disconnectWallet } = useWallet();
  const {
    walletPublicKey,
    hasWallet,
    notice,
    clearNotice,
    isWalletBusy,
    generateWallet,
    importVault,
    claimDevFaucet,
  } = useNebula();

  return (
    <SiteChrome>
      <main className="mx-auto flex w-full max-w-[1480px] flex-1 items-center px-5 pb-8 pt-6 sm:px-8 lg:px-10">
        <section className="glass-panel mx-auto w-full max-w-4xl rounded-[38px] p-6 sm:p-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
              <Wallet className="size-3.5" />
              Browser wallet
            </div>
            <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
              Create or restore a Nebula wallet directly in the browser
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-nebula-muted">
              Users can create an RSA-PSS wallet, download the private vault as a PEM file, restore that vault
              later, and sign uploads without touching the terminal or seeing raw private key text in the interface.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => void generateWallet()}
                disabled={isWalletBusy}
                className="inline-flex items-center gap-2 rounded-full bg-nebula-accent px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-[#8abdff] disabled:opacity-60"
              >
                {isWalletBusy ? <LoaderCircle className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                Create New Nebula Wallet
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isWalletBusy}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/76 transition hover:bg-white/10 disabled:opacity-50"
              >
                <FolderUp className="size-4" />
                Import Existing Vault
              </button>
              <button
                type="button"
                onClick={downloadVault}
                disabled={!hasWallet}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/76 transition hover:bg-white/10 disabled:opacity-50"
              >
                <Download className="size-4" />
                Download vault
              </button>
              <button
                type="button"
                onClick={() => void claimDevFaucet()}
                disabled={!hasWallet || isWalletBusy}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/76 transition hover:bg-white/10 disabled:opacity-50"
              >
                <Gem className="size-4" />
                Claim faucet
              </button>
              {hasWallet ? (
                <button
                  type="button"
                  onClick={disconnectWallet}
                  className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/76 transition hover:bg-white/10"
                >
                  Disconnect
                </button>
              ) : null}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pem"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void importVault(file);
                }
                event.currentTarget.value = "";
              }}
            />
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.28em] text-white/52">Nebula ID</div>
              <div className="mt-4 break-all text-lg font-medium text-white">{walletId || "No wallet generated or restored"}</div>
              <div className="mt-3 text-sm leading-7 text-nebula-muted">
                Handy public identity derived by hashing the full RSA public key and taking the first 12 characters.
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.28em] text-white/52">Balance</div>
              <div className="mt-4 text-lg font-medium text-white">
                {walletId && balance !== null ? `${balance.toFixed(1)} VC` : "--"}
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 md:col-span-2">
              <div className="text-xs uppercase tracking-[0.28em] text-white/52">Stored public key</div>
              <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-all text-xs leading-6 text-white/76">
                {walletPublicKey || "Generate or import a vault to see the active public key used for upload verification."}
              </pre>
            </div>
          </div>

          {notice ? (
            <div className="mx-auto mt-8 max-w-3xl" onClick={clearNotice}>
              <NoticeBanner tone={notice.tone} message={notice.message} />
            </div>
          ) : null}
        </section>
      </main>
    </SiteChrome>
  );
}
