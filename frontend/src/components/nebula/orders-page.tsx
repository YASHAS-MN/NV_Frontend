"use client";

import { Clock3, Download, LoaderCircle } from "lucide-react";
import { useMemo } from "react";

import { downloadAssetUrl } from "@/lib/nebula-api";
import { useNebula } from "./nebula-provider";
import { SignalPill } from "./signal-pill";
import { SiteChrome } from "./site-chrome";

export function OrdersPage() {
  const { marketState, mempool, walletId } = useNebula();

  const pendingOrders = useMemo(
    () =>
      (mempool?.trades ?? [])
        .filter((trade) => trade.tx_type === "purchase" && trade.sender === walletId)
        .map((trade) => ({
          id: `${trade.sender}-${trade.asset_name}-${trade.timestamp}`,
          assetName: trade.asset_name,
          sellerId: trade.receiver,
          price: trade.price,
          createdAt: trade.timestamp * 1000,
          updatedAt: trade.timestamp * 1000,
          status: "pending" as const,
        })),
    [mempool?.trades, walletId],
  );

  const downloadableOrders = useMemo(
    () =>
      Object.entries(marketState)
        .filter(([, asset]) => asset.owner === walletId)
        .map(([assetName, asset]) => ({
          id: `${walletId}-${assetName}`,
          assetName,
          sellerId: asset.owner,
          price: asset.price,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          status: "download" as const,
        })),
    [marketState, walletId],
  );

  return (
    <SiteChrome>
      <main className="mx-auto w-full max-w-[1680px] px-5 pb-10 pt-4 sm:px-8 lg:px-10">
        <section className="space-y-6">
          <div className="glass-panel rounded-[36px] px-6 py-7 sm:px-8">
            <SignalPill tone="accent">Orders</SignalPill>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Purchase queue and settlement history
            </h1>
            <p className="mt-4 max-w-4xl text-sm leading-8 text-nebula-muted">
              Every buy order created from this wallet appears here immediately. Pending orders stay visible while they sit in the mempool,
              then move into completed history once miner settlement transfers ownership on-chain.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/78">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5">
                Active wallet: {walletId || "No wallet loaded"}
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5">
                Pending: {pendingOrders.length}
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5">
                Download ready: {downloadableOrders.length}
              </div>
            </div>
          </div>

          <section className="grid gap-6 xl:grid-cols-2">
            <OrdersColumn
              title="Pending orders"
              tone="warning"
              icon={<Clock3 className="size-5" />}
              emptyMessage="No pending purchases are waiting in the mempool for this wallet."
              orders={pendingOrders}
              walletId={walletId}
            />
            <OrdersColumn
              title="Download ready"
              tone="success"
              icon={<Download className="size-5" />}
              emptyMessage="No assets are ready for download yet. Once a purchase is sealed on-chain, the download action will appear here."
              orders={downloadableOrders}
              walletId={walletId}
            />
          </section>
        </section>
      </main>
    </SiteChrome>
  );
}

function OrdersColumn({
  title,
  tone,
  icon,
  emptyMessage,
  orders,
  walletId,
}: {
  title: string;
  tone: "warning" | "success";
  icon: React.ReactNode;
  emptyMessage: string;
  orders: Array<{
    id: string;
    assetName: string;
    sellerId: string;
    price: number;
    createdAt: number;
    updatedAt: number;
    status: "pending" | "download";
  }>;
  walletId: string;
}) {
  return (
    <div className="glass-panel rounded-[32px] px-6 py-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <SignalPill tone={tone}>{title}</SignalPill>
          <h2 className="mt-4 text-2xl font-semibold text-white">{orders.length} order{orders.length === 1 ? "" : "s"}</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 p-3 text-white/76">{icon}</div>
      </div>

      <div className="mt-6 space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-black/15 px-5 py-8 text-sm leading-7 text-nebula-muted">
            {emptyMessage}
          </div>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,11,29,0.88),rgba(8,9,18,0.92))] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/46">Asset</div>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{order.assetName}</h3>
                </div>
                <SignalPill tone={order.status === "download" ? "success" : "warning"}>
                  {order.status === "download" ? "Status: Confirmed" : "Status: Verifying..."}
                </SignalPill>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-white/70">
                <div>Seller: {order.sellerId}</div>
                <div>Price: {order.price} VC</div>
                <div>Placed: {new Date(order.createdAt).toLocaleString()}</div>
                <div>Updated: {new Date(order.updatedAt).toLocaleString()}</div>
              </div>
              <div className="mt-6">
                {order.status === "pending" ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/10 px-4 py-3 text-sm text-amber-100/80">
                    <LoaderCircle className="size-4 animate-spin" />
                    Mining in progress...
                  </div>
                ) : (
                  <a
                    href={downloadAssetUrl(order.assetName, walletId)}
                    className="inline-flex items-center gap-2 rounded-full bg-nebula-accent px-5 py-3 text-sm font-medium text-slate-950 shadow-[0_0_24px_rgba(216,140,255,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ecb1ff]"
                  >
                    <Download className="size-4" />
                    Download Now
                  </a>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
