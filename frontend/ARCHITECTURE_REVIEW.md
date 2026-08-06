# NebulaVerse Frontend Module Review Document

This document is intended for internal review, design discussion, and technical alignment. It describes how the current frontend module works, how its architecture is organized, and what should be evaluated before broader integration or scaling.

## 1. Purpose of the module

The frontend module is a reusable presentation layer for the NebulaVerse experience. It provides:

- a cinematic product shell for browsing and interacting with a software exchange experience
- wallet-based identity and account state
- market, order, and transaction-related UI flows
- browser-side wallet generation, vault import/export, and signing helpers

The implementation is currently built as a Next.js app-router frontend with React, Tailwind CSS, Framer Motion, and a provider-based state model.

## 2. What the frontend is doing today

The current interface supports the following high-level user journeys:

- Home: landing experience, wallet creation, entry into the main product flow
- Surf: browsing and interacting with marketplace actions such as buy and sell flows
- Orders: monitoring user-related orders and transaction state
- Trends: surface-level market and trend exploration
- Customize: customization or configuration experience
- Login: identity and access-oriented shell

At a product level, the module is meant to feel like a polished, immersive “exchange” experience rather than a simple CRUD UI.

## 3. High-level working model

The frontend works around a few central ideas:

1. The app is wrapped in a global provider layer that owns wallet and protocol state.
2. UI pages are mostly thin route components that consume that global state.
3. The browser is treated as the trusted local environment for wallet persistence and signing.
4. The UI pulls live marketplace data from a backend contract and keeps the experience responsive through periodic refreshes.

In practical terms, the user can:

- generate or import a wallet
- persist that wallet in browser storage
- view market state and queue state
- upload an asset and sign it in-browser
- purchase an asset and track its pending or downloadable status

## 4. Architecture overview

### 4.1 Application shell

The root layout in [src/app/layout.tsx](src/app/layout.tsx) establishes the global app shell:

- sets app metadata
- loads display and mono fonts
- renders the global visual effects layer
- wraps the application with the Nebula and wallet providers

This creates a consistent “experience layer” that is shared across every route.

### 4.2 Routing structure

Routes are organized under [src/app](src/app):

- [src/app/page.tsx](src/app/page.tsx) → home page
- [src/app/surf/page.tsx](src/app/surf/page.tsx) → surf entry page
- [src/app/customize/page.tsx](src/app/customize/page.tsx) → customization screen
- [src/app/orders/page.tsx](src/app/orders/page.tsx) → orders experience
- [src/app/trends/page.tsx](src/app/trends/page.tsx) → trends experience
- [src/app/login/page.tsx](src/app/login/page.tsx) → login/account experience

Each route mostly delegates to a component under [src/components/nebula](src/components/nebula), keeping the route layer lightweight.

### 4.3 State architecture

The main state orchestration is centralized in [src/components/nebula/nebula-provider.tsx](src/components/nebula/nebula-provider.tsx).

This provider manages:

- wallet identity and public key
- balance
- market state
- mempool state
- chain state
- orders and pending order counts
- upload/purchase busy state
- notices and feedback messages

It acts as the main domain store for the application.

### 4.4 Wallet context

The wallet-specific context in [src/context/wallet-context.tsx](src/context/wallet-context.tsx) provides a smaller interface for components that need:

- wallet ID
- balance
- refresh balance
- vault download
- wallet disconnection

This separation keeps wallet access easier to consume than the broader Nebula provider.

### 4.5 UI components

The component layer under [src/components/nebula](src/components/nebula) contains the actual experience UI:

- [src/components/nebula/home-page.tsx](src/components/nebula/home-page.tsx) for the landing experience
- [src/components/nebula/site-chrome.tsx](src/components/nebula/site-chrome.tsx) for the persistent nav and account shell
- [src/components/nebula/surf-landing-page.tsx](src/components/nebula/surf-landing-page.tsx) and related surf pages for marketplace interaction
- [src/components/nebula/orders-page.tsx](src/components/nebula/orders-page.tsx) for order tracking
- [src/components/nebula/trends-page.tsx](src/components/nebula/trends-page.tsx) for trends UI
- [src/components/nebula/customize-page.tsx](src/components/nebula/customize-page.tsx) for customization flow

The design is modular enough that each page can be reviewed independently.

## 5. Data flow and interaction model

### 5.1 Initial load

On first render:

- the provider checks browser storage for an existing wallet and persisted orders
- it initializes local UI state from storage
- it begins refreshing protocol state from the backend

### 5.2 Protocol refresh cycle

The provider periodically calls the backend to fetch:

- market state
- mempool state
- chain state
- wallet balance

This keeps the UI aligned with the latest state while preserving a local, reactive experience.

### 5.3 Wallet lifecycle

The wallet flow is currently centered around browser-side generation and restoration:

- generate wallet → create keys and download a vault file
- import vault → restore the wallet from PEM contents
- disconnect → clear wallet state from storage

### 5.4 Upload and purchase flow

The module also supports:

- file hashing and signing before upload
- asset publishing with metadata, price, and category inference
- purchase requests that create a pending order entry and then reconcile it against chain and mempool state

This creates a rich interaction loop between the client state and the gateway/backend.

## 6. Technical strengths

The current implementation has several strengths:

- Clear separation between app shell, providers, and page components
- Good use of context-based state for a medium-sized frontend experience
- Strong visual consistency through a shared chrome and polished motion layer
- Browser-side wallet handling that fits the intended product model
- Reusable structure for future backend replacement or module embedding

## 7. Analysis and review points

### 7.1 Strengths to preserve

- The modularity of the page/component structure is a good foundation.
- The provider-based architecture makes it easier to reason about shared state.
- The UI feels intentional and coherent rather than a loose collection of screens.
- The separation between UI and wallet/network logic is helpful for future reuse.

### 7.2 Risks and concerns

Several architectural questions are worth discussing:

- The main provider is doing a lot of work. It currently handles wallet state, protocol state, order reconciliation, notices, upload, and purchase actions. This is functional but may become harder to maintain as the product grows.
- The application depends on browser storage and client-side crypto behavior, which should be explicitly documented as a product requirement and security boundary.
- Error handling is present but could be standardized further around domain-level states and retry patterns.
- The current structure appears suited to a demo or early product shell, but may need stronger abstraction if more complex marketplace logic is introduced.
- There are no visible tests or formal validation patterns in the current frontend module, which may become an issue as behavior becomes more business-critical.

### 7.3 Discussion topics for reviewers

Suggested questions for review:

1. Should the domain logic be split into smaller hooks or feature-specific providers?
2. Is the current provider structure still appropriate if the marketplace grows in complexity?
3. How should wallet and signed transaction flows be validated more formally?
4. Should the UI be made more backend-contract-driven with stronger type validation and schema checks?
5. What level of persistence and recovery is expected for wallet, orders, and account state across devices or sessions?
6. Is the current visual shell appropriate for the intended product maturity, or should it shift toward a more utility-first interface?

## 8. Suggested next steps

For the next phase, the team could focus on:

- introducing stronger domain boundaries around wallet, marketplace, and orders
- adding tests for critical flows such as wallet creation, upload, and purchase state changes
- formalizing the API contract and response validation layer
- documenting the expected backend behavior more precisely
- reviewing whether the current visual model should remain immersive or become more practical for enterprise or investor review

## 9. Summary

The current frontend module is a thoughtful, cohesive experience that already demonstrates the intended product direction. Its architecture is understandable, visually consistent, and structurally reusable. The main opportunity is not a complete rewrite, but a thoughtful refinement of the state model, validation approach, and product-level robustness as the module moves from prototype-style polish toward a more serious integration-ready product.
