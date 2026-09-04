# Anbu Murugesan — Portfolio

Angular 22 (standalone components) portfolio site. Hero section, a 10-card
project grid with 3D flip cards and per-card canvas animations, and
case-study modals. See `src/app/portfolio.service.ts` for all project
content.

A FastAPI contact-form backend lives in `server/` but is currently **not**
wired into the UI — the live "Connect with me" button is a plain `mailto:`
link. The backend is dormant scaffolding for a future contact-form feature.

## Development

```bash
npm install
npm start          # ng serve, http://localhost:4200
```

If you want to exercise the dormant contact-form backend locally:

```bash
cd server
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cp .env.example .env   # fill in real SMTP creds to send actual email;
                        # leave blank and it just logs inquiries instead
.venv/bin/uvicorn main:app --reload --port 8000
```

`ng serve --proxy-config proxy.conf.json` (or `npm start`, which already uses
it via `angular.json`) routes `/api/*` to `localhost:8000` in dev.

## Building

```bash
npm run build       # outputs to dist/anbu-portfolio/browser
```

## Deployment (Netlify)

`netlify.toml` configures the build (`npm run build`) and publish directory
(`dist/anbu-portfolio/browser`) for Netlify.

One-time setup:

1. [Netlify dashboard](https://app.netlify.com) → **Add new site → Import
   an existing project** → connect this repo. Netlify reads `netlify.toml`
   automatically, so build command and publish directory are already set.
2. Every push to the connected branch triggers a new deploy.

Or from the CLI, without connecting a git repo:

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist/anbu-portfolio/browser
```

No SPA redirect rule is needed — this app has no client-side router (just
in-page `#anchor` links), so there's no deep-link path for Netlify to need
a fallback for.

The FastAPI backend in `server/` is not deployed by this — Netlify serves
static files only. Deploying the backend (if the contact form is wired back
in) would need separate hosting (Render, Fly.io, a Netlify Function, etc.).

## Testing

```bash
npm test            # unit tests via Vitest
```
