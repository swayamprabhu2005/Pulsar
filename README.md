<p align="center">
  <img src="assets/branding/logo.png" alt="Pulsar Logo" width="180" />
</p>

<h1 align="center">Pulsar</h1>

<p align="center">
  <strong>Connected when it matters. Even when networks fail.</strong><br />
  <em>Decentralized Emergency Communication & Public Safety Platform</em>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#core-capabilities">Core Capabilities</a> •
  <a href="#system-architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#mesh-networking">Mesh Engine</a> •
  <a href="#database-setup">Database</a> •
  <a href="#branch-guide">Branch Guide</a>
</p>

---

## Overview

**Pulsar** is a modern, high-resilience public safety and decentralized emergency communications platform designed for citizens, families, event organizers, and response personnel.

Unlike conventional chat applications that fail during network congestion, power outages, cell-tower breakdowns, or natural disasters, Pulsar operates across a hybrid transport layer combining **Internet connectivity (WebSockets/REST)** with **offline peer-to-peer mesh networks (Bluetooth Low Energy & Wi-Fi Direct)**.

### Target Audience
* **Citizens & Families:** Rapid SOS dispatch, check-in pings, and localized emergency alerts.
* **Campus & Event Organizers:** CrowdCast offline public announcements during large-scale gatherings.
* **Community Neighborhoods:** SafeWalk trusted-contact tracking with automated fail-safes.
* **First Responders:** Structured incident data ingest with GPS accuracy and test mode verification.

---

## Core Capabilities

```mermaid
flowchart TD
    User["Citizen / Responder"] --> Engine["Pulsar Engine"]
    Engine --> DM["DisasterMesh\n• 1-Sec Hold SOS\n• Official Helpline Integration (112)\n• Priority-based Multi-hop Queuing"]
    Engine --> MC["MeshChat\n• E2E Encrypted Conversations\n• Store-and-Forward Offline Delivery\n• Delivery Status Receipts"]
    Engine --> SW["SafeWalk\n• Real-time Check-in Sessions\n• Trusted Contact Location Sharing\n• Automated Missed Check-in SOS"]
    Engine --> CC["CrowdCast\n• Offline Verified Broadcasts\n• Signed Ed25519 Propagation\n• Anti-Spoofing Channels"]
```

1. **DisasterMesh (Emergency Dispatch):**
   * Accessible, high-contrast emergency dispatch interface with anti-accidental 1-second press-and-hold activation.
   * Emergency categories: Medical, Fire, Flood, Earthquake, Accident, Missing/Trapped Person, Violence/Danger.
   * Direct dialer hook for India's national emergency number (`112`) and service helplines (`100`, `101`, `108`, `1077`, `1091`, `1098`) sourced from official government authorities.
   * Strict test mode toggle to safeguard against accidental real-world alert dispatch.

2. **MeshChat (E2E Encrypted Messaging):**
   * Direct & group communication using local mesh propagation when cellular/Wi-Fi is down.
   * Libsodium-compatible cryptographic protocols (X25519 key exchange + XSalsa20-Poly1305 payload encryption).
   * Relays cannot inspect private message content.

3. **SafeWalk (Personal Safety):**
   * Timed safety sessions with trusted contact tracking and live consent-based location sharing.
   * Automated escalation if a scheduled check-in is missed.

4. **CrowdCast (Public Broadcasting):**
   * Offline-propagating public service announcements for festivals, university campuses, and municipal warnings.
   * Cryptographically signed packets (Ed25519) to prevent malicious impersonation of official channels.

---

## System Architecture

The monorepo is structured cleanly with shared packages, native Android modules, and backend services:

```text
Pulsar/
├── apps/
│   └── mobile/              # React Native Android Application (bare workflow)
│       ├── android/          # Native Kotlin modules (BLE scanner/advertiser & foreground service)
│       ├── assets/           # Bundled icons and brand marks
│       └── src/
│           ├── features/     # Auth (Phone+OTP), DisasterMesh, SafeWalk, CrowdCast, MeshChat
│           ├── navigation/   # Community bottom-tab navigation
│           ├── storage/      # Local priority queue (SQLite / local memory)
│           └── theme/        # Chroma-Craft calibrated design system tokens
│
├── packages/
│   ├── mesh-engine/          # Transport-agnostic mesh networking engine
│   │   ├── src/dedup/        # LRU dedup cache (anti-flood loop protection)
│   │   ├── src/packet/       # Packet builder, validator, and TTL decrementer
│   │   ├── src/store/        # Priority-ordered store-and-forward queue
│   │   └── src/transport/    # Transport adapters (BLE, Wi-Fi Direct, Internet)
│   ├── shared-types/         # Common TypeScript data models across mobile & backend
│   └── emergency-config/     # Verified national emergency numbers (India 112, US 911, UK 999)
│
├── backend/                  # Real-time WebSocket + REST API server
│   ├── prisma/               # Database schema configured for Supabase PostgreSQL
│   └── src/                  # Express, JWT authentication, and phone verification modules
│
├── firmware/                 # ESP32 relay firmware & simulator
│   ├── sim/                  # Software relay simulator for CI and hardware-free testing
│   └── src/                  # Arduino/ESP-IDF BLE relay firmware sketch
│
└── assets/
    └── branding/             # High-resolution logos and icons
```

---

## Getting Started

### Prerequisites
* **Node.js:** `>= 20.0.0`
* **Package Manager:** `pnpm >= 9.0.0`
* **Mobile Runtime:** Android SDK (API level 31+ for modern Bluetooth permissions)

### Installation & Build

```bash
# Clone the repository
git clone https://github.com/swayamprabhu2005/Pulsar.git
cd Pulsar

# Install dependencies across all workspaces
pnpm install

# Build shared packages and backend
pnpm --filter @pulsar/shared-types build
pnpm --filter @pulsar/emergency-config build
pnpm --filter @pulsar/mesh-engine build
pnpm --filter @pulsar/backend prisma:generate
pnpm --filter @pulsar/backend build
```

### Running Automated Mesh Tests

Verify genuine 3-device multi-hop packet forwarding (`Device A → Device B → Device C`):

```bash
pnpm --filter @pulsar/mesh-engine test
```

---

## Database Setup

Pulsar is pre-configured to use **Supabase PostgreSQL** (no local Docker or database installation required).

1. Create a free project on [Supabase](https://supabase.com).
2. Copy `backend/.env.example` to `backend/.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Set your connection strings in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
   ```
4. Run migrations:
   ```bash
   cd backend && pnpm prisma:migrate
   ```

---

## Branch Guide

| Branch | Purpose |
|---|---|
| `main` | Foundation, core shared packages, Prisma schema, and ESP32 firmware. |
| `community-safety` | **Pulsar Community Safety Edition** (Citizens, SafeWalk, DisasterMesh, CrowdCast). |
| `forest-operations` | **Pulsar Field Edition** (Forest rangers, patrol teams, guides, tourist groups, relay stations). |

---

<p align="center">
  <sub>Developed with pride by <a href="https://github.com/swayamprabhu2005">Swayam Kiran Prabhu</a>.</sub>
</p>
