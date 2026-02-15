import { useState, useEffect } from 'react';
import { getRecommendations } from '../services/api';
import RecommendationCard from '../components/RecommendationCard';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    sector: '',
    conviction_min: '',
    risk_level: '',
    stance: '',
  });

  useEffect(() => {
    fetchRecommendations();
  }, [filters]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await getRecommendations(filters);
      setRecommendations(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      sector: '',
      conviction_min: '',
      risk_level: '',
      stance: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="space-y-6">
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
            <label className="block text-sm text-text-secondary mb-2">Sector</label>
            <select
              value={filters.sector}
              onChange={(e) => handleFilterChange('sector', e.target.value)}
              className="input"
            >
              <option value="">All Sectors</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Financials">Financials</option>
              <option value="Energy">Energy</option>
              <option value="Consumer">Consumer</option>
              <option value="Industrials">Industrials</option>
              <option value="Materials">Materials</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Utilities">Utilities</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-text-secondary mb-2">Min Conviction</label>
            <select
              value={filters.conviction_min}
              onChange={(e) => handleFilterChange('conviction_min', e.target.value)}
              className="input"
            >
              <option value="">Any</option>
              <option value="75">75+ (High)</option>
              <option value="60">60+ (Strong)</option>
              <option value="40">40+ (Moderate)</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-text-secondary mb-2">Risk Level</label>
            <select
              value={filters.risk_level}
              onChange={(e) => handleFilterChange('risk_level', e.target.value)}
              className="input"
            >
              <option value="">All Levels</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-text-secondary mb-2">Stance</label>
            <select
              value={filters.stance}
              onChange={(e) => handleFilterChange('stance', e.target.value)}
              className="input"
            >
              <option value="">All</option>
              <option value="Bullish">Bullish</option>
              <option value="Neutral">Neutral</option>
              <option value="Bearish">Bearish</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear Filters
            </button>
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
          <p className="text-text-secondary text-sm mb-2">Bullish</p>
          <p className="text-3xl font-bold text-accent-green">
            {recommendations.filter(r => r.stance === 'Bullish').length}
          </p>
        </div>
        <div className="card bg-accent-yellow/10 border-accent-yellow/20">
          <p className="text-text-secondary text-sm mb-2">Avg Conviction</p>
          <p className="text-3xl font-bold text-accent-yellow">
            {recommendations.length > 0
              ? Math.round(recommendations.reduce((sum, r) => sum + r.conviction_score, 0) / recommendations.length)
              : 0}
          </p>
        </div>
        <div className="card bg-accent-blue/10 border-accent-blue/20">
          <p className="text-text-secondary text-sm mb-2">High Conviction</p>
          <p className="text-3xl font-bold text-accent-blue">
            {recommendations.filter(r => r.conviction_score >= 75).length}
          </p>
        </div>
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-text-secondary">Loading recommendations...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-accent-red">Error loading recommendations: {error}</div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-text-secondary mb-4">No recommendations match your filters.</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
