# SinkMC Architecture & Design Blueprint (v1.0.0)

This document serves as the foundational reference and "North Star" for **sinkmc**, a deterministic, developer-first plugin and software distribution platform for the Minecraft ecosystem.

---

## 1. Core Ethos

SinkMC is built to repair the fractured relationship between platforms, developers, and server administrators. We reject the legacy "forum thread" mentality and pay-to-win visibility algorithms. SinkMC treats server configuration as **Infrastructure as Code (IaC)**, operating under an independent, non-profit model with public financial transparency. We focus entirely on optimizing the technical pipeline for systems engineers and network administrators rather than catering to casual client-side audiences.

---

## 2. Core Architectural Decisions

### A. Split Monorepo Architecture
* **Structure:** A unified git repository separating concerns via native package manager workspaces:
  * `apps/web/` (SvelteKit user dashboard running on Cloudflare Pages/Workers)
  * `apps/api/` (Standalone Hono REST API running on Cloudflare Workers)
  * `packages/cli/` (Standalone `sink` terminal utility toolchain)
* **Rationale:** SvelteKit handles human interfaces (SSR, UI, cookies) while the lightweight Hono worker processes machine automation (CLI downloads, GitHub Actions) at maximum edge speeds without framework overhead.

### B. Cloudflare Serverless Stack
* **Database (D1):** Relational, edge-cached configuration storage holding structured data for users, plugins, version manifests, and tokens.
* **Storage (R2):** Native hosting for compiled `.jar` binaries. By storing physical binaries, SinkMC preserves the long-term ability to extract manifests (`plugin.yml`), compute file hashes, and power secure auto-updaters with zero egress fees.
* **Communication:** SvelteKit securely communicates with the API Worker via **Cloudflare Service Bindings**, enabling in-memory, zero-latency internal routing that completely bypasses the public internet.

### C. End-to-End Type Safety via Hono RPC
* **Implementation:** The API leverages Hono's RPC mode, exporting only the application route types (`AppType`) to the SvelteKit frontend client.
* **Rationale:** Provides compile-time type safety, payload validation (via Zod), and IDE autocomplete internally, while exposing a clean, standard, standard REST API to external clients (bash, Go, curl, Prism Launcher).

### D. Dual-Auth Bridge & Internal Service Secret
* **Machine Traffic:** External developers and tools authenticate via an explicit `Authorization: Bearer <token>` header verified against D1.
* **Web Traffic:** SvelteKit manages secure, browser-isolated `httpOnly` sessions. It communicates with administrative API routes using a protected pre-shared key header (`X-Sink-Internal-Secret`), preventing unauthorized users from spoofing session token initializations over the web.

### E. Account-Bound Bytecode Watermarking (Anti-Piracy)
* **Implementation:** Rejects intrusive, phone-home network verification code that causes server lag and downtime. Instead, the Cloudflare backend dynamically injects a cryptographically unique buyer signature (nonce) into the compiled `.jar` bytes in-memory during download.
* **Rationale:** Ensures legitimate servers run completely offline with 0% performance overhead, while allowing developers to trace leaked binaries back to the originating buyer account to immediately terminate their access network-wide.

### F. The `sink-manifest.yml` Lockfile
* **Concept:** Introduces a declarative, deterministic infrastructure manifest modeled closely after `package-lock.json` or `Cargo.lock`.
* **Rationale:** Allows network administrators to lock down immutable plugin binaries, version numbers, and SHA-256 hashes inside Git, unlocking atomic system rollbacks, synchronized dev/prod environments, and single-command node deployments (`sink install`).

---

## 3. Ecosystem Landscape Matrix

| Feature / Metric | **SinkMC** | **SpigotMC** | **BuiltByBit** | **Modrinth** | **Voxel.shop** *(Polymart)* |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Audience** | Systems Engineers & Network Admins | Casual Server Owners / Forums | Builders, Setups, & Config Flippers | Client Modders & General Players | Premium Plugin Developers |
| **Deployment DX** | Automated CI/CD Pipelines & First-Party Git Actions | Manual web browser forms & file uploads | Manual web browser forms & file uploads | App Launcher & Web Dashboard | Web Forms & Basic Webhooks |
| **Server Admin UX** | CLI Lockfile Sync (`sink-manifest.yml`) | Manual browser hunting & SFTP drops | Manual browser hunting & SFTP drops | Launcher GUI / Manual Downloads | Manual Downloads |
| **Platform Model** | Independent Non-Profit (Public Ledger) | Corporate/Legacy Legacy Forums | Highly Commercialized (Pay-to-Win Ads) | Acquired Studio Corporate (Spark Universe) | Commercial Marketplace |
| **Asset Verification** | Automated Bytecode, Manifest, & Hash Analysis | Blind trust in forum descriptions | Basic manual file approval queues | Automated Mod/Pack Scanning Suite | Basic automated upload validation |
| **Anti-Piracy** | Dynamic Bytecode Watermarking | Crude Text Injections (`%%__USER__%%`) | Left entirely to individual developer code | N/A (Focuses almost entirely on Free assets) | Basic built-in string replacements |
