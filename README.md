# The Invisible Clicker

A satirical browser game built with Next.js. Deploy to Vercel for a global shared scoreboard.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without KV env vars, the leaderboard uses **browser localStorage** (per-device only).

To test the shared API locally, copy `.env.example` to `.env.local` and add your KV credentials from Vercel.

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/the-invisible-clicker.git
git branch -M main
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework preset: **Next.js** (defaults are fine)
4. **Before deploying**, add storage (step 3)

### 3. Add Redis / KV storage

1. Vercel project → **Storage** (or [Marketplace → Redis](https://vercel.com/marketplace?category=storage&search=redis))
2. Create a Redis database (Upstash Redis is the current Vercel integration)
3. **Connect to project** — this injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`

### 4. Deploy

Deploy from the Vercel dashboard or push to `main`. Each push redeploys automatically.

### 5. Verify shared scoreboard

1. Finish a game on one device
2. Open the same `.vercel.app` URL on another device
3. Both should show the same **Global Disruptors Registry**

`localhost` and production use separate storage unless you add `.env.local` with production KV credentials.

## Clear the global scoreboard

Vercel dashboard → **Storage** → your Redis/KV store → delete the key `nexus_shame_registry`.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `KV_REST_API_URL` | Production | Redis REST URL (auto-set by Vercel Storage) |
| `KV_REST_API_TOKEN` | Production | Redis REST token (auto-set by Vercel Storage) |

## Notes

- Scores are computed client-side; the global board is trust-based (fine for a demo game).
- Leaderboard keeps the latest **100** entries (`LEADERBOARD_MAX_ENTRIES`).
- Operator names are public on the shared board.
