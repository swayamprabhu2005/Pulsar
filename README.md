<p align="center">
  <img src="assets/branding/logo.png" alt="Pulsar Platform Logo" width="180" />
</p>

<h1 align="center">Pulsar Platform</h1>

<p align="center">
  <strong>Connected when it matters. Even when networks fail.</strong><br />
  <em>Decentralized Emergency Communication, Offline Mesh & Wilderness Operations Platform</em>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#branch-architecture">Branch Architecture</a> •
  <a href="#core-packages">Packages & Engines</a> •
  <a href="#database-setup">Database</a> •
  <a href="#verification">Verification</a> •
  <a href="#hardware">Hardware Firmware</a>
</p>

---

## Overview

**Pulsar** is a modular, decentralized communication platform designed to guarantee connectivity during cellular outages, natural catastrophes, and wilderness expeditions.

The system combines:
1. **Bluetooth Low Energy (BLE) Mesh Networking:** High-efficiency, multi-hop packet routing without internet.
2. **Wi-Fi Direct:** High-throughput peer-to-peer data transfers.
3. **End-to-End Encryption:** Libsodium-compatible cryptographic protocols.
4. **Internet Relay:** Socket.IO & Supabase PostgreSQL cloud syncing when online.

---

## Branch Architecture

This repository maintains two independently buildable application editions across dedicated Git branches:

```text
               ┌──> community-safety  (Pulsar Community Safety Edition)
               │    • DisasterMesh Emergency Dispatch & 112 dialer
               │    • SafeWalk trusted-contact check-ins
               │    • CrowdCast offline event broadcasts
               │    • MeshChat E2E encrypted private messaging
               │
main ──────────┤
(Foundation)   │
               └──> forest-operations (Pulsar Field Edition)
                    • Forest Officer, Field Ranger & Guide roles
                    • ESP32 solar relay station monitoring
                    • Wilderness SOS & wildlife encounter alerts
                    • Dynamic visitor group supervision
```

### Checking out editions
```bash
# Switch to Community Safety Edition
git checkout community-safety

# Switch to Forest Operations Edition
git checkout forest-operations
```

---

## Core Packages & Engines

```text
Pulsar/
├── packages/
│   ├── mesh-engine/          # Multi-hop routing, LRU dedup, priority store-and-forward
│   ├── shared-types/         # TypeScript contracts (MeshPacket, Incident, UserRole)
│   └── emergency-config/     # Verified national emergency numbers (India 112, 100, 101, 108...)
├── backend/                  # Express + Socket.IO + Prisma ORM (Supabase PostgreSQL)
├── firmware/                 # ESP32 BLE relay firmware & software simulator
└── assets/branding/          # High-resolution logos & icons
```

---

## Verification & Automated Testing

Pulsar validates genuine 3-device multi-hop forwarding (`Device A → Device B → Device C`):

```bash
pnpm install
pnpm --filter @pulsar/mesh-engine test
```

---

## Database Setup

Configured for **Supabase PostgreSQL** (no local Docker required):
1. Copy `backend/.env.example` to `backend/.env` and paste your Supabase pooler URL.
2. Run migrations:
   ```bash
   cd backend && pnpm prisma:migrate
   ```

---

<p align="center">
  <sub>Pulsar Platform • Authored by <a href="https://github.com/swayamprabhu2005">Swayam Kiran Prabhu</a>.</sub>
</p>
