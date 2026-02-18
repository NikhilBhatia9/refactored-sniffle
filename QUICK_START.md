# Quick Start Guide - Week 1 Implementation

## What Was Implemented

✅ **Complete Database Layer**
- PostgreSQL schema with 7 tables
- Row-Level Security policies
- Demo seed data

✅ **TypeScript Backend**
- Express.js REST API
- Supabase integration
- Data ingestion services
- Recommendation engine

✅ **Comprehensive Documentation**
- Setup guides
- Deployment guides
- API documentation

## Quick Start

### 1. Set Up Supabase

Follow `docs/SUPABASE_SETUP.md`:

```bash
# 1. Create Supabase project at https://supabase.com
# 2. Run database/schema.sql in SQL Editor
# 3. Run database/rls-policies.sql
# 4. Run database/seed-data.sql (optional)
# 5. Copy API keys from Settings > API
```

### 2. Configure Backend

```bash
cd backend-ts
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
```

Add to `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### 3. Run Backend

```bash
npm run dev
```

Server starts on `http://localhost:8000`

### 4. Test API

```bash
# Health check
curl http://localhost:8000/health

# Get recommendations
curl http://localhost:8000/api/recommendations

# Get top picks
curl http://localhost:8000/api/recommendations/top

# Get sectors
curl http://localhost:8000/api/sectors
```

## Project Structure

```
refactored-sniffle/
├── database/           # Database schema and seed data
│   ├── schema.sql
│   ├── rls-policies.sql
│   ├── seed-data.sql
│   └── README.md
├── backend-ts/         # TypeScript backend
│   ├── src/
│   │   ├── config/     # Supabase configuration
│   │   ├── services/   # Business logic
│   │   ├── routes/     # API endpoints
│   │   ├── types/      # TypeScript types
│   │   └── utils/      # Utilities
│   ├── package.json
│   └── tsconfig.json
└── docs/              # Documentation
    ├── SUPABASE_SETUP.md
    ├── DEPLOYMENT.md
    └── WEEK_1_SUMMARY.md
```

## API Endpoints

### Health
- `GET /health` - Health check

### Recommendations
- `GET /api/recommendations` - Get all recommendations
  - Query params: `strategy`, `sector`, `min_conviction`, `risk_level`, `limit`
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

## Development

### Run in Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Type Check
```bash
npm run type-check
```

## Deployment

See `docs/DEPLOYMENT.md` for:
- Railway deployment
- Render deployment
- Vercel serverless functions

## Next Steps (Week 2)

1. Install Supabase client in frontend
2. Create React hooks for data fetching
3. Add real-time subscriptions
4. Migrate components to use new API
5. Install shadcn/ui components
6. Add animations

## Troubleshooting

### "Supabase connection failed"
- Check SUPABASE_URL and keys in .env
- Verify project is not paused
- Check RLS policies allow access

### "Module not found"
- Run `npm install`
- Check Node.js version (18+)

### "Database error"
- Verify schema.sql ran successfully
- Check tables exist in Supabase dashboard
- Run seed-data.sql for demo data

## Resources

- [Full Week 1 Summary](docs/WEEK_1_SUMMARY.md)
- [Supabase Setup Guide](docs/SUPABASE_SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Backend README](backend-ts/README.md)
- [Database README](database/README.md)

## Support

For issues or questions:
1. Check documentation in `docs/`
2. Review implementation plan in `IMPLEMENTATION_ISSUES.md`
3. See original guides in `IMPLEMENTATION_GUIDE.md`

---

**Status**: Week 1 Complete ✅  
**Lines of Code**: ~2,400  
**Files Created**: 26  
**Issues Completed**: 10/10
