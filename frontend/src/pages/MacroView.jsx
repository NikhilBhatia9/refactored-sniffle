import { motion } from 'framer-motion';
import { useEconomicIndicators } from '../hooks/useEconomicIndicators';
import MacroIndicator from '../components/MacroIndicator';
import CycleIndicator from '../components/CycleIndicator';
import BackendUnavailableError from '../components/BackendUnavailableError';
import { Skeleton } from '../components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MacroSkeleton = () => (
  <div className="space-y-8">
    <Skeleton className="h-10 w-64 rounded" />
    <Skeleton className="h-32 w-full rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
    </div>
  </div>
);

const MacroView = () => {
  const { indicators, loading, error } = useEconomicIndicators();

  if (loading) return <MacroSkeleton />;

  if (error === 'backend_unavailable') return <BackendUnavailableError />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-accent-red">Error loading macro data: {error}</div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card px-3 py-2">
          {payload.map((entry, index) => (
            <div key={index}>
              <p className="text-text-secondary text-sm">{entry.name}</p>
              <p className="text-text-primary font-semibold">{entry.value}</p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Macro Economic View</h1>
        <p className="text-text-secondary">
          Comprehensive analysis of macroeconomic indicators and market cycles
        </p>
      </div>

      {/* Economic Indicators */}
      {indicators.length > 0 && (
        <section>
          <h2 className="section-title">Key Economic Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indicators.map((indicator, idx) => (
              <motion.div
                key={indicator.id ?? idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <MacroIndicator indicator={indicator} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {indicators.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-text-secondary">No economic indicators available at this time.</p>
        </div>
      )}
    </motion.div>
  );
};

export default MacroView;
