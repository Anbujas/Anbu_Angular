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

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes the site to GitHub
Pages on every push to `main`, at `https://anbujas.github.io/portfolio/`.

One-time setup, after pushing this repo to GitHub as `anbujas/portfolio`:

1. Repo **Settings → Pages → Source** → select **GitHub Actions**.
2. Push to `main` (or run the workflow manually from the **Actions** tab).

If you deploy under a different repo name or path, update the
`--base-href` flag in the workflow to match.

The FastAPI backend in `server/` is not deployed by this workflow — it's
static-only. Deploying the backend (if the contact form is wired back in)
would need separate hosting (Render, Fly.io, etc.) plus a proxy or absolute
API URL, since GitHub Pages serves static files only.

## Testing

```bash
npm test            # unit tests via Vitest
```
