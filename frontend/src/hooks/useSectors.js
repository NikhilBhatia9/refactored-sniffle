// useSectors - fetch sectors from Supabase with real-time updates
// Falls back to the TypeScript REST backend when Supabase is not configured

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getSectors as getSectorsAPI } from '../services/api';

/**
 * Hook to fetch sectors.
 * When Supabase is configured, fetches directly with real-time subscriptions.
 * Otherwise falls back to the TypeScript REST backend.
 */
export function useSectors() {
  const [sectors, setSectors] = useState([]);
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
      const { data, error: fetchError } = await supabase
        .from('sectors')
        .select('*')
        .order('conviction_score', { ascending: false });
      if (fetchError) throw fetchError;
      setSectors(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToChanges() {
    const channel = supabase
      .channel('sectors-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sectors' },
        () => fetchFromSupabase()
      )
      .subscribe();
    return channel;
  }

  async function fetchFromAPI() {
    try {
      setLoading(true);
      const response = await getSectorsAPI();
      setSectors(response.data?.data ?? response.data ?? []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        setError('backend_unavailable');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return { sectors, loading, error, refetch: isSupabaseConfigured ? fetchFromSupabase : fetchFromAPI };
}
