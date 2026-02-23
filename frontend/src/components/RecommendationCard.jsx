import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ConvictionGauge from './ConvictionGauge';
import RiskBadge from './RiskBadge';
import { Badge } from './ui/badge';

const strategyVariantMap = {
  growth: 'default',
  value: 'green',
  defensive: 'yellow',
  contrarian: 'red',
};

const RecommendationCard = ({ recommendation }) => {
  // Support both Supabase format (strategy, thesis, catalysts, upside_percent, sectors.name)
  // and legacy Python format (recommendation, rationale, tailwinds, upside_potential_pct, sector)
  const ticker = recommendation.ticker;
  const companyName = recommendation.company_name;
  const convictionScore = recommendation.conviction_score;

  // Strategy / recommendation label
  const strategy = recommendation.strategy;
  const legacyRec = recommendation.recommendation;
  const labelText = strategy
    ? strategy.toUpperCase()
    : (legacyRec || '').replace('_', ' ').toUpperCase();
  const badgeVariant = strategyVariantMap[strategy] ?? 'default';

  // Sector name
  const sectorName = recommendation.sectors?.name ?? recommendation.sector ?? '';

  // Upside
  const upside = recommendation.upside_percent ?? recommendation.upside_potential_pct;

  // Thesis / rationale
  const thesis = recommendation.thesis ?? recommendation.rationale ?? '';

  // Key drivers (catalysts or tailwinds)
  const catalysts = recommendation.catalysts ?? recommendation.tailwinds ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/recommendations/${ticker}`}>
        <div className="card-hover cursor-pointer group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-black text-text-primary group-hover:text-accent-blue transition-colors">{ticker}</h3>
                  <Badge variant={badgeVariant}>{labelText}</Badge>
                </div>
                <p className="text-text-secondary text-sm font-medium">{companyName}</p>
              </div>
              <div className="ml-4">
                <ConvictionGauge score={convictionScore} size="small" />
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-3 mb-4">
              {sectorName && (
                <span className="text-text-secondary text-sm font-medium px-3 py-1 bg-primary-bg/50 rounded-full border border-primary-border/30">{sectorName}</span>
              )}
              {upside != null && (
                <>
                  <span className="text-text-muted text-xs">•</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full border ${
                    upside > 0
                      ? 'text-accent-green bg-accent-green/10 border-accent-green/30'
                      : 'text-accent-red bg-accent-red/10 border-accent-red/30'
                  }`}>
                    Upside: {upside.toFixed(1)}%
                  </span>
                </>
              )}
              <RiskBadge riskLevel={recommendation.risk_level} />
            </div>

            <p className="text-text-secondary text-sm mb-4 line-clamp-3 leading-relaxed">{thesis}</p>

            {catalysts.length > 0 && (
              <div className="pt-4 border-t border-primary-border/50">
                <p className="text-xs text-text-muted font-semibold mb-2 uppercase tracking-wide">Key Catalysts:</p>
                <div className="flex flex-wrap gap-2">
                  {catalysts.slice(0, 3).map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-accent-green/20 to-accent-green/10 text-accent-green text-xs rounded-lg border border-accent-green/30 font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecommendationCard;
