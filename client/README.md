# Nexamed Client (Frontend)

React 19 + Vite single-page application for the Nexamed Digital Healthcare Portal.

## Development

```bash
npm install
npm run dev        # http://localhost:5173 (proxies /api → http://localhost:5000)
```

The Vite dev server proxies all `/api` requests to the Express backend on port 5000
(see `vite.config.js`), so the frontend never hard-codes a backend origin.

## Scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm run dev`  | Start the Vite dev server with HMR   |
| `npm run build`| Production build → `dist/`           |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint over the source           |

## Structure

- `src/pages/` — one module per page: Pharma & Disease encyclopedias, Symptom Checker,
  OCR scanner, Store/Blood/Organ locators, Health News, User Profile, Home
- `src/context/` — `AuthContext` (JWT + profile), `LanguageContext` (5 languages +
  Web Speech), `SOSContext` (emergency flow)
- `src/components/` — Navbar, Footer, SOS modal, medicine card

> Requires the backend server (see the root `README.md`).
