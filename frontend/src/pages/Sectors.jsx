import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSectors } from '../hooks/useSectors';
import SectorCard from '../components/SectorCard';
import BackendUnavailableError from '../components/BackendUnavailableError';
import { Skeleton } from '../components/ui/skeleton';

const SectorsSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-48 rounded" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
    </div>
  </div>
);

const Sectors = () => {
  const { sectors, loading, error } = useSectors();
  const [sortBy, setSortBy] = useState('conviction');

  const sortedSectors = [...sectors].sort((a, b) => {
    if (sortBy === 'conviction') return b.conviction_score - a.conviction_score;
    if (sortBy === 'name') return (a.name ?? '').localeCompare(b.name ?? '');
    if (sortBy === 'trend') {
      const order = { improving: 3, stable: 2, declining: 1 };
      return (order[b.trend] ?? 0) - (order[a.trend] ?? 0);
    }
    return 0;
  });

  if (loading) return <SectorsSkeleton />;

  if (error === 'backend_unavailable') return <BackendUnavailableError />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-accent-red">Error loading sectors: {error}</div>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Sector Analysis</h1>
          <p className="text-text-secondary">
            AI-powered conviction scores and investment outlooks across all major sectors
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="text-text-secondary text-sm">Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input w-auto">
            <option value="conviction">Conviction Score</option>
            <option value="name">Name</option>
            <option value="trend">Trend</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-text-secondary text-sm mb-2">Total Sectors</p>
          <p className="text-3xl font-bold text-text-primary">{sectors.length}</p>
        </div>
        <div className="card bg-accent-green/10 border-accent-green/20">
          <p className="text-text-secondary text-sm mb-2">Improving</p>
          <p className="text-3xl font-bold text-accent-green">
            {sectors.filter(s => s.trend === 'improving').length}
          </p>
        </div>
        <div className="card bg-accent-yellow/10 border-accent-yellow/20">
          <p className="text-text-secondary text-sm mb-2">Stable</p>
          <p className="text-3xl font-bold text-accent-yellow">
            {sectors.filter(s => s.trend === 'stable').length}
          </p>
        </div>
        <div className="card bg-accent-red/10 border-accent-red/20">
          <p className="text-text-secondary text-sm mb-2">Declining</p>
          <p className="text-3xl font-bold text-accent-red">
            {sectors.filter(s => s.trend === 'declining').length}
          </p>
        </div>
      </div>

      {/* Sector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSectors.map((sector) => (
          <SectorCard key={sector.id} sector={sector} />
        ))}
      </div>

      {sectors.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-text-secondary">No sectors available at this time.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Sectors;
