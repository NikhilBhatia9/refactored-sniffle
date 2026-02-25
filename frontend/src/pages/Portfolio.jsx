import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { demoPortfolioData } from '../data/demoData';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMarketData } from '../hooks/useMarketData';

// ─── helpers ────────────────────────────────────────────────────────────────
const fmt = (n, decimals = 2) =>
  n == null ? '—' : n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const fmtUSD = (n) =>
  n == null ? '—' : '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const sign = (n) => (n >= 0 ? '+' : '');

const gainColor = (n) => (n >= 0 ? 'text-accent-green' : 'text-accent-red');

const priorityConfig = {
  high:   { dot: 'bg-accent-red',    label: 'High',   badge: 'badge-red' },
  medium: { dot: 'bg-accent-yellow', label: 'Med',    badge: 'badge-yellow' },
  low:    { dot: 'bg-accent-blue',   label: 'Low',    badge: 'badge-blue' },
};

// ─── sector lookup (common US equities) ──────────────────────────────────────
const SECTOR_LOOKUP = {
  AAPL:'Technology',MSFT:'Technology',NVDA:'Technology',GOOGL:'Technology',GOOG:'Technology',
  META:'Technology',AVGO:'Technology',ADBE:'Technology',CRM:'Technology',CSCO:'Technology',
  INTC:'Technology',AMD:'Technology',ORCL:'Technology',TXN:'Technology',QCOM:'Technology',
  IBM:'Technology',NOW:'Technology',AMAT:'Technology',MU:'Technology',INTU:'Technology',
  AMZN:'Consumer Disc.',TSLA:'Consumer Disc.',HD:'Consumer Disc.',NKE:'Consumer Disc.',
  MCD:'Consumer Disc.',SBUX:'Consumer Disc.',LOW:'Consumer Disc.',TGT:'Consumer Disc.',
  BKNG:'Consumer Disc.',CMG:'Consumer Disc.',
  UNH:'Healthcare',JNJ:'Healthcare',LLY:'Healthcare',PFE:'Healthcare',ABT:'Healthcare',
  TMO:'Healthcare',MRK:'Healthcare',ABBV:'Healthcare',BMY:'Healthcare',MDT:'Healthcare',
  AMGN:'Healthcare',GILD:'Healthcare',ISRG:'Healthcare',
  JPM:'Financials',V:'Financials',MA:'Financials',BAC:'Financials',GS:'Financials',
  MS:'Financials',BRK:'Financials','BRK.B':'Financials','BRK.A':'Financials',
  AXP:'Financials',C:'Financials',WFC:'Financials',SCHW:'Financials',BLK:'Financials',
  XOM:'Energy',CVX:'Energy',COP:'Energy',SLB:'Energy',EOG:'Energy',PSX:'Energy',
  VLO:'Energy',MPC:'Energy',OXY:'Energy',
  COST:'Consumer Staples',WMT:'Consumer Staples',PG:'Consumer Staples',KO:'Consumer Staples',
  PEP:'Consumer Staples',PM:'Consumer Staples',CL:'Consumer Staples',MDLZ:'Consumer Staples',
  NEE:'Utilities',DUK:'Utilities',SO:'Utilities',D:'Utilities',AEP:'Utilities',
  PLD:'Real Estate',AMT:'Real Estate',EQIX:'Real Estate',PSA:'Real Estate',O:'Real Estate',
  SPY:'ETF',QQQ:'ETF',IWM:'ETF',DIA:'ETF',VOO:'ETF',VTI:'ETF',VIG:'ETF',
  VYM:'ETF',ARKK:'ETF',XLK:'ETF',XLF:'ETF',XLE:'ETF',XLV:'ETF',
  LMT:'Industrials',RTX:'Industrials',UPS:'Industrials',CAT:'Industrials',HON:'Industrials',
  GE:'Industrials',DE:'Industrials',BA:'Industrials',UNP:'Industrials',MMM:'Industrials',
  LIN:'Materials',APD:'Materials',NEM:'Materials',FCX:'Materials',DOW:'Materials',
  T:'Communication',VZ:'Communication',DIS:'Communication',NFLX:'Communication',CMCSA:'Communication',
  TMUS:'Communication',CHTR:'Communication',
};

const SECTOR_COLORS = {
  'Technology': '#3b82f6',
  'Consumer Disc.': '#10b981',
  'Healthcare': '#f59e0b',
  'Financials': '#8b5cf6',
  'Energy': '#f97316',
  'Consumer Staples': '#06b6d4',
  'ETF': '#ec4899',
  'Industrials': '#64748b',
  'Utilities': '#a3e635',
  'Real Estate': '#f43f5e',
  'Communication': '#e879f9',
  'Materials': '#fb923c',
  'Other': '#6b7280',
};

/** Build sector allocation from actual holdings */
function buildSectorAllocation(holdings, totalValue) {
  const sectors = {};
  holdings.forEach((h) => {
    const sec = SECTOR_LOOKUP[h.ticker] || 'Other';
    if (!sectors[sec]) sectors[sec] = { sector: sec, value: 0 };
    sectors[sec].value += h.market_value;
  });
  const arr = Object.values(sectors)
    .map((s) => ({
      ...s,
      pct: totalValue > 0 ? (s.value / totalValue) * 100 : 0,
      target: 0,   // no target for imported portfolios
      color: SECTOR_COLORS[s.sector] || SECTOR_COLORS.Other,
    }))
    .sort((a, b) => b.pct - a.pct);
  return arr;
}

/** Compute simple quality scores from holdings */
function buildQualityScores(holdings, totalGainPct) {
  const n = holdings.length;
  // Diversification: more positions = better, cap at 100
  const diversification = Math.min(100, Math.round(n * 5));
  // Momentum: based on average gain%
  const avgGain = n > 0 ? holdings.reduce((s, h) => s + h.gain_loss_pct, 0) / n : 0;
  const momentum = Math.min(100, Math.max(0, Math.round(50 + avgGain)));
  // Risk-adjusted return: higher overall gain with more diversified portfolio
  const riskAdj = Math.min(100, Math.max(0, Math.round(40 + totalGainPct * 0.5 + n * 2)));
  // Value: inverse of avg gain (high gain = potentially overvalued)
  const value = Math.min(100, Math.max(0, Math.round(70 - avgGain * 0.3)));
  // Dividend: placeholder – CSV has no dividend info
  const dividendIncome = 30;
  const overall = Math.round((diversification + momentum + riskAdj + value + dividendIncome) / 5);
  return { overall, diversification, risk_adjusted_return: riskAdj, momentum, value, dividend_income: dividendIncome };
}

/** Generate portfolio insights from actual holdings */
function generateInsights(holdings, totalValue) {
  const ins = [];
  // Concentration: any single stock > 10%
  holdings.filter((h) => h.weight > 10).forEach((h) => {
    ins.push({
      type: 'warning',
      title: `${h.ticker} Position Oversized (${h.weight.toFixed(1)}%)`,
      description: `${h.ticker} represents ${h.weight.toFixed(1)}% of your portfolio, exceeding the recommended 10% single-stock limit.`,
      action: `Consider trimming ${h.ticker} to reduce concentration risk`,
      priority: h.weight > 20 ? 'high' : 'medium',
    });
  });
  // Big losers (< -10%)
  holdings.filter((h) => h.gain_loss_pct < -10).forEach((h) => {
    ins.push({
      type: 'danger',
      title: `${h.ticker} Down ${Math.abs(h.gain_loss_pct).toFixed(1)}%`,
      description: `${h.ticker} is down ${Math.abs(h.gain_loss_pct).toFixed(1)}% from your purchase price. Review whether your original investment thesis still holds.`,
      action: `Review ${h.ticker} — consider reducing if fundamentals have deteriorated`,
      priority: h.gain_loss_pct < -25 ? 'high' : 'medium',
    });
  });
  // Big winners (>50%) — take-profit opportunity
  holdings.filter((h) => h.gain_loss_pct > 50).forEach((h) => {
    ins.push({
      type: 'opportunity',
      title: `${h.ticker} Up ${h.gain_loss_pct.toFixed(1)}% — Lock In Gains`,
      description: `${h.ticker} has gained ${h.gain_loss_pct.toFixed(1)}% since purchase. Partial profit-taking could reduce risk.`,
      action: `Consider trimming ${h.ticker} to lock in gains and rebalance`,
      priority: 'medium',
    });
  });
  // Low diversification
  if (holdings.length < 5) {
    ins.push({
      type: 'warning',
      title: 'Low Diversification',
      description: `Your portfolio has only ${holdings.length} position${holdings.length === 1 ? '' : 's'}. A well-diversified portfolio typically holds 10–20+ positions across sectors.`,
      action: 'Consider adding positions in underrepresented sectors',
      priority: 'high',
    });
  }
  // Sector concentration
  const sectorMap = {};
  holdings.forEach((h) => {
    const sec = SECTOR_LOOKUP[h.ticker] || 'Other';
    sectorMap[sec] = (sectorMap[sec] || 0) + h.weight;
  });
  Object.entries(sectorMap).forEach(([sec, wt]) => {
    if (wt > 40 && sec !== 'ETF' && sec !== 'Other') {
      ins.push({
        type: 'warning',
        title: `${sec} Sector Overweight (${wt.toFixed(0)}%)`,
        description: `${sec} represents ${wt.toFixed(1)}% of your portfolio. High sector concentration increases risk if the sector underperforms.`,
        action: `Consider reducing ${sec} exposure and diversifying into other sectors`,
        priority: 'high',
      });
    }
  });
  // Win rate
  const winners = holdings.filter((h) => h.gain_loss > 0).length;
  const winRate = holdings.length > 0 ? (winners / holdings.length) * 100 : 0;
  if (winRate < 50) {
    ins.push({
      type: 'info',
      title: `Win Rate ${winRate.toFixed(0)}%`,
      description: `Only ${winners} of ${holdings.length} positions are profitable. Review underperformers to decide whether to hold or cut losses.`,
      action: 'Review each losing position and reassess your investment thesis',
      priority: winRate < 30 ? 'high' : 'medium',
    });
  }
  // Fallback
  if (ins.length === 0) {
    ins.push({
      type: 'info',
      title: 'Portfolio Looking Good',
      description: 'No significant issues detected. Keep monitoring your positions regularly.',
      action: 'Continue to review quarterly and rebalance as needed',
      priority: 'low',
    });
  }
  return ins;
}

/** Build performance history from actual imported holdings based on their trade dates.
 *  Generates monthly data points showing portfolio value growth and an S&P 500 benchmark. */
function buildPerformanceHistory(holdings, totalCost, totalValue) {
  if (!holdings || holdings.length === 0) {
    return [{ date: 'Now', value: 0, benchmark: 0 }];
  }

  // Determine the date range based on earliest trade date
  const now = new Date();
  const tradeDates = holdings
    .map((h) => h.trade_date ? new Date(h.trade_date) : null)
    .filter(Boolean);
  const earliest = tradeDates.length > 0
    ? new Date(Math.min(...tradeDates))
    : new Date(now.getFullYear(), now.getMonth() - 11, 1); // default 1 year ago

  // Generate monthly data points from earliest trade date to now
  const months = [];
  const cursor = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  while (cursor <= now) {
    months.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  // Ensure at least current month
  if (months.length === 0) months.push(new Date(now.getFullYear(), now.getMonth(), 1));

  const totalMonths = months.length;
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // S&P 500 approximate annual return for benchmark (~10% annually)
  const spAnnualReturn = 0.10;
  const spMonthlyReturn = Math.pow(1 + spAnnualReturn, 1 / 12) - 1;

  const history = months.map((month, idx) => {
    // For each month, compute the portfolio value as a fraction of the journey
    // from total cost to total value, only including holdings added by that date
    let monthValue = 0;
    let monthCost = 0;
    holdings.forEach((h) => {
      const tradeDate = h.trade_date ? new Date(h.trade_date) : earliest;
      if (tradeDate <= month) {
        // This holding was in the portfolio at this point
        const holdingCost = h.cost_basis * h.shares;
        const holdingCurrent = h.market_value;
        // Fraction of time elapsed for this holding
        const holdingTotalMonths = Math.max(1, (now - tradeDate) / (1000 * 60 * 60 * 24 * 30.44));
        const holdingElapsed = Math.max(0, (month - tradeDate) / (1000 * 60 * 60 * 24 * 30.44));
        const frac = Math.min(1, holdingElapsed / holdingTotalMonths);
        monthValue += holdingCost + (holdingCurrent - holdingCost) * frac;
        monthCost += holdingCost;
      }
    });

    // Benchmark: grows from the same cost basis at S&P rate
    const benchValue = monthCost > 0
      ? monthCost * Math.pow(1 + spMonthlyReturn, idx)
      : 0;

    const yr = String(month.getFullYear()).slice(2);
    return {
      date: `${monthLabels[month.getMonth()]} ${yr}`,
      value: Math.round(monthValue),
      benchmark: Math.round(benchValue),
    };
  });

  return history;
}
function buildRebalanceSuggestions(holdings) {
  const trim = holdings.filter((h) => h.weight > 8).map((h) => h.ticker).slice(0, 3);
  const hold = holdings.filter((h) => h.weight >= 3 && h.weight <= 8 && h.gain_loss_pct >= 0).map((h) => h.ticker).slice(0, 3);
  const add = holdings.filter((h) => h.weight < 3 && h.gain_loss_pct >= 0).map((h) => h.ticker).slice(0, 3);
  const suggestions = [];
  if (trim.length) suggestions.push({ action: 'TRIM', tickers: trim.join(', '), reason: 'Oversized positions — consider reducing to limit concentration risk', color: 'border-accent-red/40 bg-accent-red/5 text-accent-red' });
  if (hold.length) suggestions.push({ action: 'HOLD', tickers: hold.join(', '), reason: 'Well-positioned — within reasonable allocation', color: 'border-accent-green/40 bg-accent-green/5 text-accent-green' });
  if (add.length) suggestions.push({ action: 'ADD', tickers: add.join(', '), reason: 'Small positions with positive returns — consider increasing', color: 'border-accent-blue/40 bg-accent-blue/5 text-accent-blue' });
  if (suggestions.length === 0) suggestions.push({ action: 'HOLD', tickers: 'All positions', reason: 'Portfolio looks balanced — no immediate rebalancing needed', color: 'border-accent-green/40 bg-accent-green/5 text-accent-green' });
  return suggestions;
}

const insightConfig = {
  warning:     { icon: '⚠️', border: 'border-accent-yellow/40', bg: 'bg-accent-yellow/5', titleColor: 'text-accent-yellow' },
  opportunity: { icon: '🚀', border: 'border-accent-green/40',  bg: 'bg-accent-green/5',  titleColor: 'text-accent-green' },
  info:        { icon: 'ℹ️', border: 'border-accent-blue/40',   bg: 'bg-accent-blue/5',   titleColor: 'text-accent-blue' },
  danger:      { icon: '🔴', border: 'border-accent-red/40',    bg: 'bg-accent-red/5',    titleColor: 'text-accent-red' },
};

// ─── sub-components ──────────────────────────────────────────────────────────

const SummaryCard = ({ label, value, sub, valueClass = 'text-text-primary', icon }) => (
  <motion.div
    className="card flex flex-col gap-1"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between mb-1">
      <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">{label}</span>
      {icon && <span className="text-lg">{icon}</span>}
    </div>
    <div className={`text-2xl font-black ${valueClass}`}>{value}</div>
    {sub && <div className="text-xs text-text-muted">{sub}</div>}
  </motion.div>
);

const ScoreBar = ({ label, score, color = '#3b82f6' }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <span className="text-text-secondary text-sm">{label}</span>
      <span className="text-text-primary font-bold text-sm">{score}/100</span>
    </div>
    <div className="h-2 bg-primary-border rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  </div>
);

const PERF_PERIODS = [
  { id: '1M', label: '1M', months: 1 },
  { id: '6M', label: '6M', months: 6 },
  { id: 'YTD', label: 'YTD', months: null },
  { id: '1Y', label: '1Y', months: 12 },
  { id: '3Y', label: '3Y', months: 36 },
  { id: '5Y', label: '5Y', months: 60 },
];

/** Filter performance history data based on selected period */
function filterByPeriod(data, periodId) {
  if (!data || data.length === 0) return data;
  const n = data.length;
  if (periodId === 'YTD') {
    // Keep data from Jan of current year onward
    const ytdIdx = data.findIndex((d) => d.date.startsWith('Jan 2') || d.date.startsWith('Jan '));
    // Find the last "Jan" entry to approximate YTD start
    let start = 0;
    for (let i = n - 1; i >= 0; i--) {
      if (data[i].date.startsWith('Jan ')) { start = i; break; }
    }
    return start > 0 ? data.slice(start) : data;
  }
  const period = PERF_PERIODS.find((p) => p.id === periodId);
  if (!period || period.months == null) return data;
  return data.slice(Math.max(0, n - period.months));
}

const PerformanceChart = ({ data, selectedPeriod, onPeriodChange }) => {
  const filteredData = filterByPeriod(data, selectedPeriod);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="card px-4 py-3 text-sm space-y-1">
        <p className="text-text-secondary font-semibold">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold">
            {p.name}: ${p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Period selector */}
      <div className="flex gap-1 mb-4">
        {PERF_PERIODS.map((p) => (
          <button
            key={p.id}
            onClick={() => onPeriodChange(p.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              selectedPeriod === p.id
                ? 'bg-accent-blue text-white shadow-sm shadow-accent-blue/30'
                : 'text-text-secondary hover:text-text-primary bg-primary-hover hover:bg-primary-border'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={filteredData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2439" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 12 }}
            formatter={(value) => <span className="text-text-secondary text-xs">{value}</span>}
          />
          <Line type="monotone" dataKey="value" name="My Portfolio" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="benchmark" name="S&P 500" stroke="#10b981" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const SectorDonut = ({ data, showTargets = true }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="card px-3 py-2 text-sm">
        <p className="text-text-primary font-bold">{d.sector}</p>
        <p style={{ color: d.color }}>{d.pct.toFixed(1)}%</p>
        <p className="text-text-muted">${d.value.toLocaleString()}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div className="w-full lg:w-64 h-64 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="pct"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 w-full space-y-2">
        {data.map((s) => {
          const diff = s.pct - s.target;
          return (
            <div key={s.sector} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-text-secondary text-sm w-32 flex-shrink-0">{s.sector}</span>
              <div className="flex-1 h-1.5 bg-primary-border rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
              </div>
              <span className="text-text-primary text-sm font-semibold w-12 text-right">{s.pct.toFixed(1)}%</span>
              {showTargets && (
                <span className={`text-xs font-semibold w-16 text-right ${diff > 2 ? 'text-accent-red' : diff < -2 ? 'text-accent-yellow' : 'text-accent-green'}`}>
                  {diff > 0 ? '+' : ''}{diff.toFixed(1)}% vs tgt
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HoldingsTable = ({ holdings }) => {
  const [sortKey, setSortKey] = useState('market_value');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sorted = [...holdings].sort((a, b) => {
    const av = a[sortKey] ?? 0;
    const bv = b[sortKey] ?? 0;
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  const SortIcon = ({ col }) => (
    <span className="ml-1 text-text-muted">
      {sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const th = 'py-3 px-4 text-text-secondary text-xs font-semibold uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors select-none';

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-primary-border">
            <th className={`${th} text-left`} onClick={() => handleSort('ticker')}>Ticker <SortIcon col="ticker" /></th>
            <th className={`${th} text-left`}>Name</th>
            <th className={`${th} text-left`}>Sector</th>
            <th className={`${th} text-right`} onClick={() => handleSort('shares')}>Shares <SortIcon col="shares" /></th>
            <th className={`${th} text-right`} onClick={() => handleSort('cost_basis')}>Cost Basis <SortIcon col="cost_basis" /></th>
            <th className={`${th} text-right`} onClick={() => handleSort('current_price')}>Price <SortIcon col="current_price" /></th>
            <th className={`${th} text-right`} onClick={() => handleSort('market_value')}>Mkt Value <SortIcon col="market_value" /></th>
            <th className={`${th} text-right`} onClick={() => handleSort('gain_loss')}>P&L <SortIcon col="gain_loss" /></th>
            <th className={`${th} text-right`} onClick={() => handleSort('gain_loss_pct')}>P&L % <SortIcon col="gain_loss_pct" /></th>
            <th className={`${th} text-right`} onClick={() => handleSort('day_change_pct')}>Day % <SortIcon col="day_change_pct" /></th>
            <th className={`${th} text-right`} onClick={() => handleSort('weight')}>Weight <SortIcon col="weight" /></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((h, i) => (
            <motion.tr
              key={h.ticker}
              className="border-b border-primary-border/50 hover:bg-primary-hover transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              <td className="py-3 px-4">
                <span className="font-black text-text-primary text-sm">{h.ticker}</span>
              </td>
              <td className="py-3 px-4 text-text-secondary text-sm">{h.name}</td>
              <td className="py-3 px-4">
                <span className="text-xs px-2 py-1 rounded-full bg-primary-hover text-text-muted border border-primary-border/50">{h.sector}</span>
              </td>
              <td className="py-3 px-4 text-right text-text-secondary text-sm">{h.shares}</td>
              <td className="py-3 px-4 text-right text-text-secondary text-sm">${fmt(h.cost_basis)}</td>
              <td className="py-3 px-4 text-right text-text-primary font-semibold text-sm">${fmt(h.current_price)}</td>
              <td className="py-3 px-4 text-right text-text-primary font-semibold text-sm">{fmtUSD(h.market_value)}</td>
              <td className={`py-3 px-4 text-right font-semibold text-sm ${gainColor(h.gain_loss)}`}>
                {h.gain_loss >= 0 ? '+' : '-'}{fmtUSD(h.gain_loss)}
              </td>
              <td className={`py-3 px-4 text-right font-bold text-sm ${gainColor(h.gain_loss_pct)}`}>
                {sign(h.gain_loss_pct)}{fmt(h.gain_loss_pct)}%
              </td>
              <td className={`py-3 px-4 text-right text-sm font-semibold ${gainColor(h.day_change_pct)}`}>
                {sign(h.day_change_pct)}{fmt(h.day_change_pct)}%
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 h-1.5 bg-primary-border rounded-full overflow-hidden">
                    <div className="h-full bg-accent-blue rounded-full" style={{ width: `${Math.min(h.weight * 5, 100)}%` }} />
                  </div>
                  <span className="text-text-secondary text-xs w-10 text-right">{fmt(h.weight)}%</span>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const InsightCard = ({ insight }) => {
  const cfg = insightConfig[insight.type] || insightConfig.info;
  const pri = priorityConfig[insight.priority] || priorityConfig.medium;
  return (
    <motion.div
      className={`rounded-xl border p-5 ${cfg.border} ${cfg.bg}`}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">{cfg.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className={`font-bold text-sm ${cfg.titleColor}`}>{insight.title}</h3>
            <span className={`badge text-[10px] ${pri.badge}`}>{pri.label} Priority</span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">{insight.description}</p>
          <div className="flex items-start gap-2 bg-primary-bg/60 rounded-lg px-3 py-2 border border-primary-border/30">
            <span className="text-accent-blue text-xs mt-0.5 flex-shrink-0">→</span>
            <span className="text-text-secondary text-xs leading-relaxed">{insight.action}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── main page ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',  label: '📊 Overview' },
  { id: 'holdings',  label: '📋 Holdings' },
  { id: 'analytics', label: '🔬 Analytics' },
  { id: 'insights',  label: '💡 Insights' },
];

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [importMsg, setImportMsg] = useState(null);
  const [perfPeriod, setPerfPeriod] = useState('1Y');
  const fileInputRef = useRef(null);
  const { holdings: importedHoldings, totalValue: importedTotalValue, exportCSV, importCSV, hasImported, error: portfolioError } = usePortfolio();

  // Fetch latest market data (change_percent) for all imported tickers
  const portfolioTickers = hasImported ? importedHoldings.map((h) => h.ticker) : [];
  const { marketData } = useMarketData(portfolioTickers);
  const marketDataMap = Object.fromEntries(marketData.map((md) => [md.ticker, md.change_percent]));

  const portfolio = demoPortfolioData;
  const { summary: demoSummary, performance_history: demoPerformanceHistory, quality_scores: demoQualityScores, sector_allocation: demoSectorAllocation, insights: demoInsights } = portfolio;

  // Use imported holdings when available, otherwise use demo holdings
  // Enrich imported holdings with sector information and day_change_pct from market data
  const holdings = hasImported
    ? importedHoldings.map((h) => ({
        ...h,
        sector: SECTOR_LOOKUP[h.ticker] || 'Other',
        day_change_pct: marketDataMap[h.ticker] ?? 0,
      }))
    : portfolio.holdings;

  // Compute summary metrics from imported holdings when available
  const totalCost = hasImported
    ? holdings.reduce((s, h) => s + h.cost_basis * h.shares, 0)
    : demoSummary.total_cost;
  const totalValue = hasImported ? importedTotalValue : demoSummary.total_value;
  const totalGain = totalValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  // Score: baseline 50 + 1 pt per 2% gain, clamped 0–100
  const portfolioScore = hasImported
    ? Math.min(100, Math.max(0, Math.round(50 + totalGainPct / 2)))
    : demoSummary.portfolio_score;

  const dayChange = hasImported
    ? holdings.reduce((s, h) => s + h.market_value * (h.day_change_pct / 100), 0)
    : 0;

  const summary = hasImported ? {
    total_value: totalValue,
    total_cost: totalCost,
    total_gain: totalGain,
    total_gain_pct: totalGainPct,
    day_change: dayChange,
    day_change_pct: totalValue > 0 ? (dayChange / totalValue) * 100 : 0,
    annualized_return: null,
    ytd_return: null,
    beta: null,
    sharpe_ratio: null,
    volatility: null,
    max_drawdown: null,
    portfolio_score: portfolioScore,
  } : demoSummary;

  // Dynamic sector allocation, quality scores, and insights for imported data
  const sector_allocation = hasImported ? buildSectorAllocation(holdings, totalValue) : demoSectorAllocation;
  const quality_scores = hasImported ? buildQualityScores(holdings, totalGainPct) : demoQualityScores;
  const insights = hasImported ? generateInsights(holdings, totalValue) : demoInsights;
  const performance_history = hasImported
    ? buildPerformanceHistory(holdings, totalCost, totalValue)
    : demoPerformanceHistory;

  const totalPositions = holdings.length;
  const winners = holdings.filter(h => h.gain_loss > 0).length;
  const portfolioYield = holdings.reduce((s, h) => s + ((h.dividend_yield || 0) * h.market_value / 100), 0) / (summary.total_value || 1) * 100;

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const count = await importCSV(evt.target.result);
        setImportMsg({ type: 'success', text: `Imported ${count} holdings successfully` });
        setTimeout(() => setImportMsg(null), 4000);
      } catch (err) {
        setImportMsg({ type: 'error', text: err.message });
        setTimeout(() => setImportMsg(null), 5000);
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  // Pre-compute top performers for the bar chart (handles >100% gain)
  const topPerformers = [...holdings].sort((a, b) => b.gain_loss_pct - a.gain_loss_pct).slice(0, 5);
  const maxTopGainPct = Math.max(...topPerformers.map((h) => h.gain_loss_pct), 1);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-primary mb-1">
            Investment Portfolio
          </h1>
          <p className="text-text-secondary">US Equity portfolio tracker — AI-powered insights & analytics</p>
        </div>
        <div className="flex items-center gap-3 text-sm flex-wrap">
          {/* Import / Export buttons */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImport}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-accent-blue/15 text-accent-blue border border-accent-blue/30 font-semibold hover:bg-accent-blue/25 transition-colors"
          >
            📥 Import CSV
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-lg bg-accent-green/15 text-accent-green border border-accent-green/30 font-semibold hover:bg-accent-green/25 transition-colors"
          >
            📤 Export CSV
          </button>
          <span className="px-3 py-1.5 rounded-lg bg-accent-green/15 text-accent-green border border-accent-green/30 font-semibold">
            {hasImported ? '📁 Imported' : '📈 Demo Mode'}
          </span>
          <span className="text-text-muted">Last updated: Feb 25, 2026</span>
        </div>
      </div>

      {/* Import status message */}
      {importMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl text-sm font-semibold border ${
            importMsg.type === 'success'
              ? 'bg-accent-green/10 text-accent-green border-accent-green/30'
              : 'bg-accent-red/10 text-accent-red border-accent-red/30'
          }`}
        >
          {importMsg.text}
        </motion.div>
      )}

      {portfolioError && (
        <div className="px-4 py-3 rounded-xl text-sm font-semibold border bg-accent-red/10 text-accent-red border-accent-red/30">
          {portfolioError}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Value"
          value={`$${(summary.total_value / 1000).toFixed(1)}k`}
          sub={`Cost basis: $${(summary.total_cost / 1000).toFixed(1)}k`}
          valueClass="text-text-primary"
          icon="💼"
        />
        <SummaryCard
          label="Total Gain / Loss"
          value={`${summary.total_gain >= 0 ? '+' : ''}$${(summary.total_gain / 1000).toFixed(1)}k`}
          sub={`${sign(summary.total_gain_pct)}${fmt(summary.total_gain_pct)}% all-time`}
          valueClass={gainColor(summary.total_gain)}
          icon="📈"
        />
        <SummaryCard
          label="Today's Change"
          value={hasImported && marketData.length === 0 ? '—' : `${summary.day_change >= 0 ? '+' : ''}$${fmt(summary.day_change, 0)}`}
          sub={hasImported && marketData.length === 0 ? 'Market data not available' : `${sign(summary.day_change_pct)}${fmt(summary.day_change_pct)}%`}
          valueClass={hasImported && marketData.length === 0 ? 'text-text-muted' : gainColor(summary.day_change)}
          icon="🕐"
        />
        <SummaryCard
          label={hasImported ? 'Total Return' : 'Annualised Return'}
          value={hasImported ? `${sign(totalGainPct)}${fmt(totalGainPct)}%` : `${sign(summary.annualized_return)}${summary.annualized_return}%`}
          sub={hasImported ? `${totalPositions} positions · ${winners} winners` : `YTD: ${sign(summary.ytd_return)}${summary.ytd_return}%`}
          valueClass={gainColor(hasImported ? totalGainPct : summary.annualized_return)}
          icon="🎯"
        />
      </div>

      {/* Portfolio Score banner */}
      <motion.div
        className="card bg-gradient-to-r from-accent-blue/10 via-primary-surface to-accent-green/10 border-accent-blue/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Score ring */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#1e2439" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="32" fill="none"
                  stroke={summary.portfolio_score >= 75 ? '#10b981' : summary.portfolio_score >= 55 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${(summary.portfolio_score / 100) * 201} 201`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-text-primary">{summary.portfolio_score}</span>
              </div>
            </div>
            <div>
              <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">Portfolio Score</p>
              <p className={`text-lg font-black ${summary.portfolio_score >= 75 ? 'text-accent-green' : summary.portfolio_score >= 55 ? 'text-accent-yellow' : 'text-accent-red'}`}>
                {summary.portfolio_score >= 80 ? 'Excellent' : summary.portfolio_score >= 65 ? 'Good' : summary.portfolio_score >= 50 ? 'Fair' : 'Needs Work'}
              </p>
              <p className="text-text-muted text-xs">{totalPositions} positions · {winners} winners</p>
            </div>
          </div>
          {/* Quick stats */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Sharpe Ratio', value: summary.sharpe_ratio != null ? summary.sharpe_ratio : '—', suffix: '', good: summary.sharpe_ratio != null ? summary.sharpe_ratio >= 1 : null },
              { label: 'Beta', value: summary.beta != null ? summary.beta : '—', suffix: '', good: summary.beta != null ? summary.beta <= 1.2 : null },
              { label: 'Volatility', value: summary.volatility != null ? `${summary.volatility}%` : '—', suffix: '', good: null },
              { label: 'Div. Yield', value: `${portfolioYield.toFixed(1)}%`, suffix: '', good: portfolioYield >= 1.5 },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-lg bg-primary-bg/50 border border-primary-border/30">
                <p className="text-text-muted text-xs mb-1">{s.label}</p>
                <p className={`font-black text-lg ${s.good === null ? 'text-text-primary' : s.good ? 'text-accent-green' : 'text-accent-yellow'}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-primary-surface rounded-xl p-1 border border-primary-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30'
                : 'text-text-secondary hover:text-text-primary hover:bg-primary-hover'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="subsection-title">Portfolio Performance vs S&P 500</h2>
                <PerformanceChart data={performance_history} selectedPeriod={perfPeriod} onPeriodChange={setPerfPeriod} />
              </div>

              <div className="card">
                <h2 className="subsection-title">Sector Allocation</h2>
                <SectorDonut data={sector_allocation} showTargets={!hasImported} />
              </div>

              {/* Top movers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card">
                  <h3 className="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-4">🏆 Top Performers</h3>
                  <div className="space-y-3">
                    {topPerformers.map((h) => (
                      <div key={h.ticker} className="flex items-center gap-3">
                        <span className="font-black text-text-primary w-16 text-sm">{h.ticker}</span>
                        <div className="flex-1 h-2 bg-primary-border rounded-full overflow-hidden">
                          <div className="h-full bg-accent-green rounded-full" style={{ width: `${(Math.max(h.gain_loss_pct, 0) / maxTopGainPct) * 100}%` }} />
                        </div>
                        <span className="text-accent-green font-bold text-sm w-16 text-right">+{fmt(h.gain_loss_pct)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <h3 className="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-4">📉 Underperformers</h3>
                  <div className="space-y-3">
                    {[...holdings].sort((a,b) => a.gain_loss_pct - b.gain_loss_pct).slice(0, 5).map((h) => (
                      <div key={h.ticker} className="flex items-center gap-3">
                        <span className="font-black text-text-primary w-16 text-sm">{h.ticker}</span>
                        <div className="flex-1 h-2 bg-primary-border rounded-full overflow-hidden">
                          <div className="h-full bg-accent-red rounded-full" style={{ width: `${Math.min(Math.abs(h.gain_loss_pct), 100)}%` }} />
                        </div>
                        <span className={`font-bold text-sm w-16 text-right ${gainColor(h.gain_loss_pct)}`}>{sign(h.gain_loss_pct)}{fmt(h.gain_loss_pct)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── HOLDINGS TAB ── */}
          {activeTab === 'holdings' && (
            <div className="space-y-4">
              <div className="card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="subsection-title mb-0">{totalPositions} Positions</h2>
                    <p className="text-text-muted text-sm">Click column headers to sort</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-text-muted">Invested</p>
                      <p className="text-text-primary font-bold">{fmtUSD(summary.total_cost)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-text-muted">Market Value</p>
                      <p className="text-text-primary font-bold">{fmtUSD(summary.total_value)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-text-muted">Total P&L</p>
                      <p className={`font-bold ${gainColor(summary.total_gain)}`}>
                        {sign(summary.total_gain)}{fmtUSD(summary.total_gain)}
                      </p>
                    </div>
                  </div>
                </div>
                <HoldingsTable holdings={holdings} />
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Quality Scores */}
              <div className="card">
                <h2 className="subsection-title">Portfolio Quality Scores</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <ScoreBar label="Diversification" score={quality_scores.diversification} color="#3b82f6" />
                    <ScoreBar label="Risk-Adjusted Return" score={quality_scores.risk_adjusted_return} color="#10b981" />
                    <ScoreBar label="Momentum" score={quality_scores.momentum} color="#f59e0b" />
                  </div>
                  <div className="space-y-5">
                    <ScoreBar label="Valuation / Value" score={quality_scores.value} color="#8b5cf6" />
                    <ScoreBar label="Dividend Income" score={quality_scores.dividend_income} color="#06b6d4" />
                    <ScoreBar label="Overall Score" score={quality_scores.overall} color="#ef4444" />
                  </div>
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="card">
                <h2 className="subsection-title">Risk Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Sharpe Ratio', value: summary.sharpe_ratio != null ? summary.sharpe_ratio : '—', desc: 'Risk-adjusted return', good: summary.sharpe_ratio != null ? summary.sharpe_ratio >= 1 : null },
                    { label: 'Beta', value: summary.beta != null ? summary.beta : '—', desc: 'Market sensitivity', good: summary.beta != null ? summary.beta <= 1.2 : null },
                    { label: 'Volatility', value: summary.volatility != null ? `${summary.volatility}%` : '—', desc: 'Annualised std. dev.', good: null },
                    { label: 'Max Drawdown', value: summary.max_drawdown != null ? `${summary.max_drawdown}%` : '—', desc: 'Worst peak-to-trough', good: summary.max_drawdown != null ? summary.max_drawdown > -25 : null },
                  ].map((m) => (
                    <div key={m.label} className="p-4 rounded-xl bg-primary-bg/60 border border-primary-border/40 text-center">
                      <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">{m.label}</p>
                      <p className={`text-2xl font-black mb-1 ${m.good === null ? 'text-text-primary' : m.good ? 'text-accent-green' : 'text-accent-yellow'}`}>
                        {m.value}
                      </p>
                      <p className="text-text-muted text-xs">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sector vs Target — custom HTML chart */}
              <div className="card">
                <h2 className="subsection-title">{hasImported ? 'Sector Allocation' : 'Sector Allocation vs Target'}</h2>
                <div className="space-y-4">
                  {sector_allocation.map((s) => {
                    const diff = s.pct - s.target;
                    const maxPct = 40;
                    return (
                      <div key={s.sector}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                            <span className="text-text-secondary font-medium">{s.sector}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {!hasImported && <span className="text-text-muted">Target: {s.target}%</span>}
                            <span className={`font-bold ${!hasImported ? (diff > 2 ? 'text-accent-red' : diff < -2 ? 'text-accent-yellow' : 'text-accent-green') : 'text-text-primary'}`}>
                              {s.pct.toFixed(1)}%{!hasImported && (diff > 0.1 ? ` ▲ +${diff.toFixed(1)}%` : diff < -0.1 ? ` ▼ ${diff.toFixed(1)}%` : ' ✓')}
                            </span>
                          </div>
                        </div>
                        <div className="relative h-5 bg-primary-border/40 rounded-full overflow-hidden">
                          {/* Target marker */}
                          {!hasImported && (
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-accent-green/70 z-10"
                              style={{ left: `${(s.target / maxPct) * 100}%` }}
                            />
                          )}
                          {/* Current bar */}
                          <motion.div
                            className="absolute top-1 bottom-1 rounded-full"
                            style={{ backgroundColor: s.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(s.pct / maxPct) * 100}%` }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex gap-5 pt-2 text-xs text-text-muted border-t border-primary-border/40">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-accent-blue" />
                      <span>Current allocation (bar)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-0.5 h-3 bg-accent-green/70" />
                      <span>Target allocation (line)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Position concentration */}
              <div className="card">
                <h2 className="subsection-title">Position Concentration</h2>
                <div className="space-y-2">
                  {[...holdings].sort((a,b) => b.weight - a.weight).slice(0, 10).map((h) => (
                    <div key={h.ticker} className="flex items-center gap-3">
                      <span className="font-black text-text-primary text-sm w-14">{h.ticker}</span>
                      <div className="flex-1 h-3 bg-primary-border rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${h.weight > 8 ? 'bg-accent-red' : h.weight > 6 ? 'bg-accent-yellow' : 'bg-accent-blue'}`}
                          style={{ width: `${(h.weight / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-text-secondary text-sm w-12 text-right">{fmt(h.weight)}%</span>
                      <span className="text-text-muted text-xs w-24 text-right">{fmtUSD(h.market_value)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-text-muted text-xs mt-4">�� &gt;8% · 🟡 6–8% · 🔵 &lt;6% concentration</p>
              </div>
            </div>
          )}

          {/* ── INSIGHTS TAB ── */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* Summary row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'High Priority', value: insights.filter(i=>i.priority==='high').length, color: 'text-accent-red', bg: 'bg-accent-red/10 border-accent-red/30' },
                  { label: 'Opportunities', value: insights.filter(i=>i.type==='opportunity').length, color: 'text-accent-green', bg: 'bg-accent-green/10 border-accent-green/30' },
                  { label: 'Warnings', value: insights.filter(i=>i.type==='warning'||i.type==='danger').length, color: 'text-accent-yellow', bg: 'bg-accent-yellow/10 border-accent-yellow/30' },
                  { label: 'Win Rate', value: `${Math.round((winners / totalPositions) * 100)}%`, color: 'text-accent-blue', bg: 'bg-accent-blue/10 border-accent-blue/30' },
                ].map((s) => (
                  <div key={s.label} className={`card border ${s.bg} text-center`}>
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-text-muted text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Insights list */}
              <div className="space-y-4">
                <h2 className="section-title">AI Portfolio Insights</h2>
                {[...insights].sort((a,b) => {
                  const order = { high: 0, medium: 1, low: 2 };
                  return (order[a.priority] ?? 2) - (order[b.priority] ?? 2);
                }).map((insight, i) => (
                  <InsightCard key={i} insight={insight} />
                ))}
              </div>

              {/* Rebalancing suggestion */}
              <div className="card border-accent-blue/30 bg-accent-blue/5">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">🔄</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-text-primary mb-2">Rebalancing Recommendation</h3>
                    <p className="text-text-secondary text-sm mb-4">
                      Your portfolio has drifted from targets. Consider the following rebalancing actions on the next contribution:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(hasImported ? buildRebalanceSuggestions(holdings) : [
                        { action: 'TRIM', tickers: 'NVDA, META', reason: 'Oversized — both exceed 6% single-stock limit', color: 'border-accent-red/40 bg-accent-red/5 text-accent-red' },
                        { action: 'HOLD', tickers: 'AAPL, MSFT, SPY', reason: 'Well-positioned — within target allocation', color: 'border-accent-green/40 bg-accent-green/5 text-accent-green' },
                        { action: 'ADD', tickers: 'UNH, ABT', reason: 'Healthcare underweight — add defensive exposure', color: 'border-accent-blue/40 bg-accent-blue/5 text-accent-blue' },
                      ]).map((r) => (
                        <div key={r.action} className={`rounded-lg border p-3 ${r.color}`}>
                          <p className="font-black text-sm mb-1">{r.action}</p>
                          <p className="font-bold text-text-primary text-sm mb-1">{r.tickers}</p>
                          <p className="text-text-muted text-xs">{r.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="card bg-primary-hover border-accent-yellow/30">
                <div className="flex items-start space-x-3">
                  <span className="text-accent-yellow text-xl">⚠️</span>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    <strong className="text-text-primary">Disclaimer:</strong> Portfolio insights and recommendations are for educational purposes only and do not constitute financial advice. Past performance does not guarantee future results. Always consult a qualified financial advisor before making investment decisions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
