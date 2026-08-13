# 🏥 Nexamed — Digital Healthcare Portal

> A comprehensive, multilingual digital healthcare platform that puts essential medical services in one place — from generic medicine discovery and symptom analysis to 24×7 pharmacy, blood bank, and organ registry locators, plus a 1-tap emergency SOS.

---

## Table of Contents

- [Overview](#overview)
- [Why Nexamed](#why-nexamed)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
  - [3. Seed Data](#3-seed-data)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Localization & Accessibility](#localization--accessibility)
- [Security](#security)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Medical Disclaimer](#medical-disclaimer)

---

## Overview

Nexamed is a full-stack healthcare platform designed to bridge the gap between patients and essential medical information & services. It aggregates **9 core modules** into a single, fast, mobile-friendly web application:

1. **Pharma Encyclopedia** — search medicines by brand, generic name, or category; view compositions, side effects, MRP, and cheaper generic substitutes.
2. **Disease Encyclopedia** — clinical overviews (ICD-coded), symptoms, causes, diagnosis, treatment, diet plans, precautions, and linked medications.
3. **Symptom Checker** — select symptoms (grouped by body region) or describe your condition in free text; the engine ranks probable conditions with a confidence score and recommends a doctor specialty.
4. **OCR Medicine Scanner** — photograph/upload a medicine packet; Tesseract.js extracts the text in-browser and the backend fuzzy-matches it against the medicine database (Levenshtein distance).
5. **Medical Store Locator** — find nearby pharmacies on an interactive Leaflet map, sorted by Haversine distance.
6. **Blood Bank Locator** — live blood group stock availability with distance-aware sorting.
7. **Organ Bank Directory** — NOTTO-registered organ/tissue banks searchable by type and city.
8. **Health News & Daily Tips** — curated WHO/MoHFW/ICMR health news feed with a rotating daily wellness tip.
9. **Emergency SOS** — 1-tap emergency trigger that broadcasts your location, notifies your saved emergency contacts, and returns the 108 ambulance dispatch + Google Maps location link.

A **patient profile** system (auth + JWT) stores blood group, allergies, medical history, emergency contacts, and medical reports, powering personalization for the SOS and profile features.

---

## Why Nexamed

- **Cost savings**: Compare branded medicines against generic alternatives (Jan Aushadhi-style) and see exact savings per pack.
- **Emergency readiness**: Critical location-aware services (pharmacies, blood, SOS) are always one tap away.
- **Language inclusivity**: Full UI localization in English, Telugu, Hindi, Tamil, and Kannada, with Web Speech API voice recognition & audio read-out — designed for India's linguistic diversity.
- **Zero heavy infra**: Runs on SQLite + Node.js + React with no external service dependencies for the core data.

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| **Frontend** | React 19, Vite 8, react-leaflet (Leaflet maps), lucide-react icons, tesseract.js (in-browser OCR), canvas-confetti |
| **Backend**  | Node.js, Express 4 (ESM), JSON Web Tokens, bcryptjs |
| **Database** | SQLite3 (file-based, zero-config), auto-initialized & auto-seeded |
| **Linting**   | oxlint |
| **Localization** | Custom React Context (`LanguageContext`) with Web Speech API (recognition + speech synthesis) |

---

## Architecture

```
┌──────────────────────┐         ┌──────────────────────┐
│   React SPA (Vite)   │  REST   │  Express API Server  │
│  client/ (port 5173) │ ──────► │  server/ (port 5000) │
│  └ Pages / Contexts  │  JSON   │  └ routes/api.js     │
│  └ Tesseract OCR     │         │  └ db.js (SQLite)    │
└──────────────────────┘         └──────────┬───────────┘
                                            │
                                     nexamed.db (SQLite)
```

- The **client** is a single-page app with tab-based navigation (`home`, `pharma`, `disease`, `symptom`, `stores`, `blood`, `organ`, `news`, `profile`) rendered by `App.jsx`.
- The **server** auto-creates and seeds the SQLite database on first boot if no users exist (see `index.js:24-49`).
- Cross-origin access is enabled via `cors` for development; the Vite dev server proxies requests to the API (via the port convention `5000`).
- All data access is promise-wrapped around the `sqlite3` driver (`db.js` exports `runQuery`, `getQuery`, `allQuery`).

---

## Project Structure

```
nexamed/
├── client/                      # React frontend (Vite)
│   ├── public/                  # Static assets (favicon, icons)
│   └── src/
│       ├── assets/              # Images
│       ├── components/          # Navbar, Footer, SOSModal, TabletCard
│       ├── context/             # AuthContext, LanguageContext, SOSContext
│       ├── pages/               # Home, PharmaEncyclopedia, DiseaseEncyclopedia,
│       │                        # SymptomChecker, OCRScanner, StoreLocator,
│       │                        # BloodBankLocator, OrganBankLocator,
│       │                        # HealthNews, UserProfile
│       ├── App.jsx              # Tab router + providers + floating SOS button
│       ├── main.jsx             # React entry
│       └── index.css / App.css  # Styling
│
├── server/                      # Express backend
│   ├── index.js                 # Server bootstrap + auto-seed on first run
│   ├── routes/api.js            # All REST endpoints (auth, modules 1–9)
│   ├── db.js                    # SQLite connection, schema, query helpers
│   ├── seed.js                  # Seed data for all tables
│   └── nexamed.db               # SQLite database (auto-created)
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 (ESM is used throughout)
- **npm** ≥ 9
- A modern browser (Chrome/Edge/Firefox) — voice features require Web Speech API support

### 1. Backend Setup

```bash
cd server
npm install

# optional: configure environment (see Environment Variables below)
# copy .env.example to .env if you want custom JWT secret / port

npm run dev        # development (auto-restart via node --watch)
# or
npm start          # production
```

On first boot the server **auto-creates and seeds** the SQLite database (`nexamed.db`). You should see:

```
Connected to Nexamed SQLite database at ...\nexamed.db
Database tables initialized successfully.
No user data found. Auto-seeding database...
🏥 NEXAMED HEALTHCARE BACKEND SERVER ONLINE
```

Verify the server: `GET http://localhost:5000/health`

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

For production build:

```bash
npm run build      # outputs to client/dist
npm run preview    # serve the build locally
```

### 3. Seed Data

The database seeds automatically on first server start. To re-seed manually (e.g. after wiping `nexamed.db`):

```bash
cd server
npm run seed
```

---

## Environment Variables

Create a `.env` file in `server/` (all optional — sensible defaults are provided):

| Variable     | Default                   | Description                          |
|--------------|---------------------------|--------------------------------------|
| `PORT`       | `5000`                    | Express server port                  |
| `JWT_SECRET` | `nexamed_secret_jwt_key_2026` | Secret used to sign JWTs — **change in production** |

> ⚠️ **Security note**: The fallback `JWT_SECRET` is hard-coded for development. In any non-local deployment, set a strong random value via `JWT_SECRET`.

---

## API Reference

Base URL: `http://localhost:5000/api` · All endpoints return JSON.

### Auth & Profile

| Method | Endpoint            | Auth | Description |
|--------|---------------------|------|-------------|
| POST   | `/auth/register`    | —    | Register user (name, email, phone, password, bloodGroup, allergies[], medicalHistory[], emergencyContacts[]) |
| POST   | `/auth/login`       | —    | Login with email/password → JWT (7-day expiry) |
| GET    | `/user/profile`     | ✅   | Full profile: user, blood group, allergies, medical history, emergency contacts, reports |
| POST   | `/user/profile`     | ✅   | Update phone, blood group, weight/height, allergies, contacts |

### Module Endpoints

| Method | Endpoint                       | Description |
|--------|--------------------------------|-------------|
| GET    | `/medicines?q=&category=`      | Search medicines by brand/generic/category with composition summary |
| GET    | `/medicines/:id`               | Medicine detail: compositions, side effects, substitutes + savings |
| GET    | `/diseases?q=&category=`       | Search disease encyclopedia |
| GET    | `/diseases/:id`                | Disease detail: symptoms, diet, precautions, linked medicines |
| GET    | `/symptoms`                    | Symptoms grouped by body region |
| POST   | `/symptom-checker/analyze`     | `{ symptomIds[], customText }` → ranked conditions with confidence score, match level, doctor specialty |
| POST   | `/ocr/match`                   | `{ extractedText }` → best fuzzy medicine match (Levenshtein) + confidence |
| GET    | `/stores?city=&lat=&lng=`      | Medical stores sorted by distance (Haversine) |
| GET    | `/blood-banks?bloodGroup=&city=&lat=&lng=` | Blood banks with live stock, distance-sorted |
| GET    | `/organ-banks?type=&city=`     | NOTTO-registered organ/tissue bank directory |
| POST   | `/sos/trigger`                 | `{ lat, lng, userId }` → logs SOS, returns 108 dispatch, maps link, notified contacts |
| POST   | `/sos/resolve`                 | `{ sosId }` → marks emergency resolved |
| GET    | `/news`                        | Curated health news feed + rotating daily tip |

> API error convention: `{ "error": "human readable message" }` with appropriate HTTP status (400/401/404/500). Protected routes expect `Authorization: Bearer <token>`.

---

## Database Schema

SQLite database `server/nexamed.db` (schema in `db.js`, seed data in `seed.js`):

- **Users**: `users`, `user_profiles`, `user_allergies`, `medical_history`, `emergency_contacts`, `medical_reports`
- **Pharma**: `medicines`, `compositions`, `side_effects`, `substitutes`
- **Clinical**: `diseases`, `symptoms`, `disease_symptoms`, `disease_diet`, `disease_precautions`, `disease_medicines`
- **Services**: `medical_stores`, `store_inventory`, `blood_banks`, `blood_stock`, `organ_banks`
- **Operations**: `sos_events`, `health_tips`

All tables are created with `CREATE TABLE IF NOT EXISTS` and foreign-key cascades — safe to boot against an existing database.

---

## Localization & Accessibility

- **5 languages**: English, Telugu, Hindi, Tamil, Kannada — switched via `LanguageContext` (persisted in `localStorage`).
- **Voice input**: Web Speech API speech recognition tied to the selected language (`LANG_SPEECH_CODE` BCP-47 map).
- **Audio readout**: `speechSynthesis` reads UI text aloud in the selected language.
- The language context is mounted above all pages, so every module (including the SOS flow) is translatable.

---

## Security

- Passwords hashed with **bcrypt** (cost factor 10) — never stored in plain text.
- **JWT**-based session tokens (7-day expiry) required for profile endpoints.
- Auth middleware rejects requests with missing/invalid/expired tokens (`401`).
- Email uniqueness enforced at the database and application level.
- No secrets in the repository; production JWT secret must be overridden via env.

> **For production**: consider HTTPS, rate-limiting (e.g. `express-rate-limit`), request size caps, and replacing the hard-coded fallback JWT secret. SQLite is fine for single-node deployments; migrate to PostgreSQL/MySQL if scaling horizontally.

---

## Contributing

1. Fork the repo and create a feature branch (`git checkout -b feat/my-feature`).
2. Run the backend (`npm run dev` in `server/`) and frontend (`npm run dev` in `client/`).
3. Lint your changes: `cd client && npm run lint` (oxlint).
4. Open a pull request describing the change, screenshots if UI-related, and any schema/migration impact.

---

## Roadmap

- [ ] Doctor appointment booking module
- [ ] Real-time medicine stock at individual stores
- [ ] Report upload & lab-result OCR parsing
- [ ] OTP/email verification for registrations
- [ ] PWA support (offline-first health data access)
- [ ] Move seeded reference data (news, tips) to a remote CMS/API

---

## License

Private / internal project — all rights reserved. Contact the repository owner for usage rights.

---

## Medical Disclaimer

> Nexamed is an **informational and navigational tool**, not a medical device or a substitute for professional medical advice, diagnosis, or treatment. The symptom checker and medicine data are for education and should never replace a consultation with a qualified physician. In a genuine emergency, contact your local emergency number (e.g. **108**) immediately. Always consult a doctor before starting, stopping, or changing any medication.
