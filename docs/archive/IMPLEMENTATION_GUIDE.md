# Implementation Guide - Alpha Oracle 2.0

## Overview

This guide provides step-by-step instructions for implementing the rearchitected Alpha Oracle using Node.js/TypeScript and Supabase.

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js 18+ installed
- ✅ npm or pnpm package manager
- ✅ Git installed
- ✅ A Supabase account (free tier is fine)
- ✅ Code editor (VS Code recommended)

## Phase 1: Supabase Setup

### Step 1.1: Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create account
3. Click "New Project"
4. Fill in:
   - **Name**: alpha-oracle
   - **Database Password**: (generate secure password)
   - **Region**: (choose closest to your users)
   - **Pricing Plan**: Free

5. Wait for project to initialize (~2 minutes)

### Step 1.2: Database Schema Setup

Navigate to SQL Editor in Supabase dashboard and run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sectors table
CREATE TABLE sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  conviction_score DECIMAL(3,2) CHECK (conviction_score BETWEEN 0 AND 10),
  trend TEXT CHECK (trend IN ('improving', 'stable', 'declining')),
  cycle_phase TEXT,
  tailwinds JSONB DEFAULT '[]'::jsonb,
  headwinds JSONB DEFAULT '[]'::jsonb,
  thesis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock recommendations
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  sector_id UUID REFERENCES sectors(id),
  strategy TEXT CHECK (strategy IN ('growth', 'value', 'defensive', 'contrarian')),
  conviction_score DECIMAL(3,2) CHECK (conviction_score BETWEEN 0 AND 10),
  target_price DECIMAL(10,2),
  current_price DECIMAL(10,2),
  upside_percent DECIMAL(5,2),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  thesis TEXT,
  catalysts JSONB DEFAULT '[]'::jsonb,
  risks JSONB DEFAULT '[]'::jsonb,
  valuation_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Economic indicators
CREATE TABLE economic_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_name TEXT NOT NULL,
  value DECIMAL(12,4),
  unit TEXT,
  trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
  impact TEXT,
  data_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market data
CREATE TABLE market_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker TEXT NOT NULL,
  price DECIMAL(10,2),
  change_percent DECIMAL(5,2),
  volume BIGINT,
  market_cap BIGINT,
  pe_ratio DECIMAL(6,2),
  data_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ticker, data_date)
);

-- Geopolitical risks
CREATE TABLE geopolitical_risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  affected_sectors JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  impact_assessment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User portfolios (requires auth)
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio positions
CREATE TABLE portfolio_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  shares DECIMAL(12,4),
  avg_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_recommendations_sector ON recommendations(sector_id);
CREATE INDEX idx_recommendations_strategy ON recommendations(strategy);
CREATE INDEX idx_recommendations_ticker ON recommendations(ticker);
CREATE INDEX idx_market_data_ticker ON market_data(ticker);
CREATE INDEX idx_market_data_date ON market_data(data_date);
CREATE INDEX idx_portfolios_user ON portfolios(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_sectors_updated_at BEFORE UPDATE ON sectors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recommendations_updated_at BEFORE UPDATE ON recommendations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_positions_updated_at BEFORE UPDATE ON portfolio_positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 1.3: Row-Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_positions ENABLE ROW LEVEL SECURITY;

-- Portfolios: Users can only access their own
CREATE POLICY "Users can view own portfolios"
  ON portfolios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own portfolios"
  ON portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios"
  ON portfolios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios"
  ON portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- Portfolio positions: Through portfolio ownership
CREATE POLICY "Users can view own portfolio positions"
  ON portfolio_positions FOR SELECT
  USING (
    portfolio_id IN (
      SELECT id FROM portfolios WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own portfolio positions"
  ON portfolio_positions FOR ALL
  USING (
    portfolio_id IN (
      SELECT id FROM portfolios WHERE user_id = auth.uid()
    )
  );

-- Public read for market data, sectors, recommendations
CREATE POLICY "Public read for sectors"
  ON sectors FOR SELECT
  USING (true);

CREATE POLICY "Public read for recommendations"
  ON recommendations FOR SELECT
  USING (true);

CREATE POLICY "Public read for market_data"
  ON market_data FOR SELECT
  USING (true);

CREATE POLICY "Public read for economic_indicators"
  ON economic_indicators FOR SELECT
  USING (true);

CREATE POLICY "Public read for geopolitical_risks"
  ON geopolitical_risks FOR SELECT
  USING (true);
```

### Step 1.4: Seed Demo Data

```sql
-- Insert sectors
INSERT INTO sectors (name, conviction_score, trend, cycle_phase, tailwinds, headwinds, thesis)
VALUES
  ('Technology', 8.5, 'improving', 'Mid Expansion', 
   '["AI revolution", "Cloud adoption", "Digital transformation"]'::jsonb,
   '["Regulatory scrutiny", "High valuations"]'::jsonb,
   'Technology sector positioned for continued growth driven by AI adoption and cloud migration.'),
  
  ('Healthcare', 7.8, 'stable', 'Mid Expansion',
   '["Aging demographics", "Innovation in biotech", "Chronic disease treatment"]'::jsonb,
   '["Regulatory risks", "Drug pricing pressure"]'::jsonb,
   'Healthcare remains defensive with growth opportunities in biotech and medical devices.'),
  
  ('Financials', 7.2, 'improving', 'Mid Expansion',
   '["Higher interest rates", "Economic growth", "Deregulation"]'::jsonb,
   '["Credit risk", "Recession concerns"]'::jsonb,
   'Financials benefit from higher rates and economic expansion, but face credit cycle risks.');

-- Insert sample recommendations
INSERT INTO recommendations (
  ticker, company_name, sector_id, strategy, conviction_score, 
  target_price, current_price, upside_percent, risk_level, thesis,
  catalysts, risks, valuation_metrics
)
SELECT 
  'AAPL', 'Apple Inc.', id, 'growth', 8.7,
  210.00, 178.50, 17.6, 'medium',
  'Leading position in premium smartphone market with strong services growth and ecosystem lock-in.',
  '["New AI features in iOS", "Vision Pro adoption", "Services expansion"]'::jsonb,
  '["China revenue exposure", "Smartphone market maturity", "Regulatory risks"]'::jsonb,
  '{"pe": 28.5, "peg": 1.8, "roe": 147.0, "profit_margin": 25.3}'::jsonb
FROM sectors WHERE name = 'Technology';

INSERT INTO recommendations (
  ticker, company_name, sector_id, strategy, conviction_score,
  target_price, current_price, upside_percent, risk_level, thesis,
  catalysts, risks, valuation_metrics
)
SELECT
  'MSFT', 'Microsoft Corporation', id, 'growth', 8.5,
  480.00, 420.00, 14.3, 'medium',
  'Cloud computing leader with strong Azure growth and AI integration across product suite.',
  '["Azure growth acceleration", "AI Copilot adoption", "Gaming expansion"]'::jsonb,
  '["Cloud competition", "Regulatory scrutiny", "High valuation"]'::jsonb,
  '{"pe": 35.2, "peg": 2.1, "roe": 42.5, "profit_margin": 36.7}'::jsonb
FROM sectors WHERE name = 'Technology';

-- Insert economic indicators
INSERT INTO economic_indicators (indicator_name, value, unit, trend, impact, data_date)
VALUES
  ('GDP Growth Rate', 3.2, '%', 'up', 'positive', CURRENT_DATE),
  ('Unemployment Rate', 3.8, '%', 'down', 'positive', CURRENT_DATE),
  ('Inflation Rate (CPI)', 2.9, '%', 'down', 'positive', CURRENT_DATE),
  ('Federal Funds Rate', 5.25, '%', 'stable', 'neutral', CURRENT_DATE),
  ('10-Year Treasury Yield', 4.35, '%', 'up', 'neutral', CURRENT_DATE);

-- Insert market data
INSERT INTO market_data (ticker, price, change_percent, volume, market_cap, pe_ratio, data_date)
VALUES
  ('AAPL', 178.50, 1.2, 52000000, 2800000000000, 28.5, CURRENT_DATE),
  ('MSFT', 420.00, 0.8, 28000000, 3100000000000, 35.2, CURRENT_DATE),
  ('NVDA', 875.00, 3.5, 45000000, 2200000000000, 68.4, CURRENT_DATE);

-- Insert geopolitical risks
INSERT INTO geopolitical_risks (event_name, severity, affected_sectors, description, impact_assessment)
VALUES
  ('US-China Tech Tensions', 'high',
   '["Technology", "Materials"]'::jsonb,
   'Ongoing technology transfer restrictions and export controls',
   'Could limit growth for companies with significant China exposure'),
  
  ('Inflation Persistence', 'medium',
   '["All Sectors"]'::jsonb,
   'Core inflation remaining above Fed target',
   'May force additional rate hikes, pressuring valuations');
```

### Step 1.5: Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long JWT token)
   - **service_role key**: `eyJhbGc...` (for backend only)

3. Store in `.env` file (create in root directory):

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...  # Backend only, never expose to frontend!

# External APIs (optional)
ALPHA_VANTAGE_API_KEY=your_key_here
FRED_API_KEY=your_key_here
```

## Phase 2: Backend Service (Node.js/TypeScript)

### Step 2.1: Initialize Backend Project

```bash
# Create backend-v2 directory
mkdir backend-v2
cd backend-v2

# Initialize package.json
npm init -y

# Install dependencies
npm install --save \
  @supabase/supabase-js \
  dotenv \
  node-cron \
  axios

# Install TypeScript dependencies
npm install --save-dev \
  typescript \
  @types/node \
  @types/node-cron \
  tsx \
  nodemon

# Initialize TypeScript
npx tsc --init
```

### Step 2.2: TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 2.3: Project Structure

```bash
backend-v2/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Supabase client
│   ├── services/
│   │   ├── data-ingestion.ts    # Fetch external data
│   │   ├── recommendation.ts    # Generate recommendations
│   │   └── analysis.ts          # Analysis logic
│   ├── utils/
│   │   └── logger.ts            # Logging utility
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   └── index.ts                 # Main entry point
├── .env
├── package.json
└── tsconfig.json
```

### Step 2.4: Supabase Client Setup

Create `src/config/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for backend

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      sectors: {
        Row: {
          id: string;
          name: string;
          conviction_score: number;
          trend: 'improving' | 'stable' | 'declining';
          cycle_phase: string;
          tailwinds: string[];
          headwinds: string[];
          thesis: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sectors']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['sectors']['Insert']>;
      };
      recommendations: {
        Row: {
          id: string;
          ticker: string;
          company_name: string;
          sector_id: string;
          strategy: 'growth' | 'value' | 'defensive' | 'contrarian';
          conviction_score: number;
          target_price: number;
          current_price: number;
          upside_percent: number;
          risk_level: 'low' | 'medium' | 'high';
          thesis: string;
          catalysts: string[];
          risks: string[];
          valuation_metrics: Record<string, number>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['recommendations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['recommendations']['Insert']>;
      };
    };
  };
};
```

### Step 2.5: Data Ingestion Service

Create `src/services/data-ingestion.ts`:

```typescript
import axios from 'axios';
import { supabase } from '../config/supabase';
import dotenv from 'dotenv';

dotenv.config();

interface AlphaVantageQuote {
  '01. symbol': string;
  '05. price': string;
  '10. change percent': string;
}

export class DataIngestionService {
  private alphaVantageKey: string;
  private fredKey: string;

  constructor() {
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || '';
    this.fredKey = process.env.FRED_API_KEY || '';
  }

  /**
   * Fetch stock quote from Alpha Vantage
   */
  async fetchStockQuote(ticker: string): Promise<any> {
    if (!this.alphaVantageKey) {
      console.warn('Alpha Vantage API key not configured');
      return null;
    }

    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${this.alphaVantageKey}`;
      const response = await axios.get(url);
      
      const quote = response.data['Global Quote'];
      if (!quote) {
        console.error(`No quote data for ${ticker}`);
        return null;
      }

      return {
        ticker: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change_percent: parseFloat(quote['10. change percent'].replace('%', '')),
        data_date: new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      console.error(`Error fetching quote for ${ticker}:`, error);
      return null;
    }
  }

  /**
   * Update market data in Supabase
   */
  async updateMarketData(tickers: string[]): Promise<void> {
    console.log(`Updating market data for ${tickers.length} tickers...`);

    for (const ticker of tickers) {
      const quoteData = await this.fetchStockQuote(ticker);
      
      if (quoteData) {
        const { error } = await supabase
          .from('market_data')
          .upsert(quoteData, {
            onConflict: 'ticker,data_date'
          });

        if (error) {
          console.error(`Error updating market data for ${ticker}:`, error);
        } else {
          console.log(`✓ Updated ${ticker}: $${quoteData.price}`);
        }
      }

      // Respect API rate limits
      await this.sleep(12000); // Alpha Vantage: 5 calls/minute on free tier
    }

    console.log('Market data update complete');
  }

  /**
   * Fetch economic indicator from FRED
   */
  async fetchEconomicIndicator(seriesId: string, indicatorName: string): Promise<any> {
    if (!this.fredKey) {
      console.warn('FRED API key not configured');
      return null;
    }

    try {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${this.fredKey}&file_type=json&sort_order=desc&limit=1`;
      const response = await axios.get(url);
      
      const observation = response.data.observations[0];
      if (!observation) {
        console.error(`No data for ${seriesId}`);
        return null;
      }

      return {
        indicator_name: indicatorName,
        value: parseFloat(observation.value),
        data_date: observation.date
      };
    } catch (error) {
      console.error(`Error fetching ${seriesId}:`, error);
      return null;
    }
  }

  /**
   * Update economic indicators in Supabase
   */
  async updateEconomicIndicators(): Promise<void> {
    console.log('Updating economic indicators...');

    const indicators = [
      { seriesId: 'GDP', name: 'GDP Growth Rate' },
      { seriesId: 'UNRATE', name: 'Unemployment Rate' },
      { seriesId: 'CPIAUCSL', name: 'CPI (Inflation)' },
      { seriesId: 'DFF', name: 'Federal Funds Rate' },
    ];

    for (const { seriesId, name } of indicators) {
      const data = await this.fetchEconomicIndicator(seriesId, name);
      
      if (data) {
        const { error } = await supabase
          .from('economic_indicators')
          .insert(data);

        if (error) {
          console.error(`Error updating ${name}:`, error);
        } else {
          console.log(`✓ Updated ${name}: ${data.value}`);
        }
      }

      await this.sleep(1000); // Be nice to FRED API
    }

    console.log('Economic indicators update complete');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Step 2.6: Main Entry Point

Create `src/index.ts`:

```typescript
import cron from 'node-cron';
import { DataIngestionService } from './services/data-ingestion';

console.log('🚀 Alpha Oracle Backend Service Starting...');

const ingestionService = new DataIngestionService();

// Run immediately on startup
async function runInitialUpdate() {
  console.log('Running initial data update...');
  
  const topTickers = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN'];
  await ingestionService.updateMarketData(topTickers);
  await ingestionService.updateEconomicIndicators();
  
  console.log('Initial update complete ✓');
}

// Schedule daily updates at 6 AM
cron.schedule('0 6 * * *', async () => {
  console.log('Running scheduled data update...');
  const topTickers = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN'];
  await ingestionService.updateMarketData(topTickers);
  await ingestionService.updateEconomicIndicators();
});

// Start
runInitialUpdate().catch(console.error);

console.log('✓ Backend service running');
console.log('✓ Daily updates scheduled for 6:00 AM');
```

### Step 2.7: Package Scripts

Update `package.json`:

```json
{
  "name": "alpha-oracle-backend",
  "version": "2.0.0",
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## Phase 3: Frontend Integration

### Step 3.1: Install Supabase Client

```bash
cd frontend
npm install @supabase/supabase-js
```

### Step 3.2: Create Supabase Client

Create `frontend/src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 3.3: Update Environment Variables

Create `frontend/.env`:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 3.4: Create Data Hooks

Create `frontend/src/hooks/useRecommendations.js`:

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRecommendations(filters = {}) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();

    // Set up real-time subscription
    const subscription = supabase
      .channel('recommendations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recommendations'
        },
        () => {
          console.log('Recommendations updated, refetching...');
          fetchRecommendations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [filters]);

  async function fetchRecommendations() {
    try {
      setLoading(true);
      
      let query = supabase
        .from('recommendations')
        .select(`
          *,
          sectors (name)
        `)
        .order('conviction_score', { ascending: false });

      // Apply filters
      if (filters.strategy) {
        query = query.eq('strategy', filters.strategy);
      }
      if (filters.minConviction) {
        query = query.gte('conviction_score', filters.minConviction);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setRecommendations(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { recommendations, loading, error, refetch: fetchRecommendations };
}
```

### Step 3.5: Update Components

Update `frontend/src/pages/Dashboard.jsx`:

```javascript
import { useRecommendations } from '../hooks/useRecommendations';
import RecommendationCard from '../components/RecommendationCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function Dashboard() {
  const { recommendations, loading, error } = useRecommendations({
    minConviction: 8.0
  });

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Top Recommendations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(rec => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>
    </div>
  );
}
```

## Phase 4: Enhanced UX/UI

### Step 4.1: Install shadcn/ui

```bash
cd frontend

# Initialize shadcn/ui
npx shadcn-ui@latest init

# When prompted:
# - TypeScript: No (or Yes if you want to migrate to TS)
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add skeleton
```

### Step 4.2: Install Animation Library

```bash
npm install framer-motion
```

### Step 4.3: Create Animated Components

Create `frontend/src/components/AnimatedCard.jsx`:

```javascript
import { motion } from 'framer-motion';
import { Card } from './ui/card';

export function AnimatedCard({ children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <Card {...props}>
        {children}
      </Card>
    </motion.div>
  );
}
```

## Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts to link project
```

### Backend (Railway)

1. Go to https://railway.app
2. Create new project
3. Connect GitHub repo
4. Select `backend-v2` directory
5. Add environment variables
6. Deploy

## Testing

### Backend Tests

```bash
cd backend-v2
npm install --save-dev jest @types/jest ts-jest
npx ts-jest config:init
npm test
```

### Frontend Tests

```bash
cd frontend
npm install --save-dev vitest @testing-library/react
npm test
```

## Monitoring

### Supabase Dashboard
- Monitor database performance
- View API logs
- Check real-time connections

### Logging
Add structured logging with Winston or Pino

## Next Steps

1. ✅ Complete Phase 1: Supabase setup
2. ✅ Complete Phase 2: Backend service
3. ✅ Complete Phase 3: Frontend integration
4. ✅ Complete Phase 4: UX/UI enhancements
5. ⏭️ Add authentication flows
6. ⏭️ Implement user portfolios
7. ⏭️ Add advanced analytics
8. ⏭️ Performance optimization
9. ⏭️ Security audit
10. ⏭️ Production deployment

## Troubleshooting

**Supabase Connection Issues**
- Verify SUPABASE_URL and keys in .env
- Check project is not paused (free tier)
- Verify RLS policies allow access

**Build Errors**
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node --version` (should be 18+)

**Real-time Not Working**
- Verify Supabase Realtime is enabled in dashboard
- Check subscription setup in useEffect
- Enable Replication for tables in Supabase

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Status**: Ready for Implementation
**Last Updated**: 2024
