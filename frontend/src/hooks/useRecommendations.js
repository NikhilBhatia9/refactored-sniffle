// useRecommendations - fetch recommendations from Supabase with real-time updates
// Falls back to the TypeScript REST backend, then to local demo data

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getRecommendations as getRecommendationsAPI } from '../services/api';
import { demoRecommendations } from '../data/demoData';

/**
 * Hook to fetch recommendations.
 * When VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set, fetches directly
 * from Supabase with real-time subscriptions.
 * Otherwise falls back to the TypeScript REST backend.
 *
 * @param {Object} filters - { strategy, sector, minConviction, riskLevel }
 */
export function useRecommendations(filters = {}) {
  const [recommendations, setRecommendations] = useState([]);
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
  }, [filters.strategy, filters.sector, filters.minConviction, filters.riskLevel]);

  async function fetchFromSupabase() {
    try {
      setLoading(true);
      let query = supabase
        .from('recommendations')
        .select('*, sectors(name)')
        .order('conviction_score', { ascending: false });

      if (filters.strategy) query = query.eq('strategy', filters.strategy);
      if (filters.sector) query = query.eq('sectors.name', filters.sector);
      if (filters.minConviction) query = query.gte('conviction_score', filters.minConviction);
      if (filters.riskLevel) query = query.eq('risk_level', filters.riskLevel);

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setRecommendations(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToChanges() {
    const channel = supabase
      .channel('recommendations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'recommendations' },
        () => fetchFromSupabase()
      )
      .subscribe();
    return channel;
  }

  async function fetchFromAPI() {
    try {
      setLoading(true);
      const apiFilters = {};
      if (filters.strategy) apiFilters.strategy = filters.strategy;
      if (filters.sector) apiFilters.sector = filters.sector;
      if (filters.minConviction) apiFilters.min_conviction = filters.minConviction;
      if (filters.riskLevel) apiFilters.risk_level = filters.riskLevel;
      const response = await getRecommendationsAPI(apiFilters);
      setRecommendations(response.data?.data ?? response.data ?? []);
      setError(null);
    } catch (err) {
      loadDemoData();
    } finally {
      setLoading(false);
    }
  }

  function loadDemoData() {
    let data = [...demoRecommendations];
    if (filters.strategy) data = data.filter((r) => r.strategy === filters.strategy);
    if (filters.sector) data = data.filter((r) => r.sectors?.name === filters.sector);
    if (filters.minConviction) data = data.filter((r) => r.conviction_score >= filters.minConviction);
    if (filters.riskLevel) data = data.filter((r) => r.risk_level === filters.riskLevel);
    setRecommendations(data);
    setError(null);
  }

  return { recommendations, loading, error, refetch: isSupabaseConfigured ? fetchFromSupabase : fetchFromAPI };
}
