import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSectors } from '../hooks/useSectors';
import { useRecommendations } from '../hooks/useRecommendations';
import { useEconomicIndicators } from '../hooks/useEconomicIndicators';
import { isSupabaseConfigured } from '../lib/supabase';
import MacroIndicator from '../components/MacroIndicator';
import RecommendationCard from '../components/RecommendationCard';
import SectorCard from '../components/SectorCard';
import AllocationChart from '../components/AllocationChart';
import BackendUnavailableError from '../components/BackendUnavailableError';
import AIScoreBadge, { getScoreConfig } from '../components/AIScoreBadge';
import { Skeleton } from '../components/ui/skeleton';

const DashboardSkeleton = () => (
  <div className="space-y-8">
    <Skeleton className="h-40 w-full rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
    </div>
  </div>
);

const Dashboard = () => {
  const { sectors, loading: sectorsLoading, error: sectorsError } = useSectors();
  const { recommendations, loading: recsLoading, error: recsError } = useRecommendations({ minConviction: 7 });
  const { indicators, loading: indicatorsLoading, error: indicatorsError } = useEconomicIndicators();

  const loading = sectorsLoading || recsLoading || indicatorsLoading;
  const error = sectorsError || recsError || indicatorsError;

  if (loading) return <DashboardSkeleton />;

  if (error === 'backend_unavailable') return <BackendUnavailableError />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-accent-red">Error loading dashboard: {error}</div>
      </div>
    );
  }

  // Sort by AI score for display, highest first
  const sortedByScore = [...recommendations].sort((a, b) => (b.ai_score ?? 0) - (a.ai_score ?? 0));
  const screamingBuys = sortedByScore.filter(r => r.ai_score >= 85);
  const topPicks = sortedByScore.slice(0, 4);

  // Compute aggregate stats
  const avgAIScore = recommendations.length > 0
    ? Math.round(recommendations.reduce((sum, r) => sum + (r.ai_score ?? 0), 0) / recommendations.length)
    : 0;
  const avgUpside = recommendations.length > 0
    ? (recommendations.reduce((sum, r) => sum + (r.valuation_methods?.avg_return ?? r.upside_percent ?? 0), 0) / recommendations.length).toFixed(1)
    : '0';

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Supabase Live Badge */}
      {isSupabaseConfigured && (
        <div className="card bg-accent-green/10 border-accent-green/30 py-3">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <p className="text-accent-green text-sm font-medium">Live data — connected to Supabase with real-time updates</p>
          </div>
        </div>
      )}

      {/* Demo Mode Badge */}
      {!isSupabaseConfigured && (
        <div className="card bg-accent-yellow/10 border-accent-yellow/30 py-3">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-yellow animate-pulse" />
            <p className="text-accent-yellow text-sm font-medium">Demo mode — showing sample data. Connect Supabase or start the backend for live data.</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="card border-2 border-accent-blue/30">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Welcome to <span className="text-accent-blue">Alpha Oracle</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            AI-powered investment intelligence platform delivering real-time market insights,
            sector analysis, and conviction-weighted recommendations.
          </p>
        </div>
      </section>

      {/* AI Score Summary Stats */}
      {recommendations.length > 0 && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-text-secondary text-sm mb-2">Avg AI Score</p>
              <p className="text-3xl font-bold text-text-primary">{avgAIScore}<span className="text-base text-text-muted">/100</span></p>
            </div>
            <div className="card bg-accent-green/10 border-accent-green/20">
              <p className="text-text-secondary text-sm mb-2">Screaming Buys</p>
              <p className="text-3xl font-bold text-accent-green">{screamingBuys.length}</p>
            </div>
            <div className="card bg-accent-blue/10 border-accent-blue/20">
              <p className="text-text-secondary text-sm mb-2">Avg Potential Return</p>
              <p className="text-3xl font-bold text-accent-blue">+{avgUpside}%</p>
            </div>
            <div className="card">
              <p className="text-text-secondary text-sm mb-2">Total Picks</p>
              <p className="text-3xl font-bold text-text-primary">{recommendations.length}</p>
            </div>
          </div>
        </section>
      )}

      {/* Key Macro Indicators */}
      {indicators.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title mb-0">Key Macro Indicators</h2>
            <Link to="/macro" className="text-accent-blue text-sm hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {indicators.slice(0, 4).map((indicator, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <MacroIndicator indicator={indicator} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Screaming Buys Section */}
      {screamingBuys.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="section-title mb-0">🔥 Screaming Buys</h2>
              <span className="px-3 py-1 text-xs font-bold bg-accent-green/20 text-accent-green rounded-full border border-accent-green/30">
                AI Score 85+
              </span>
            </div>
            <Link to="/recommendations" className="text-accent-blue text-sm hover:underline">View All →</Link>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            High-quality businesses at attractive valuations with the strongest AI conviction scores.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {screamingBuys.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </section>
      )}

      {/* Top Recommendations */}
      {topPicks.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title mb-0">Top AI-Scored Picks</h2>
            <Link to="/recommendations" className="text-accent-blue text-sm hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {topPicks.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </section>
      )}

      {/* Sector Analysis */}
      {sectors.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title mb-0">Sector Analysis</h2>
            <Link to="/sectors" className="text-accent-blue text-sm hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.slice(0, 6).map((sector) => (
              <SectorCard key={sector.id} sector={sector} />
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="card bg-primary-hover border-accent-yellow/30">
        <div className="flex items-start space-x-3">
          <span className="text-accent-yellow text-xl">⚠️</span>
          <p className="text-text-secondary text-sm leading-relaxed">
            <strong className="text-text-primary">Disclaimer:</strong> All information provided by Alpha Oracle
            is for educational and informational purposes only. This is not financial advice. Always conduct your
            own research and consult with a qualified financial advisor before making investment decisions.
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default Dashboard;
