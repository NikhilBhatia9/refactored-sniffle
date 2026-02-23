// useMarketData - fetch market data from Supabase
// Falls back to the TypeScript REST backend when Supabase is not configured

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Hook to fetch latest market data for a list of tickers.
 * When Supabase is configured, fetches directly.
 * Tickers param is optional; when omitted fetches all available entries.
 *
 * @param {string[]} tickers - optional list of ticker symbols to filter
 */
export function useMarketData(tickers = []) {
  const [marketData, setMarketData] = useState([]);
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
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickers.join(',')]);

  async function fetchFromSupabase() {
    try {
      setLoading(true);
      let query = supabase
        .from('market_data')
        .select('*')
        .order('data_date', { ascending: false });

      if (tickers.length > 0) {
        query = query.in('ticker', tickers);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      // Deduplicate: keep only the most recent entry per ticker
      const seen = new Set();
      const latest = (data || []).filter((item) => {
        if (seen.has(item.ticker)) return false;
        seen.add(item.ticker);
        return true;
      });
      setMarketData(latest);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToChanges() {
    const channel = supabase
      .channel('market-data-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'market_data' },
        () => fetchFromSupabase()
      )
      .subscribe();
    return channel;
  }

  return { marketData, loading, error, refetch: fetchFromSupabase };
}
