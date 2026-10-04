# Frenchie v2

A private, mobile-first French learning app with two distinct experiences: a French-first learning path and a Montréal / Québec spoken-language side door.

## Run locally

```powershell
npm install
npm run dev
```

Open **http://127.0.0.1:5173/**. Progress belongs to that browser and origin; changing host or port creates a separate local progress space.

```powershell
npm test
npm run build
```

The source app lives in `src/`, assets in `public/`, and the original design/content handoff lives in `frenchie-v2/`. See [the implementation handoff](frenchie-v2/V2_IMPLEMENTATION.md) for current capabilities, remaining work, content sources, and storage details.

No account, backend, or paid service is required. Nothing has been deployed by this implementation. `vercel.json` contains the SPA fallback for future Vercel hosting. For future deployment work, installing the Vercel CLI with `npm i -g vercel` is recommended; it is not needed to run the app locally.
