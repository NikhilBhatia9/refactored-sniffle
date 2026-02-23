import { motion } from 'framer-motion';

const getScoreConfig = (score) => {
  if (score >= 85) return { label: 'Screaming Buy', color: '#10b981', bg: 'from-accent-green/30 to-accent-green/10', border: 'border-accent-green/50', text: 'text-accent-green' };
  if (score >= 70) return { label: 'Strong Buy', color: '#3b82f6', bg: 'from-accent-blue/30 to-accent-blue/10', border: 'border-accent-blue/50', text: 'text-accent-blue' };
  if (score >= 55) return { label: 'Moderate Buy', color: '#f59e0b', bg: 'from-accent-yellow/30 to-accent-yellow/10', border: 'border-accent-yellow/50', text: 'text-accent-yellow' };
  return { label: 'Hold', color: '#ef4444', bg: 'from-accent-red/30 to-accent-red/10', border: 'border-accent-red/50', text: 'text-accent-red' };
};

const AIScoreBadge = ({ score, size = 'default' }) => {
  if (score == null) return null;
  const config = getScoreConfig(score);

  if (size === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${config.bg} border ${config.border}`}>
        <span className={`text-xs font-bold ${config.text}`}>{score}</span>
        <span className={`text-[10px] font-semibold ${config.text} opacity-80`}>/100</span>
      </div>
    );
  }

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      className={`flex flex-col items-center gap-1`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative" style={{ width: 80, height: 80 }}>
        <svg className="transform -rotate-90" width={80} height={80}>
          <circle cx={40} cy={40} r={radius} stroke="#1e2439" strokeWidth="6" fill="none" />
          <motion.circle
            cx={40} cy={40} r={radius}
            stroke={config.color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black text-text-primary">{score}</span>
          <span className="text-[9px] text-text-muted font-medium">/100</span>
        </div>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${config.text}`}>{config.label}</span>
    </motion.div>
  );
};

export { getScoreConfig };
export default AIScoreBadge;
