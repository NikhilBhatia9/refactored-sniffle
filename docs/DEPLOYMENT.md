# Deployment Guide - Alpha Oracle 2.0

This guide covers deploying the TypeScript backend to cloud hosting platforms.

## Prerequisites

- Supabase project set up with schema and data
- GitHub repository with backend code
- API keys for external services (Alpha Vantage, FRED)

## Option 1: Railway Deployment

Railway is recommended for its simplicity and excellent Node.js/TypeScript support.

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway to access your repositories

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `refactored-sniffle` repository
4. Railway will auto-detect the TypeScript backend

### Step 3: Configure Build Settings

1. Set **Root Directory**: `backend-ts`
2. Set **Build Command**: `npm install && npm run build`
3. Set **Start Command**: `npm start`

### Step 4: Add Environment Variables

In Railway project settings, add these variables:

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# External APIs (Optional)
ALPHA_VANTAGE_API_KEY=your_key
FRED_API_KEY=your_key

# Server
NODE_ENV=production
PORT=8000
```

### Step 5: Deploy

1. Click "Deploy"
2. Railway will build and deploy automatically
3. Get your deployment URL: `https://your-app.railway.app`

### Step 6: Verify Deployment

Test endpoints:
- Health: `https://your-app.railway.app/health`
- API: `https://your-app.railway.app/api/recommendations`

---

## Option 2: Render Deployment

Render offers a free tier and automatic deployments from GitHub.

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create New Web Service

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Select `refactored-sniffle`

### Step 3: Configure Service

- **Name**: `alpha-oracle-backend`
- **Root Directory**: `backend-ts`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: Free (or upgrade for production)

### Step 4: Add Environment Variables

Add the same variables as Railway (see above).

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will deploy automatically
3. Get your URL: `https://alpha-oracle-backend.onrender.com`

**Note**: Free tier sleeps after inactivity. First request may be slow.

---

## Option 3: Vercel Deployment

While Vercel is primarily for frontends, it can host serverless functions.

### Convert to Serverless Functions

Create `api/` directory with serverless functions:

```typescript
// api/recommendations.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { RecommendationEngine } from '../backend-ts/src/services/recommendationEngine';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const engine = new RecommendationEngine();
  const recommendations = await engine.getTopOpportunities();
  res.json({ data: recommendations });
}
```

### Deploy

```bash
npm install -g vercel
vercel
```

---

## Post-Deployment Setup

### 1. Test All Endpoints

```bash
# Health check
curl https://your-app.com/health

# Get recommendations
curl https://your-app.com/api/recommendations

# Get sectors
curl https://your-app.com/api/sectors
```

### 2. Update Frontend Configuration

In `frontend/.env`:

```bash
VITE_API_BASE_URL=https://your-app.com
```

### 3. Set Up Monitoring

#### Railway
- Built-in logs and metrics in dashboard
- Set up alerts for errors

#### Render
- Check logs in dashboard
- Enable health checks

### 4. Configure CORS

Ensure backend allows your frontend domain:

```typescript
// In backend-ts/src/index.ts
app.use(cors({
  origin: ['https://your-frontend.com', 'http://localhost:5173'],
  credentials: true
}));
```

### 5. Set Up Scheduled Jobs

Both Railway and Render support cron jobs. The backend includes built-in scheduling with `node-cron`.

To trigger manual updates:

```bash
# Add an endpoint in routes
POST /api/admin/update-data
```

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service key | Yes |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key | No (demo mode) |
| `FRED_API_KEY` | FRED API key | No (demo mode) |
| `NODE_ENV` | Environment (production/development) | No |
| `PORT` | Server port | No (auto-assigned) |

---

## Troubleshooting

### Build Fails

Check:
- All dependencies in `package.json`
- TypeScript compiles locally: `npm run build`
- Node version compatibility (18+)

### Runtime Errors

Check:
- Environment variables are set correctly
- Supabase connection works
- Database schema is set up
- Check deployment logs

### API Not Responding

Check:
- Service is running (not sleeping on free tier)
- CORS configured correctly
- Firewall/security settings

---

## Production Checklist

- [ ] All environment variables configured
- [ ] Database schema deployed to production Supabase
- [ ] Health endpoint responding
- [ ] All API endpoints tested
- [ ] CORS configured for production domain
- [ ] Logging enabled
- [ ] Monitoring set up
- [ ] Scheduled jobs working (if in live mode)
- [ ] Frontend updated with production API URL

---

## Resources

- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Node.js Deployment Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
