-- Alpha Oracle 2.0 - Database Schema
-- Supabase PostgreSQL Schema

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

-- Create indexes for performance
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
