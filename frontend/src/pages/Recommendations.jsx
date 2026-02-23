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

  if (loading) return <RecommendationsSkeleton />;

  if (error === 'backend_unavailable') return <BackendUnavailableError />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-accent-red">Error loading recommendations: {error}</div>
      </div>
    );
  }

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
          High-conviction stock picks backed by comprehensive AI analysis
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-text-secondary text-sm mb-2">Total Picks</p>
          <p className="text-3xl font-bold text-text-primary">{recommendations.length}</p>
        </div>
        <div className="card bg-accent-green/10 border-accent-green/20">
          <p className="text-text-secondary text-sm mb-2">Growth</p>
          <p className="text-3xl font-bold text-accent-green">
            {recommendations.filter(r => r.strategy === 'growth').length}
          </p>
        </div>
        <div className="card bg-accent-yellow/10 border-accent-yellow/20">
          <p className="text-text-secondary text-sm mb-2">Avg Conviction</p>
          <p className="text-3xl font-bold text-accent-yellow">
            {recommendations.length > 0
              ? (recommendations.reduce((sum, r) => sum + r.conviction_score, 0) / recommendations.length).toFixed(1)
              : 0}
          </p>
        </div>
        <div className="card bg-accent-blue/10 border-accent-blue/20">
          <p className="text-text-secondary text-sm mb-2">High Conviction</p>
          <p className="text-3xl font-bold text-accent-blue">
            {recommendations.filter(r => r.conviction_score >= 8).length}
          </p>
        </div>
      </div>

      {/* Recommendations Grid */}
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
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
