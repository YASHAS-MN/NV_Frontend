import type { NebulaWalletBundle } from "./nebula-wallet";

export type MarketAsset = {
  owner: string;
  integrity_hash: string;
  price: number;
  verified: boolean;
  verification_seal?: string;
  original_filename?: string;
  content_type?: string;
  category?: string;
  attributes?: Record<string, string | number>;
};

export type MarketState = Record<string, MarketAsset>;

export type MempoolTrade = {
  sender: string;
  receiver: string;
  asset_name: string;
  price: number;
  tx_type: string;
  timestamp: number;
};

export type ChainBlock = {
  index: number;
  previous_hash: string;
  transactions: MempoolTrade[];
  timestamp: number;
  nonce: number;
  hash: string;
  verification_seal?: string | null;
};

export type MempoolResponse = {
  count: number;
  trades: MempoolTrade[];
};

export type ChainResponse = {
  length: number;
  chain: ChainBlock[];
  valid: boolean;
};

export type WalletBalanceResponse = {
  wallet_id: string;
  balance: number;
};

export type GatewayMessage = {
  message: string;
  success?: boolean;
  reason?: string;
  error?: string;
  balance?: number;
  required?: number;
};

export type BrowserWallet = NebulaWalletBundle;

export type OrderStatus = "pending" | "download";

export type WalletOrder = {
  id: string;
  assetName: string;
  buyerId: string;
  sellerId: string;
  price: number;
  createdAt: number;
  updatedAt: number;
  status: OrderStatus;
};

export type UserOrderEntry = {
  asset_name: string;
  asset?: MarketAsset;
  buyer_id?: string;
  seller_id?: string;
  owner_id?: string;
  price: number;
  status: "pending" | "completed";
  timestamp?: number;
};

export type UserOrdersResponse = {
  wallet_id: string;
  pending_orders: UserOrderEntry[];
  completed_orders: UserOrderEntry[];
};
