# NebulaVerse Frontend Interface

This frontend is the presentation layer for NebulaVerse. It is meant to be reusable against another backend or module stack without dragging the old sandbox, chain, or storage implementation with it.

## What the module provides

- App shell and routes for `Home`, `Surf`, `Manual`, `Orders`, `Trends`, `Login`, and `Customize`.
- Wallet state persistence through `WalletProvider` and `NebulaProvider`.
- Client-side API helpers in [src/lib/nebula-api.ts](src/lib/nebula-api.ts) for market, chain, balance, faucet, upload, buy, and order reads.
- Wallet helpers in [src/lib/nebula-wallet.ts](src/lib/nebula-wallet.ts) for wallet creation, vault export/import, signing, and hashing.

## Required backend contract

The UI expects these HTTP endpoints to exist on the configured API base URL:

- `GET /api/market_state`
- `GET /api/mempool`
- `GET /api/chain`
- `GET /api/user_orders/:walletId`
- `GET /api/balance/:walletId`
- `POST /api/faucet`
- `POST /api/upload`
- `POST /api/buy`
- `GET /api/download/:assetName`

Responses should follow the shapes defined in [src/lib/nebula-types.ts](src/lib/nebula-types.ts). Errors should return JSON with at least one of `error`, `reason`, or `message`.

## Configuration

Set `NEXT_PUBLIC_NEBULA_API_BASE_URL` to the backend origin when the frontend is not served from the same origin as the API.

If that variable is unset, the client uses relative `/api` requests in the browser and `http://127.0.0.1:5000` during server-side execution.

## Storage keys

The UI persists local browser state under these keys:

- `nebula.browser-wallet`
- `nebula.orders`
- `nebula.wallet-id`
- `nebula.wallet-balance`

Do not reuse those keys for unrelated modules unless you want to share the same browser identity and order history.

## Embedding pattern

Wrap the application root with `NebulaProvider` and `WalletProvider`, then render the route tree inside the existing layout chrome:

```tsx
<NebulaProvider>
  <WalletProvider>
    <App />
  </WalletProvider>
</NebulaProvider>
```

If you only need the UI components, import them from `src/components/nebula`. If you only need the network layer, import from `src/lib`.

## Reuse notes

- Keep the frontend on a dedicated origin or proxy `/api` to the backend.
- Do not assume the archived monolith folder exists at runtime.
- Treat wallet generation, vault download, and asset signing as browser-side responsibilities.
