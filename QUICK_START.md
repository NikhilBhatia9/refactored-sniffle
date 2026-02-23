# Quick Start Guide

## Current Status

### ✅ Week 1 — Foundation (Complete)

- **Database Layer**: PostgreSQL schema with 7 tables, RLS policies, demo seed data
- **TypeScript Backend**: Express.js REST API, Supabase integration, data ingestion, recommendation engine
- **Documentation**: Setup guides, deployment guides, API documentation

### ✅ Week 2 — Frontend Integration (Complete)

- **Supabase Client**: `frontend/src/lib/supabase.js` — client initialization with `isSupabaseConfigured` flag
- **React Hooks with Real-Time Subscriptions**: 4 custom hooks (`useRecommendations`, `useSectors`, `useEconomicIndicators`, `useMarketData`) that subscribe to Postgres changes via Supabase channels
- **Demo Data Fallback**: All hooks and pages gracefully fall back to built-in demo data when no backend or Supabase is available — the frontend is fully browseable out of the box
- **All 5 Pages Rendering**: Dashboard, Sectors, Recommendations, Macro View, and Portfolio all display rich data with animations and interactive filtering
- **UI Components**: shadcn/ui-compatible primitives (Button, Card, Badge, Skeleton), Framer Motion animations, Recharts data visualizations

## Quick Start — View the Frontend (No Backend Required)

The fastest way to see the app:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000/refactored-sniffle/** — all pages render with built-in demo data.

A yellow **"Demo Mode"** banner appears on the Dashboard. To switch to live data, configure Supabase or start the backend (see below).

## Quick Start — Full Stack

### 1. Set Up Supabase

Follow `docs/SUPABASE_SETUP.md`:

```bash
# 1. Create Supabase project at https://supabase.com
# 2. Run database/schema.sql in SQL Editor
# 3. Run database/rls-policies.sql
# 4. Run database/seed-data.sql (optional)
# 5. Copy API keys from Settings > API
```

### 2. Configure & Run Backend

```bash
cd backend-ts
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

Server starts on `http://localhost:8000`

### 3. Connect Frontend to Supabase (Optional — for real-time)

Create `frontend/.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then start the frontend:
```bash
cd frontend
npm run dev
```

A green **"Live Data"** badge will appear on the Dashboard confirming the real-time connection.

## Data Modes

| Mode | Badge | How to Activate |
|------|-------|-----------------|
| **Demo** | 🟡 Yellow | Default — no configuration needed |
| **Backend API** | 🟡 Yellow (backend connected) | Start `backend-ts` with `npm run dev` |
| **Supabase Real-Time** | 🟢 Green | Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |

## Project Structure

```
refactored-sniffle/
├── frontend/              # React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/         # Dashboard, Sectors, Recommendations, MacroView, Portfolio
│   │   ├── components/    # RecommendationCard, SectorCard, MacroIndicator, etc.
│   │   ├── hooks/         # useRecommendations, useSectors, useEconomicIndicators, useMarketData
│   │   ├── data/          # demoData.js — built-in demo data
│   │   ├── lib/           # supabase.js, utils.js
│   │   └── services/      # api.js — Axios REST client
│   └── package.json
├── backend-ts/            # TypeScript Express backend
│   ├── src/
│   │   ├── config/        # Supabase configuration
│   │   ├── services/      # Data ingestion, recommendation engine
│   │   ├── routes/        # health, recommendations, sectors, economic
│   │   ├── types/         # TypeScript interfaces
│   │   └── utils/         # Logger
│   └── package.json
├── database/              # PostgreSQL schema, RLS policies, seed data
└── docs/                  # Setup, deployment, and architecture docs
```

## API Endpoints

### Health
- `GET /health` - Health check

### Recommendations
- `GET /api/recommendations` - Get all (query: `strategy`, `sector`, `min_conviction`, `risk_level`, `limit`)
- `GET /api/recommendations/top` - Top opportunities
- `GET /api/recommendations/growth` - Growth picks
- `GET /api/recommendations/value` - Value picks
- `GET /api/recommendations/defensive` - Defensive picks
- `GET /api/recommendations/contrarian` - Contrarian picks

### Sectors
- `GET /api/sectors` - Get all sectors
- `GET /api/sectors/:name` - Get sector analysis

### Economic
- `GET /api/economic/indicators` - Economic indicators
- `GET /api/economic/market-data` - Market data
- `GET /api/economic/risks` - Geopolitical risks

## Next Steps

1. **Supabase Project Setup** — Create production Supabase project and run schema/seed scripts
2. **Backend Deployment** — Deploy `backend-ts` to Railway or Render (see `docs/DEPLOYMENT.md`)
3. **Frontend Deployment** — Already configured for GitHub Pages; Vercel is another option
4. **CI/CD Pipeline** — Add GitHub Actions for automated testing and deployment
5. **Unit & Integration Tests** — Add test coverage for services and API routes
6. **Enhanced Visualizations** — Expand Recharts usage for historical trends and cycle indicators

## Troubleshooting

### "Supabase connection failed"
- Check `SUPABASE_URL` and keys in `.env`
- Verify project is not paused
- Check RLS policies allow access

### "Module not found"
- Run `npm install`
- Check Node.js version (18+)

### "Database error"
- Verify `schema.sql` ran successfully
- Check tables exist in Supabase dashboard
- Run `seed-data.sql` for demo data

## Resources

- [Full Week 1 Summary](docs/archive/WEEK_1_SUMMARY.md)
- [Supabase Setup Guide](docs/SUPABASE_SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Backend README](backend-ts/README.md)
- [Database README](database/README.md)
