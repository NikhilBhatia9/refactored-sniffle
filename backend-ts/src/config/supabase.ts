// Supabase client configuration

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase environment variables');
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) must be set');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Test connection
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('sectors').select('count');
    
    if (error) {
      logger.error('Supabase connection test failed', error);
      return false;
    }
    
    logger.info('Supabase connection successful');
    return true;
  } catch (error) {
    logger.error('Supabase connection error', error);
    return false;
  }
}

// Helper functions for common queries

export async function getSectors() {
  const { data, error } = await supabase
    .from('sectors')
    .select('*')
    .order('conviction_score', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getSectorByName(name: string) {
  const { data, error } = await supabase
    .from('sectors')
    .select('*')
    .eq('name', name)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getRecommendations(filters?: {
  strategy?: string;
  minConviction?: number;
  sector?: string;
}) {
  let query = supabase
    .from('recommendations')
    .select(`
      *,
      sectors (name)
    `)
    .order('conviction_score', { ascending: false });

  if (filters?.strategy) {
    query = query.eq('strategy', filters.strategy);
  }

  if (filters?.minConviction) {
    query = query.gte('conviction_score', filters.minConviction);
  }

  if (filters?.sector) {
    // First get the sector ID
    const sectorData = await getSectorByName(filters.sector);
    if (sectorData) {
      query = query.eq('sector_id', sectorData.id);
    }
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function getEconomicIndicators() {
  const { data, error } = await supabase
    .from('economic_indicators')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) throw error;
  return data;
}

export async function getMarketData(ticker?: string) {
  let query = supabase
    .from('market_data')
    .select('*')
    .order('data_date', { ascending: false });

  if (ticker) {
    query = query.eq('ticker', ticker);
  }

  query = query.limit(50);

  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function getGeopoliticalRisks() {
  const { data, error } = await supabase
    .from('geopolitical_risks')
    .select('*')
    .order('severity', { ascending: false });
  
  if (error) throw error;
  return data;
}
