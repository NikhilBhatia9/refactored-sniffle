import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from 'recharts';
import { useSectors } from '../hooks/useSectors';
import SectorCard from '../components/SectorCard';
import BackendUnavailableError from '../components/BackendUnavailableError';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';

const TABS = ['Overview', 'Heatmap', 'Compare'];

const getDisplayScore = (convictionScore) => Math.round((convictionScore ?? 0) * 10);
const DIMENSION_SCALE = 25; // each tailwind/headwind contributes 25 pts on a 0-100 scale

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

/* ── Heatmap Tab ─────────────────────────────────────────────── */
const SectorHeatmap = ({ sectors }) => {
  if (sectors.length === 0) return null;
  const maxScore = Math.max(...sectors.map(s => s.conviction_score));
  const getColor = (score) => {
    const pct = score / maxScore;
    if (pct >= 0.8) return 'from-accent-green/80 to-emerald-600/60';
    if (pct >= 0.6) return 'from-accent-green/50 to-emerald-500/30';
    if (pct >= 0.4) return 'from-accent-yellow/50 to-amber-500/30';
    return 'from-accent-red/50 to-red-500/30';
  };
  const getBorder = (score) => {
    const pct = score / maxScore;
    if (pct >= 0.8) return 'border-accent-green/40';
    if (pct >= 0.6) return 'border-accent-green/20';
    if (pct >= 0.4) return 'border-accent-yellow/30';
    return 'border-accent-red/30';
  };
  const sorted = [...sectors].sort((a, b) => b.conviction_score - a.conviction_score);
  const getBarColor = (score) => {
    const ds = getDisplayScore(score);
    return ds >= 70 ? '#10b981' : ds >= 40 ? '#f59e0b' : '#ef4444';
  };

  return (
    <div className="space-y-4">
      <p className="text-text-secondary text-sm">Sectors sized by conviction score — greener is stronger</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {sorted.map((s) => (
          <motion.div
            key={s.id}
            whileHover={{ scale: 1.04 }}
            className={`relative bg-gradient-to-br ${getColor(s.conviction_score)} border ${getBorder(s.conviction_score)} rounded-xl p-4 cursor-pointer transition-shadow hover:shadow-lg`}
            style={{ minHeight: `${80 + s.conviction_score * 12}px` }}
          >
            <p className="text-text-primary font-bold text-sm">{s.name}</p>
            <p className="text-3xl font-black text-text-primary/90 mt-1">{getDisplayScore(s.conviction_score)}</p>
            <Badge
              variant={s.trend === 'improving' ? 'green' : s.trend === 'declining' ? 'red' : 'yellow'}
              className="mt-2 text-[10px]"
            >
              {s.trend === 'improving' ? '↑' : s.trend === 'declining' ? '↓' : '→'} {s.trend}
            </Badge>
            {s.cycle_phase && (
              <p className="text-text-muted text-[10px] mt-1">{s.cycle_phase}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Conviction bar chart */}
      <div className="card mt-6">
        <h3 className="text-text-primary font-bold mb-4">Conviction Scores Comparison</h3>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={sorted.map(s => ({ name: s.name, score: getDisplayScore(s.conviction_score) }))} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2439" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#e5e7eb', fontSize: 12 }} width={130} />
              <Tooltip
                contentStyle={{ backgroundColor: '#131829', border: '1px solid #1e2439', borderRadius: 8 }}
                labelStyle={{ color: '#e5e7eb' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {sorted.map((s, i) => (
                  <Cell key={s.id} fill={getBarColor(s.conviction_score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/* ── Compare Tab (Radar) ─────────────────────────────────────── */
const SectorCompare = ({ sectors }) => {
  const [selected, setSelected] = useState(() => sectors.slice(0, 3).map(s => s.id));

  useEffect(() => {
    setSelected(prev => {
      const validIds = new Set(sectors.map(s => s.id));
      const filtered = prev.filter(id => validIds.has(id));
      return filtered.length > 0 ? filtered : sectors.slice(0, 3).map(s => s.id);
    });
  }, [sectors]);

  const toggleSector = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

  const radarData = useMemo(() => {
    const dims = [
      { key: 'conviction', label: 'Conviction', calc: s => getDisplayScore(s.conviction_score) },
      { key: 'tailwinds', label: 'Tailwinds', calc: s => Math.min((s.tailwinds?.length ?? 0) * DIMENSION_SCALE, 100) },
      { key: 'headwinds', label: 'Risk (inv)', calc: s => Math.max(100 - (s.headwinds?.length ?? 0) * DIMENSION_SCALE, 10) },
      { key: 'momentum', label: 'Momentum', calc: s => s.trend === 'improving' ? 90 : s.trend === 'stable' ? 60 : 30 },
    ];
    return dims.map(d => {
      const point = { dimension: d.label };
      sectors.filter(s => selected.includes(s.id)).forEach(s => {
        point[s.name] = Math.round(d.calc(s));
      });
      return point;
    });
  }, [sectors, selected]);

  const selectedSectors = sectors.filter(s => selected.includes(s.id));

  return (
    <div className="space-y-4">
      <p className="text-text-secondary text-sm">Select sectors to compare side-by-side</p>

      {/* Sector toggle chips */}
      <div className="flex flex-wrap gap-2">
        {sectors.map((s, i) => (
          <button
            key={s.id}
            onClick={() => toggleSector(s.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              selected.includes(s.id)
                ? 'bg-accent-blue/20 border-accent-blue/40 text-accent-blue'
                : 'bg-primary-hover border-primary-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {selected.length >= 2 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="card">
            <h3 className="text-text-primary font-bold mb-4">Multi-Dimension Comparison</h3>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e2439" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                  {selectedSectors.map((s, i) => (
                    <Radar
                      key={s.id}
                      name={s.name}
                      dataKey={s.name}
                      stroke={COLORS[i % COLORS.length]}
                      fill={COLORS[i % COLORS.length]}
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  ))}
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131829', border: '1px solid #1e2439', borderRadius: 8 }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-side comparison table */}
          <div className="card overflow-x-auto">
            <h3 className="text-text-primary font-bold mb-4">Side-by-Side Details</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary-border">
                  <th className="text-left text-text-secondary py-2 pr-4">Metric</th>
                  {selectedSectors.map((s, i) => (
                    <th key={s.id} className="text-left py-2 px-2" style={{ color: COLORS[i % COLORS.length] }}>
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-text-primary">
                <tr className="border-b border-primary-border/50">
                  <td className="py-2 pr-4 text-text-secondary">Conviction</td>
                  {selectedSectors.map(s => (
                    <td key={s.id} className="py-2 px-2 font-bold">{getDisplayScore(s.conviction_score)}/100</td>
                  ))}
                </tr>
                <tr className="border-b border-primary-border/50">
                  <td className="py-2 pr-4 text-text-secondary">Trend</td>
                  {selectedSectors.map(s => (
                    <td key={s.id} className="py-2 px-2 capitalize">{s.trend}</td>
                  ))}
                </tr>
                <tr className="border-b border-primary-border/50">
                  <td className="py-2 pr-4 text-text-secondary">Cycle Phase</td>
                  {selectedSectors.map(s => (
                    <td key={s.id} className="py-2 px-2">{s.cycle_phase ?? '—'}</td>
                  ))}
                </tr>
                <tr className="border-b border-primary-border/50">
                  <td className="py-2 pr-4 text-text-secondary">Tailwinds</td>
                  {selectedSectors.map(s => (
                    <td key={s.id} className="py-2 px-2">{s.tailwinds?.length ?? 0}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-text-secondary">Headwinds</td>
                  {selectedSectors.map(s => (
                    <td key={s.id} className="py-2 px-2">{s.headwinds?.length ?? 0}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-text-secondary">Select at least 2 sectors to compare.</p>
        </div>
      )}
    </div>
  );
};

/* ── Sector Detail View ──────────────────────────────────────── */
const SectorDetail = ({ sector, onBack }) => {
  const score = getDisplayScore(sector.conviction_score);
  const getScoreColor = (s) => {
    if (s >= 70) return 'text-accent-green';
    if (s >= 40) return 'text-accent-yellow';
    return 'text-accent-red';
  };
  const trendBadgeVariant = sector.trend === 'improving' ? 'green' : sector.trend === 'declining' ? 'red' : 'yellow';
  const trendLabel = sector.trend === 'improving' ? '↑ Improving' : sector.trend === 'declining' ? '↓ Declining' : '→ Stable';

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back + Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-primary-hover text-text-secondary hover:text-text-primary border border-primary-border transition-colors text-sm"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{sector.name}</h1>
          <div className="flex items-center space-x-3 mt-1">
            <Badge variant={trendBadgeVariant}>{trendLabel}</Badge>
            {sector.cycle_phase && (
              <Badge variant="secondary">{sector.cycle_phase}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Score + Thesis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex flex-col items-center justify-center">
          <p className="text-text-secondary text-sm mb-2">Conviction Score</p>
          <span className={`text-6xl font-black ${getScoreColor(score)}`}>{score}</span>
          <span className="text-text-muted text-sm mt-1">/ 100</span>
          <div className="w-full mt-3">
            <div className="h-2 bg-primary-bg rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  score >= 70 ? 'bg-gradient-to-r from-accent-green to-emerald-400' :
                  score >= 40 ? 'bg-gradient-to-r from-accent-yellow to-amber-400' :
                  'bg-gradient-to-r from-accent-red to-red-400'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

        <div className="card md:col-span-2">
          <h3 className="text-text-primary font-bold mb-2">Investment Thesis</h3>
          <p className="text-text-secondary leading-relaxed">{sector.thesis}</p>
        </div>
      </div>

      {/* Tailwinds & Headwinds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-accent-green font-bold mb-3 flex items-center">
            <span className="mr-2">🌿</span> Tailwinds
          </h3>
          <ul className="space-y-2">
            {(sector.tailwinds ?? []).map((t) => (
              <li key={t} className="flex items-start space-x-2">
                <span className="text-accent-green mt-0.5">▸</span>
                <span className="text-text-secondary text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="text-accent-red font-bold mb-3 flex items-center">
            <span className="mr-2">⚠️</span> Headwinds
          </h3>
          <ul className="space-y-2">
            {(sector.headwinds ?? []).map((h) => (
              <li key={h} className="flex items-start space-x-2">
                <span className="text-accent-red mt-0.5">▸</span>
                <span className="text-text-secondary text-sm">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Sectors Page ───────────────────────────────────────── */
const Sectors = () => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const { sectors, loading, error } = useSectors();
  const [sortBy, setSortBy] = useState('conviction');
  const [activeTab, setActiveTab] = useState('Overview');

  const sortedSectors = useMemo(() => [...sectors].sort((a, b) => {
    if (sortBy === 'conviction') return b.conviction_score - a.conviction_score;
    if (sortBy === 'name') return (a.name ?? '').localeCompare(b.name ?? '');
    if (sortBy === 'trend') {
      const order = { improving: 3, stable: 2, declining: 1 };
      return (order[b.trend] ?? 0) - (order[a.trend] ?? 0);
    }
    return 0;
  }), [sectors, sortBy]);

  // Resolve detail view from route param
  const detailSector = useMemo(() => {
    if (!routeId || sectors.length === 0) return null;
    return sectors.find(s => {
      const slug = (s.name ?? '').toLowerCase().replace(/ /g, '-');
      return slug === routeId || s.id === routeId;
    }) ?? null;
  }, [routeId, sectors]);

  if (loading) return <SectorsSkeleton />;
  if (error === 'backend_unavailable') return <BackendUnavailableError />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-accent-red">Error loading sectors: {error}</div>
      </div>
    );
  }

  // Detail view
  if (detailSector) {
    return <SectorDetail sector={detailSector} onBack={() => navigate('/sectors')} />;
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Sector Analysis</h1>
          <p className="text-text-secondary">
            AI-powered conviction scores and investment outlooks across all major sectors
          </p>
        </div>
        {activeTab === 'Overview' && (
          <div className="flex items-center space-x-3">
            <label className="text-text-secondary text-sm">Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input w-auto">
              <option value="conviction">Conviction Score</option>
              <option value="name">Name</option>
              <option value="trend">Trend</option>
            </select>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Tabs */}
      <div className="flex space-x-1 bg-primary-hover rounded-lg p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-accent-blue text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <>
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
        </>
      )}

      {activeTab === 'Heatmap' && <SectorHeatmap sectors={sectors} />}

      {activeTab === 'Compare' && <SectorCompare sectors={sectors} />}
    </motion.div>
  );
};

export default Sectors;
