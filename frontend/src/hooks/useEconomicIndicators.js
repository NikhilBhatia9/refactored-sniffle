// useEconomicIndicators - fetch economic indicators from Supabase with real-time updates
// Falls back to the TypeScript REST backend, then to local demo data

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getMacro } from '../services/api';
import { demoIndicators } from '../data/demoData';

/**
 * Hook to fetch economic indicators.
 * When Supabase is configured, fetches directly with real-time subscriptions.
 * Otherwise falls back to the TypeScript REST backend.
 */
export function useEconomicIndicators() {
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchFromSupabase();
      const subscription = subscribeToChanges();
      return () => {
        supabase.removeChannel(subscription);
      };
    } else {
      fetchFromAPI();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchFromSupabase() {
    try {
      setLoading(true);
      // Fetch latest entry per indicator name
      const { data, error: fetchError } = await supabase
        .from('economic_indicators')
        .select('*')
        .order('data_date', { ascending: false });
      if (fetchError) throw fetchError;

      // Deduplicate: keep only the most recent entry per indicator_name
      const seen = new Set();
      const latest = (data || []).filter((item) => {
        if (seen.has(item.indicator_name)) return false;
        seen.add(item.indicator_name);
        return true;
      });
      setIndicators(latest);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToChanges() {
    const channel = supabase
      .channel('economic-indicators-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'economic_indicators' },
        () => fetchFromSupabase()
      )
      .subscribe();
    return channel;
  }

  async function fetchFromAPI() {
    try {
      setLoading(true);
      const response = await getMacro();
      const macroData = response.data?.data ?? response.data;
      setIndicators(macroData?.indicators ?? []);
      setError(null);
    } catch (err) {
      setIndicators([...demoIndicators]);
      setError(null);
    } finally {
      setLoading(false);
    }
  }

  return { indicators, loading, error, refetch: isSupabaseConfigured ? fetchFromSupabase : fetchFromAPI };
}
