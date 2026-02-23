import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRecommendations } from '../hooks/useRecommendations';
import RecommendationCard from '../components/RecommendationCard';
import BackendUnavailableError from '../components/BackendUnavailableError';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';

const RecommendationsSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-64 rounded" />
    <Skeleton className="h-24 w-full rounded-xl" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
    </div>
  </div>
);

const Recommendations = () => {
  const [filters, setFilters] = useState({
    strategy: '',
    sector: '',
    minConviction: '',
    riskLevel: '',
  });
  const [sortBy, setSortBy] = useState('ai_score');

  const { recommendations, loading, error } = useRecommendations({
    strategy: filters.strategy || undefined,
    sector: filters.sector || undefined,
    minConviction: filters.minConviction ? parseFloat(filters.minConviction) : undefined,
    riskLevel: filters.riskLevel || undefined,
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ strategy: '', sector: '', minConviction: '', riskLevel: '' });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  // Sort recommendations
  const sorted = [...recommendations].sort((a, b) => {
    if (sortBy === 'ai_score') return (b.ai_score ?? 0) - (a.ai_score ?? 0);
    if (sortBy === 'upside') return (b.upside_percent ?? 0) - (a.upside_percent ?? 0);
    if (sortBy === 'dcf_return') return (b.valuation_methods?.dcf ?? 0) - (a.valuation_methods?.dcf ?? 0);
    if (sortBy === 'avg_return') return (b.valuation_methods?.avg_return ?? 0) - (a.valuation_methods?.avg_return ?? 0);
    return (b.conviction_score ?? 0) - (a.conviction_score ?? 0);
  });

  if (loading) return <RecommendationsSkeleton />;

  if (error === 'backend_unavailable') return <BackendUnavailableError />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-accent-red">Error loading recommendations: {error}</div>
      </div>
    );
  }

  // Aggregate stats
  const screamingBuys = recommendations.filter(r => r.ai_score >= 85).length;
  const avgAIScore = recommendations.length > 0
    ? Math.round(recommendations.reduce((sum, r) => sum + (r.ai_score ?? 0), 0) / recommendations.length)
    : 0;
  const avgReturn = recommendations.length > 0
    ? (recommendations.reduce((sum, r) => sum + (r.valuation_methods?.avg_return ?? r.upside_percent ?? 0), 0) / recommendations.length).toFixed(1)
    : '0';

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Investment Recommendations</h1>
        <p className="text-text-secondary">
          AI-scored stock picks — great businesses at attractive valuations, ranked by overall quality and upside potential.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-text-secondary mb-2">Strategy</label>
            <select value={filters.strategy} onChange={(e) => handleFilterChange('strategy', e.target.value)} className="input">
              <option value="">All Strategies</option>
              <option value="growth">Growth</option>
              <option value="value">Value</option>
              <option value="defensive">Defensive</option>
              <option value="contrarian">Contrarian</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-text-secondary mb-2">Sector</label>
            <select value={filters.sector} onChange={(e) => handleFilterChange('sector', e.target.value)} className="input">
              <option value="">All Sectors</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Financials">Financials</option>
              <option value="Energy">Energy</option>
              <option value="Consumer">Consumer</option>
              <option value="Industrials">Industrials</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-text-secondary mb-2">Min Conviction (0–10)</label>
            <select value={filters.minConviction} onChange={(e) => handleFilterChange('minConviction', e.target.value)} className="input">
              <option value="">Any</option>
              <option value="8">8+ (High)</option>
              <option value="7">7+ (Strong)</option>
              <option value="5">5+ (Moderate)</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-text-secondary mb-2">Risk Level</label>
            <select value={filters.riskLevel} onChange={(e) => handleFilterChange('riskLevel', e.target.value)} className="input">
              <option value="">All Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {hasActiveFilters && (
            <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
          )}
        </div>

        {/* Sort Row */}
        <div className="mt-4 pt-4 border-t border-primary-border/30 flex items-center gap-3">
          <span className="text-sm text-text-secondary font-medium">Sort by:</span>
          {[
            { key: 'ai_score', label: 'AI Score' },
            { key: 'avg_return', label: 'Avg Return' },
            { key: 'dcf_return', label: 'DCF Return' },
            { key: 'upside', label: 'Upside' },
            { key: 'conviction', label: 'Conviction' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                sortBy === opt.key
                  ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/40'
                  : 'bg-primary-bg/50 text-text-secondary border-primary-border/30 hover:border-accent-blue/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-text-secondary text-sm mb-2">Total Picks</p>
          <p className="text-3xl font-bold text-text-primary">{recommendations.length}</p>
        </div>
        <div className="card bg-accent-green/10 border-accent-green/20">
          <p className="text-text-secondary text-sm mb-2">🔥 Screaming Buys</p>
          <p className="text-3xl font-bold text-accent-green">{screamingBuys}</p>
        </div>
        <div className="card bg-accent-blue/10 border-accent-blue/20">
          <p className="text-text-secondary text-sm mb-2">Avg AI Score</p>
          <p className="text-3xl font-bold text-accent-blue">{avgAIScore}<span className="text-base text-text-muted">/100</span></p>
        </div>
        <div className="card bg-accent-yellow/10 border-accent-yellow/20">
          <p className="text-text-secondary text-sm mb-2">Avg Potential Return</p>
          <p className="text-3xl font-bold text-accent-yellow">+{avgReturn}%</p>
        </div>
      </div>

      {/* Recommendations Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sorted.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-text-secondary mb-4">No recommendations match your filters.</p>
          {hasActiveFilters && (
            <Button onClick={clearFilters}>Clear Filters</Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Recommendations;
