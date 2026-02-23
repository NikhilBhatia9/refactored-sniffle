import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';

const SectorCard = ({ sector }) => {
  // Support both Supabase format (conviction_score 0-10, trend, name) and
  // legacy Python format (score 0-100, outlook, sector)
  const name = sector.name ?? sector.sector ?? '';
  const score = sector.conviction_score != null
    ? Math.round(sector.conviction_score * 10)  // Supabase: 0-10 → display 0-100
    : sector.score ?? 0;
  const trend = sector.trend ?? (sector.outlook === 'bullish' ? 'improving' : sector.outlook === 'bearish' ? 'declining' : 'stable');
  const thesis = sector.thesis ?? sector.rationale ?? '';
  const tailwinds = sector.tailwinds ?? sector.top_picks ?? [];

  const getScoreColor = (s) => {
    if (s >= 70) return 'text-accent-green';
    if (s >= 40) return 'text-accent-yellow';
    return 'text-accent-red';
  };

  const trendBadgeVariant = trend === 'improving' ? 'green' : trend === 'declining' ? 'red' : 'yellow';
  const trendLabel = trend === 'improving' ? '↑ Improving' : trend === 'declining' ? '↓ Declining' : '→ Stable';

  const slug = name.toLowerCase().replace(/ /g, '-');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/sectors/${slug}`}>
        <div className="card-hover cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-blue transition-colors">{name}</h3>
            <Badge variant={trendBadgeVariant}>{trendLabel}</Badge>
          </div>

          <div className="flex items-baseline space-x-3 mb-4">
            <span className={`text-4xl font-black ${getScoreColor(score)}`}>{score}</span>
            <span className="text-text-secondary text-sm font-medium">/ 100</span>
            <div className="flex-1 ml-4">
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

          <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">{thesis}</p>

          {tailwinds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tailwinds.slice(0, 3).map((item, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-primary-hover to-primary-bg text-accent-blue text-xs rounded-lg border border-accent-blue/30 font-bold">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default SectorCard;
