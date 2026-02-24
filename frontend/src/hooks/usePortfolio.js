import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { demoPortfolioData } from '../data/demoData';

/**
 * Normalise a date string to ISO 8601 (YYYY-MM-DD).
 * Accepts DD/MM/YYYY (slash-separated) and passes through YYYY-MM-DD unchanged.
 */
function normaliseDate(dateStr) {
  if (!dateStr) return dateStr;
  // DD/MM/YYYY or D/M/YYYY
  const dmyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = dmyMatch[3];
    if (month < 1 || month > 12 || day < 1 || day > 31) return dateStr;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return dateStr;
}

/**
 * Parse a CSV string into an array of portfolio row objects.
 * Expected columns: Symbol, Current Price, Trade Date, Purchase Price, Quantity
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const symbolIdx = headers.findIndex((h) => /^symbol$/i.test(h));
  const priceIdx = headers.findIndex((h) => /^current\s*price$/i.test(h));
  const dateIdx = headers.findIndex((h) => /^trade\s*date$/i.test(h));
  const purchaseIdx = headers.findIndex((h) => /^purchase\s*price$/i.test(h));
  const qtyIdx = headers.findIndex((h) => /^quantity$/i.test(h));

  if (symbolIdx === -1 || priceIdx === -1 || dateIdx === -1 || purchaseIdx === -1 || qtyIdx === -1) {
    throw new Error('CSV must contain columns: Symbol, Current Price, Trade Date, Purchase Price, Quantity');
  }

  return lines.slice(1).filter(Boolean).map((line) => {
    const cols = line.split(',').map((c) => c.trim());
    return {
      symbol: cols[symbolIdx],
      current_price: parseFloat(cols[priceIdx]) || 0,
      trade_date: normaliseDate(cols[dateIdx]),
      purchase_price: parseFloat(cols[purchaseIdx]) || 0,
      quantity: parseFloat(cols[qtyIdx]) || 0,
    };
  });
}

/**
 * Convert an array of portfolio row objects to CSV string.
 */
function toCSV(rows) {
  const header = 'Symbol,Current Price,Trade Date,Purchase Price,Quantity';
  const body = rows.map((r) =>
    `${r.symbol},${r.current_price},${r.trade_date},${r.purchase_price},${r.quantity}`
  );
  return [header, ...body].join('\n');
}

const DEFAULT_DEMO_TRADE_DATE = '2024-01-15';

/**
 * Map demo holdings to the imported_portfolio row shape.
 */
function demoToRows(holdings) {
  return holdings.map((h) => ({
    symbol: h.ticker,
    current_price: h.current_price,
    trade_date: DEFAULT_DEMO_TRADE_DATE,
    purchase_price: h.cost_basis,
    quantity: h.shares,
  }));
}

export function usePortfolio() {
  const [importedRows, setImportedRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load from Supabase on mount (if configured)
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    supabase
      .from('imported_portfolio')
      .select('*')
      .order('symbol')
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message);
        } else if (data && data.length > 0) {
          setImportedRows(data);
        }
        setLoading(false);
      });
  }, []);

  // The rows that the rest of the page uses for display
  const portfolioRows = importedRows || demoToRows(demoPortfolioData.holdings);

  // Build enriched holdings for the existing Portfolio UI
  const holdings = portfolioRows.map((r) => {
    const marketValue = r.current_price * r.quantity;
    const costTotal = r.purchase_price * r.quantity;
    const gainLoss = marketValue - costTotal;
    const gainLossPct = costTotal > 0 ? (gainLoss / costTotal) * 100 : 0;
    return {
      ticker: r.symbol,
      name: r.symbol,
      sector: '',
      shares: r.quantity,
      cost_basis: r.purchase_price,
      current_price: r.current_price,
      market_value: marketValue,
      gain_loss: gainLoss,
      gain_loss_pct: gainLossPct,
      day_change_pct: 0,
      weight: 0,
      pe_ratio: null,
      dividend_yield: 0,
      trade_date: r.trade_date,
    };
  });

  // Recalculate weights
  const totalValue = holdings.reduce((s, h) => s + h.market_value, 0);
  holdings.forEach((h) => {
    h.weight = totalValue > 0 ? (h.market_value / totalValue) * 100 : 0;
  });

  /** Export current portfolio as CSV download */
  const exportCSV = useCallback(() => {
    const csv = toCSV(portfolioRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [portfolioRows]);

  /** Import CSV text – overrides existing portfolio */
  const importCSV = useCallback(async (csvText) => {
    setError(null);
    try {
      const rows = parseCSV(csvText);
      if (rows.length === 0) {
        throw new Error('No valid rows found in CSV');
      }

      // Persist to Supabase if available (delete old rows then insert new)
      if (isSupabaseConfigured) {
        setLoading(true);
        const { error: delErr } = await supabase
          .from('imported_portfolio')
          .delete()
          .gte('created_at', '1970-01-01');
        if (delErr) throw new Error(delErr.message);

        const { error: insErr } = await supabase
          .from('imported_portfolio')
          .insert(rows);
        if (insErr) throw new Error(insErr.message);
        setLoading(false);
      }

      setImportedRows(rows);
      return rows.length;
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  }, []);

  return {
    portfolioRows,
    holdings,
    totalValue,
    loading,
    error,
    importCSV,
    exportCSV,
    hasImported: importedRows !== null,
  };
}
