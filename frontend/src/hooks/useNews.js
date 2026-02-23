// useNews - provides market news data
// Currently uses demo data; can be extended to fetch from an API or Supabase.

import { useState, useEffect } from 'react';
import { demoNews } from '../data/demoData';

const NEWS_CATEGORIES = [
  'All',
  'Economic',
  'Geopolitical',
  'Political',
  'Stock Market',
  'Trends',
  'Commodities',
];

export function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNews();
  }, []);

  function loadNews() {
    try {
      setLoading(true);
      setNews([...demoNews]);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { news, loading, error, categories: NEWS_CATEGORIES, refetch: loadNews };
}
