# NebulaVerse Frontend Environment Context

This document captures the fully elaborated context, architecture, and configuration of the NebulaVerse Frontend Module. It serves as a unified context-sharing resource for developers across multiple environments.

---

## 1. Environment & Purpose

The frontend module located at `c:\NebulaVerse\Frontend_NV_v1\frontend` serves as the reusable presentation layer for the NebulaVerse experience. It is intentionally decoupled from the previous monolith structure, allowing it to function independently against various backend or module stacks without inheriting legacy sandbox, chain, or storage implementations.

**Key Responsibilities:**
- Provide a cinematic, exchange-like product shell (Home, Surf, Orders, Trends, Login, Customize).
- Manage wallet-based identity and account state in the browser.
- Facilitate in-browser wallet generation, vault export/import, and signing.
- Communicate with the backend for market, chain, and order state synchronization.

---

## 2. Technology Stack

The module is built on a modern, highly interactive web stack:
- **Framework**: [Next.js v15.5.14](https://nextjs.org/) (App Router paradigm)
- **UI Library**: [React v19.2.4](https://react.dev/) / React DOM
- **Styling**: [Tailwind CSS v3.4.17](https://tailwindcss.com/) with PostCSS & Autoprefixer
- **Animations**: [Framer Motion v12.38.0](https://www.framer.com/motion/)
- **Icons**: Lucide React v1.7.0
- **Language**: TypeScript v5.x
- **Utilities**: `clsx`, `tailwind-merge`

**Available Scripts (from `package.json`):**
- `npm run dev`: Starts the Next.js development server
- `npm run build`: Compiles the application for production
- `npm run start`: Runs the built application
- `npm run lint`: Executes Next.js ESLint configuration
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors
- `npm run test:catalog`: Runs native Node tests on catalog utilities

---

## 3. High-Level Architecture & Data Flow

### 3.1. Provider-Based State Orchestration
The application wraps its root in a layered provider pattern (`<NebulaProvider>` and `<WalletProvider>`). This manages:
- **Wallet Identity**: Public keys, balances, and vault connections.
- **Protocol State**: Market state, mempool state, and chain state.
- **Transactional State**: Order history, pending counts, and upload/purchase processing states.

### 3.2. Browser-Side Autonomy
The browser is treated as a trusted local environment:
- Wallet generation creates keys locally.
- Wallets are restored from PEM contents via Vault files.
- Cryptographic hashing and signing for transactions (like asset uploads) happen in-browser before hitting the backend.

### 3.3. Interaction Cycle
Upon initial load, local UI state is hydrated from browser storage. The global provider then begins a periodic polling cycle to the backend to refresh market state, mempool state, chain state, and wallet balance.

---

## 4. Directory & File Structure

The workspace is organized to keep routing lightweight and delegate logic to domain-specific components and libraries.

### Root Directories
- `/frontend`: The isolated Next.js frontend application.
- `/archive/nebulaverse-monolith`: (Archived) The old monolithic implementation.

### `/frontend/src` Breakdown

#### `/src/app` (Next.js App Router)
Contains the application shell and route definitions. Routes are primarily lightweight wrappers around components.
- `layout.tsx` / `template.tsx`: Global app shell, establishes metadata, loads fonts, renders the visual effects layer, and injects providers.
- `page.tsx`: Home route.
- `/surf`: Surf entry and marketplace interactions (buy/sell).
- `/orders`: User order and transaction tracking.
- `/trends`: Market trend exploration.
- `/customize`: Configuration experiences.
- `/login`: Identity and access shell.

#### `/src/components/nebula` (UI & Experience Layer)
Contains all heavy-lifting UI components and providers:
- **Providers**: `nebula-provider.tsx` (Global state store).
- **Core Pages**: `home-page.tsx`, `surf-page.tsx`, `orders-page.tsx`, `trends-page.tsx`, `login-page.tsx`, `customize-page.tsx`.
- **Chrome/Layout**: `site-chrome.tsx` (Persistent navigation), `cosmic-backdrop.tsx`, `cosmic-cursor.tsx` (Cinematic motion layers).
- **Widgets**: `section-card.tsx`, `signal-pill.tsx`, `shared-notice.tsx`.

#### `/src/context`
- `wallet-context.tsx`: A lightweight context specifically for wallet operations (ID, balance, vault download, disconnect) separate from the broader Nebula protocol state.

#### `/src/lib` (Network & Domain Logic)
- `nebula-api.ts`: Client-side API helpers (`GET /api/market_state`, `POST /api/upload`, etc.).
- `nebula-wallet.ts`: Cryptographic helpers (wallet creation, import/export, signing).
- `nebula-types.ts`: TypeScript interfaces defining API responses and internal data structures.
- `catalog-utils.ts` & `module-shell.ts`: Helper utilities.

---

## 5. Storage & Persistence Contracts

The UI relies heavily on standard local browser storage to persist user sessions and identity. **Do not reuse these keys for unrelated modules.**

- `nebula.browser-wallet`: Persists the local wallet identity.
- `nebula.orders`: Persists the user's order history.
- `nebula.wallet-id`: Stores the active wallet identifier.
- `nebula.wallet-balance`: Caches the last known wallet balance.

---

## 6. Backend Integration Contract

The frontend requires the backend to expose the following RESTful API endpoints at the configured `NEXT_PUBLIC_NEBULA_API_BASE_URL` (or `/api` by default). 

### Required Endpoints
- `GET /api/market_state`: Retrieves current assets on the market.
- `GET /api/mempool`: Retrieves pending network transactions.
- `GET /api/chain`: Retrieves the blockchain state.
- `GET /api/user_orders/:walletId`: Retrieves orders for a specific user.
- `GET /api/balance/:walletId`: Retrieves balance for a specific user.
- `POST /api/faucet`: Funds a wallet.
- `POST /api/upload`: Handles asset uploads (must be pre-signed by the client).
- `POST /api/buy`: Initiates a purchase transaction.
- `GET /api/download/:assetName`: Fetches an asset's data.

**Error Handling:**
Backend responses must follow the shapes defined in `src/lib/nebula-types.ts`. Error responses must be returned as JSON containing at least one of the fields: `error`, `reason`, or `message`.

---

## 7. Review & Scaling Considerations
*(Derived from internal architecture reviews)*

- **State Density**: `NebulaProvider` manages a substantial amount of domain logic. As the marketplace grows, consider breaking this into feature-specific hooks.
- **Security Context**: The module depends implicitly on browser storage and client-side crypto constraints.
- **Validation**: Current error handling relies heavily on provider states. Future iterations may require stricter domain-level schemas and retry patterns.
- **Testing Coverage**: Currently lacks extensive visual/unit tests within the frontend component layer.

---
*Generated for multi-environment synchronization. Refer to `INTERFACE.md` and `ARCHITECTURE_REVIEW.md` in the `/frontend` directory for deeply targeted architectural deep-dives.*
