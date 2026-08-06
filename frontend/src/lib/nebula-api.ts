import type {
  ChainResponse,
  GatewayMessage,
  MarketState,
  MempoolResponse,
  UserOrdersResponse,
  WalletBalanceResponse,
} from "./nebula-types";

export const getApiBaseUrl = () => {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_NEBULA_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (typeof window !== "undefined") {
    return "";
  }

  return "http://127.0.0.1:5000";
};

export const API_URL = getApiBaseUrl();

function buildUrl(path: string) {
  return `${API_URL}${path}`;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(buildUrl(path), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch (error) {
    throw new Error(
      error instanceof Error && error.message
        ? `Nebula gateway is unreachable on ${buildUrl("") || "the configured API base"}. ${error.message}`
        : "Nebula gateway is unreachable.",
    );
  }

  const data = (await response.json()) as T & GatewayMessage;

  if (!response.ok) {
    throw new Error(data.error || data.reason || data.message || "Nebula request failed.");
  }

  return data as T;
}

export function downloadAssetUrl(assetName: string, walletId?: string) {
  const buyerQuery = walletId ? `?buyer_id=${encodeURIComponent(walletId)}` : "";
  return buildUrl(`/api/download/${encodeURIComponent(assetName)}${buyerQuery}`);
}

export function getMarketState() {
  return requestJson<MarketState>("/api/market_state");
}

export function getMempool() {
  return requestJson<MempoolResponse>("/api/mempool");
}

export function getChain() {
  return requestJson<ChainResponse>("/api/chain");
}

export function getUserOrders(walletId: string) {
  return requestJson<UserOrdersResponse>(`/api/user_orders/${encodeURIComponent(walletId)}`);
}

export function getBalance(walletId: string) {
  return requestJson<WalletBalanceResponse>(
    `/api/balance/${encodeURIComponent(walletId)}`,
  );
}

export function claimFaucet(walletId: string) {
  return requestJson<GatewayMessage>("/api/faucet", {
    method: "POST",
    body: JSON.stringify({ wallet_id: walletId }),
  });
}

export async function uploadAsset(input: {
  sellerId: string;
  assetName: string;
  price: number;
  file: File;
  publicKeyPem: string;
  fileHash: string;
  signature: string;
  category: string;
}) {
  const formData = new FormData();
  formData.append("seller_id", input.sellerId);
  formData.append("asset_name", input.assetName);
  formData.append("price", String(input.price));
  formData.append("public_key", input.publicKeyPem);
  formData.append("file_hash", input.fileHash);
  formData.append("signature", input.signature);
  formData.append("category", input.category);
  formData.append("file", input.file);

  let response: Response;
  try {
    response = await fetch(buildUrl("/api/upload"), {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    throw new Error(
      error instanceof Error && error.message
        ? `Nebula gateway is unreachable on ${buildUrl("") || "the configured API base"}. ${error.message}`
        : "Nebula gateway is unreachable.",
    );
  }

  const data = (await response.json()) as GatewayMessage;

  if (!response.ok) {
    throw new Error(data.error || data.reason || data.message || "Asset upload failed.");
  }

  return data;
}

export function purchaseAsset(input: {
  assetName: string;
  buyerId: string;
  sellerId: string;
  price: number;
}) {
  return requestJson<GatewayMessage>("/api/buy", {
    method: "POST",
    body: JSON.stringify({
      asset_name: input.assetName,
      buyer_id: input.buyerId,
      seller_id: input.sellerId,
      price: input.price,
    }),
  });
}
