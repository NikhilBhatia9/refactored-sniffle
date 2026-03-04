import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../components/ui/badge';
import { valueHunterSectors } from '../data/valueHunterData';

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) => (n == null ? 'N/A' : n.toFixed(1));
const fmtPrice = (n) => (n == null ? 'N/A' : `$${n.toFixed(2)}`);
const fmtPct = (n) => (n == null ? 'N/A' : `${n > 0 ? '+' : ''}${n.toFixed(1)}%`);

const SIGNAL_PRIORITY = {
  screaming_buy: 0,
  extreme_value: 1,
  deep_value: 2,
  approaching_value: 3,
  core_value: 4,
  overvalued: 5,
};

const SIGNAL_CONFIG = {
  screaming_buy:    { variant: 'green',   label: '🟢 Screaming Buy',     rowBg: 'bg-accent-green/5' },
  extreme_value:    { variant: 'green',   label: '🟢 Extreme Value',      rowBg: 'bg-accent-green/5' },
  deep_value:       { variant: 'default', label: '🔵 Deep Value',         rowBg: 'bg-accent-blue/5'  },
  approaching_value:{ variant: 'default', label: '🔵 Approaching Value',  rowBg: 'bg-accent-blue/5'  },
  core_value:       { variant: 'yellow',  label: '🟡 Core Value',         rowBg: 'bg-accent-yellow/5'},
  overvalued:       { variant: 'red',     label: '🔴 Overvalued',         rowBg: ''                  },
};

const getValueSignal = (stock) => {
  if (stock.current_price <= stock.sb)       return 'screaming_buy';
  if (stock.current_price < stock.dv_low)    return 'extreme_value';
  if (stock.current_price <= stock.dv_high)  return 'deep_value';
  if (stock.current_price < stock.cv_low)    return 'approaching_value';
  if (stock.current_price <= stock.cv_high)  return 'core_value';
  return 'overvalued';
};

const getValueScore = (stock) => {
  const fairValue = (stock.cv_low + stock.cv_high) / 2;
  const discount = (fairValue - stock.current_price) / fairValue;
  return Math.min(100, Math.max(0, Math.round(50 + discount * 100)));
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const ValueScoreBar = ({ score }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 bg-primary-hover rounded-full h-2">
      <div
        className={`h-2 rounded-full ${
          score >= 70 ? 'bg-accent-green'
          : score >= 50 ? 'bg-accent-blue'
          : score >= 35 ? 'bg-accent-yellow'
          : 'bg-accent-red'
        }`}
        style={{ width: `${score}%` }}
      />
    </div>
    <span className="text-xs text-text-muted w-8 text-right">{score}</span>
  </div>
);

const StatCard = ({ label, value, color = 'text-text-primary' }) => (
  <div className="card text-center">
    <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
    <div className="text-text-muted text-sm">{label}</div>
  </div>
);

const TopStockCard = ({ stock, index }) => {
  const signal = getValueSignal(stock);
  const score = getValueScore(stock);
  const cfg = SIGNAL_CONFIG[signal];

  return (
    <motion.div
      className="card flex flex-col gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-2xl font-bold text-text-primary">{stock.ticker}</div>
          <div className="text-text-muted text-xs mt-0.5 leading-tight">{stock.company}</div>
        </div>
        <Badge variant={cfg.variant}>{cfg.label}</Badge>
      </div>

      {/* Current price */}
      <div className="text-xl font-semibold text-text-primary">
        {fmtPrice(stock.current_price)}
        <span className="text-text-muted text-xs font-normal ml-2">current</span>
      </div>

      {/* Price ranges */}
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-text-muted text-xs">Core Value</span>
          <span className="text-accent-yellow font-medium">
            {fmtPrice(stock.cv_low)} — {fmtPrice(stock.cv_high)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-muted text-xs">Deep Value</span>
          <span className="text-accent-blue font-medium">
            {fmtPrice(stock.dv_low)} — {fmtPrice(stock.dv_high)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-muted text-xs">Screaming Buy</span>
          <span className="text-accent-green font-medium">{fmtPrice(stock.sb)}</span>
        </div>
      </div>

      {/* Score bar */}
      <div>
        <div className="text-xs text-text-muted mb-1">Value Score</div>
        <ValueScoreBar score={score} />
      </div>

      {/* Fundamentals */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-primary-border/40 text-center">
        <div>
          <div className="text-xs text-text-muted">P/E</div>
          <div className="text-sm font-medium text-text-primary">{fmt(stock.pe)}x</div>
        </div>
        <div>
          <div className="text-xs text-text-muted">ROE</div>
          <div className="text-sm font-medium text-text-primary">{fmt(stock.roe)}%</div>
        </div>
        <div>
          <div className="text-xs text-text-muted">Rev Gr.</div>
          <div className="text-sm font-medium text-text-primary">{fmtPct(stock.rev_growth)}</div>
        </div>
      </div>
    </motion.div>
  );
};

const SectorTable = ({ sector }) => {
  const screamingBuys = sector.stocks.filter(
    (s) => getValueSignal(s) === 'screaming_buy' || getValueSignal(s) === 'extreme_value',
  ).length;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sector header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-text-primary">{sector.name}</h2>
          <p className="text-text-muted text-sm mt-0.5">{sector.description}</p>
        </div>
        {screamingBuys > 0 && (
          <Badge variant="green">
            🟢 {screamingBuys} Screaming {screamingBuys === 1 ? 'Buy' : 'Buys'}
          </Badge>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-primary-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary-hover text-text-muted text-xs uppercase tracking-wider">
              <th className="sticky left-0 bg-primary-hover px-4 py-3 text-left whitespace-nowrap">Ticker</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Company</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Current</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Signal</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Core Value</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Deep Value</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Scr. Buy</th>
              <th className="px-4 py-3 text-left whitespace-nowrap min-w-[120px]">Score</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">P/E</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">ROE</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Rev Gr%</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Div%</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Mkt Cap</th>
            </tr>
          </thead>
          <tbody>
            {sector.stocks.map((stock) => {
              const signal = getValueSignal(stock);
              const score = getValueScore(stock);
              const cfg = SIGNAL_CONFIG[signal];
              return (
                <tr
                  key={stock.ticker}
                  className={`border-b border-primary-border/30 hover:bg-primary-hover/50 transition-colors ${cfg.rowBg}`}
                >
                  <td className="sticky left-0 bg-inherit px-4 py-3 font-bold text-text-primary whitespace-nowrap">
                    {stock.ticker}
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{stock.company}</td>
                  <td className="px-4 py-3 text-right font-medium text-text-primary whitespace-nowrap">
                    {fmtPrice(stock.current_price)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-accent-yellow whitespace-nowrap">
                    {fmtPrice(stock.cv_low)} — {fmtPrice(stock.cv_high)}
                  </td>
                  <td className="px-4 py-3 text-right text-accent-blue whitespace-nowrap">
                    {fmtPrice(stock.dv_low)} — {fmtPrice(stock.dv_high)}
                  </td>
                  <td className="px-4 py-3 text-right text-accent-green whitespace-nowrap">
                    {fmtPrice(stock.sb)}
                  </td>
                  <td className="px-4 py-3 min-w-[120px]">
                    <ValueScoreBar score={score} />
                  </td>
                  <td className="px-4 py-3 text-right text-text-secondary whitespace-nowrap">{fmt(stock.pe)}x</td>
                  <td className="px-4 py-3 text-right text-text-secondary whitespace-nowrap">{fmt(stock.roe)}%</td>
                  <td className="px-4 py-3 text-right text-text-secondary whitespace-nowrap">{fmtPct(stock.rev_growth)}</td>
                  <td className="px-4 py-3 text-right text-text-secondary whitespace-nowrap">{fmt(stock.div_yield)}%</td>
                  <td className="px-4 py-3 text-right text-text-secondary whitespace-nowrap">{stock.market_cap}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const ValueHunter = () => {
  const [activeTab, setActiveTab] = useState('top15');

  const allStocks = useMemo(
    () => valueHunterSectors.flatMap((s) => s.stocks),
    [],
  );

  const scoredStocks = useMemo(
    () =>
      allStocks
        .map((s) => ({ ...s, _score: getValueScore(s), _signal: getValueSignal(s) }))
        .sort((a, b) => {
          if (b._score !== a._score) return b._score - a._score;
          return SIGNAL_PRIORITY[a._signal] - SIGNAL_PRIORITY[b._signal];
        }),
    [allStocks],
  );

  const top15 = useMemo(() => scoredStocks.slice(0, 15), [scoredStocks]);

  const signalCounts = useMemo(() => {
    const counts = { screaming_buy: 0, extreme_value: 0, deep_value: 0, approaching_value: 0, core_value: 0, overvalued: 0 };
    allStocks.forEach((s) => counts[getValueSignal(s)]++);
    return counts;
  }, [allStocks]);

  const tabs = [
    { key: 'top15', label: '🏆 Top 15' },
    ...valueHunterSectors.map((s) => ({ key: s.name, label: s.name })),
  ];

  const activeSector = valueHunterSectors.find((s) => s.name === activeTab);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-start gap-4">
          <div className="text-5xl">🎯</div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Value Hunter</h1>
            <p className="text-text-secondary mt-1 max-w-2xl">
              Billionaire-style value analysis across 165 stocks in 11 US market sectors.
              Identify stocks trading at Core Value, Deep Value, or Screaming Buy prices
              using DCF, normalized P/E, and Graham Number methodologies.
            </p>
          </div>
        </div>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────────── */}
      <div className="card">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Value Signal Key</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent-red/5 border border-accent-red/20">
            <span className="text-xl">🔴</span>
            <div>
              <div className="font-semibold text-accent-red">Overvalued / Wait</div>
              <div className="text-text-muted text-xs mt-0.5">current {'>'} cv_high</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent-yellow/5 border border-accent-yellow/20">
            <span className="text-xl">🟡</span>
            <div>
              <div className="font-semibold text-accent-yellow">Core Value</div>
              <div className="text-text-muted text-xs mt-0.5">cv_low ≤ current ≤ cv_high — fairly valued</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent-blue/5 border border-accent-blue/20">
            <span className="text-xl">🔵</span>
            <div>
              <div className="font-semibold text-accent-blue">Deep Value</div>
              <div className="text-text-muted text-xs mt-0.5">dv_low ≤ current {'<'} cv_low — smart money zone</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent-green/5 border border-accent-green/20">
            <span className="text-xl">🟢</span>
            <div>
              <div className="font-semibold text-accent-green">Screaming Buy</div>
              <div className="text-text-muted text-xs mt-0.5">current ≤ sb — exceptional opportunity</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary Stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Stocks" value={allStocks.length} color="text-text-primary" />
        <StatCard
          label="Screaming Buys"
          value={signalCounts.screaming_buy + signalCounts.extreme_value}
          color="text-accent-green"
        />
        <StatCard
          label="Deep Value"
          value={signalCounts.deep_value + signalCounts.approaching_value}
          color="text-accent-blue"
        />
        <StatCard label="Core Value" value={signalCounts.core_value} color="text-accent-yellow" />
        <StatCard label="Overvalued" value={signalCounts.overvalued} color="text-accent-red" />
      </div>

      {/* ── Tab Navigation ─────────────────────────────────────────────────── */}
      <div className="overflow-x-auto flex gap-1 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-accent-blue text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-primary-hover'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      {activeTab === 'top15' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-text-primary">🏆 Top 15 Value Opportunities</h2>
            <span className="text-text-muted text-sm">Ranked by value score across all 165 stocks</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {top15.map((stock, i) => (
              <TopStockCard key={stock.ticker} stock={stock} index={i} />
            ))}
          </div>
        </div>
      ) : (
        activeSector && <SectorTable sector={activeSector} />
      )}

      {/* ── Disclaimer ─────────────────────────────────────────────────────── */}
      <div className="card bg-primary-surface/50 border-primary-border/30">
        <p className="text-text-muted text-xs text-center leading-relaxed">
          ⚠️ This analysis is for educational purposes only. Not financial advice.
          Valuations are based on normalized historical data and forward estimates.
          Always do your own research and consult a qualified financial advisor before investing.
        </p>
      </div>
    </motion.div>
  );
};

export default ValueHunter;
