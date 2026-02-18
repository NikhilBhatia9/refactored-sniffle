// Type definitions for Alpha Oracle 2.0

export interface Sector {
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
}

export interface Recommendation {
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
  sectors?: {
    name: string;
  };
}

export interface EconomicIndicator {
  id: string;
  indicator_name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  impact: string;
  data_date: string;
  created_at: string;
}

export interface MarketData {
  id: string;
  ticker: string;
  price: number;
  change_percent: number;
  volume: number;
  market_cap: number;
  pe_ratio: number;
  data_date: string;
  created_at: string;
}

export interface GeopoliticalRisk {
  id: string;
  event_name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affected_sectors: string[];
  description: string;
  impact_assessment: string;
  created_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
  created_at: string;
  updated_at: string;
}

export interface PortfolioPosition {
  id: string;
  portfolio_id: string;
  ticker: string;
  shares: number;
  avg_price: number;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// External API types
export interface AlphaVantageQuote {
  '01. symbol': string;
  '02. open': string;
  '03. high': string;
  '04. low': string;
  '05. price': string;
  '06. volume': string;
  '07. latest trading day': string;
  '08. previous close': string;
  '09. change': string;
  '10. change percent': string;
}

export interface FREDObservation {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: string;
}

// Filter types
export interface RecommendationFilters {
  strategy?: 'growth' | 'value' | 'defensive' | 'contrarian';
  minConviction?: number;
  sector?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface SectorFilters {
  minConviction?: number;
  trend?: 'improving' | 'stable' | 'declining';
}
