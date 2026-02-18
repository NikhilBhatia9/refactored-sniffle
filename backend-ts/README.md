# Alpha Oracle 2.0 - TypeScript Backend

Node.js/TypeScript backend service for Alpha Oracle 2.0, using Supabase as the database and data layer.

## Features

- ✅ TypeScript for type safety
- ✅ Supabase integration for database
- ✅ Express.js API server
- ✅ Data ingestion from external APIs (Alpha Vantage, FRED)
- ✅ Recommendation engine
- ✅ Real-time data updates with cron jobs

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase project with schema set up

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# External APIs
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
FRED_API_KEY=your_fred_key

# Server Configuration
PORT=8000
NODE_ENV=development
```

### 3. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:8000`

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
backend-ts/
├── src/
│   ├── config/
│   │   └── supabase.ts       # Supabase client configuration
│   ├── services/
│   │   ├── dataIngestion.ts  # External API data fetching
│   │   └── recommendationEngine.ts  # Stock recommendation logic
│   ├── routes/
│   │   ├── recommendations.ts
│   │   ├── sectors.ts
│   │   └── health.ts
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── utils/
│   │   └── logger.ts         # Logging utilities
│   └── index.ts              # Main application entry point
├── package.json
├── tsconfig.json
└── .env
```

## API Endpoints

### Health Check
```
GET /health
```

### Recommendations
```
GET /api/recommendations
GET /api/recommendations/:ticker
```

### Sectors
```
GET /api/sectors
GET /api/sectors/:name
```

### Economic Indicators
```
GET /api/economic/indicators
```

## Development

### Type Checking

```bash
npm run type-check
```

### Watch Mode

```bash
npm run dev
```

This uses `tsx` and `nodemon` for fast reloading during development.

## Deployment

### Railway

1. Connect GitHub repository
2. Set environment variables
3. Deploy from main branch

### Render

1. Create new Web Service
2. Connect repository
3. Build command: `npm run build`
4. Start command: `npm start`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key | No (demo mode) |
| `FRED_API_KEY` | FRED API key | No (demo mode) |
| `PORT` | Server port | No (default: 8000) |
| `NODE_ENV` | Environment | No (default: development) |

## License

MIT
