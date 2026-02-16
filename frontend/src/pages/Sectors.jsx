import { useState, useEffect } from 'react';
import { getSectors } from '../services/api';
import SectorCard from '../components/SectorCard';
import BackendUnavailableError from '../components/BackendUnavailableError';

const Sectors = () => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('conviction');

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await getSectors();
        setSectors(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
          setError('backend_unavailable');
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    };
    fetchSectors();
  }, []);

  const sortedSectors = [...sectors].sort((a, b) => {
    if (sortBy === 'conviction') {
      return b.conviction_score - a.conviction_score;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'stance') {
      const stanceOrder = { Bullish: 3, Neutral: 2, Bearish: 1 };
      return (stanceOrder[b.stance] || 0) - (stanceOrder[a.stance] || 0);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-text-secondary">Loading sectors...</div>
      </div>
    );
  }

  if (error) {
    if (error === 'backend_unavailable') {
      return <BackendUnavailableError />;
    }
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-accent-red">Error loading sectors: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Sector Analysis</h1>
          <p className="text-text-secondary">
            AI-powered conviction scores and investment outlooks across all major sectors
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-text-secondary text-sm">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input w-auto"
          >
            <option value="conviction">Conviction Score</option>
            <option value="name">Name</option>
            <option value="stance">Stance</option>
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
          <p className="text-text-secondary text-sm mb-2">Bullish</p>
          <p className="text-3xl font-bold text-accent-green">
            {sectors.filter(s => s.stance === 'Bullish').length}
          </p>
        </div>
        <div className="card bg-accent-yellow/10 border-accent-yellow/20">
          <p className="text-text-secondary text-sm mb-2">Neutral</p>
          <p className="text-3xl font-bold text-accent-yellow">
            {sectors.filter(s => s.stance === 'Neutral').length}
          </p>
        </div>
        <div className="card bg-accent-red/10 border-accent-red/20">
          <p className="text-text-secondary text-sm mb-2">Bearish</p>
          <p className="text-3xl font-bold text-accent-red">
            {sectors.filter(s => s.stance === 'Bearish').length}
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
    </div>
  );
};

export default Sectors;
