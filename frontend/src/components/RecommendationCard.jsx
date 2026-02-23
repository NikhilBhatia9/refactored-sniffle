import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AIScoreBadge, { getScoreConfig } from './AIScoreBadge';
import RiskBadge from './RiskBadge';
import { Badge } from './ui/badge';

const strategyVariantMap = {
  growth: 'default',
  value: 'green',
  defensive: 'yellow',
  contrarian: 'red',
};

const MetricPill = ({ label, value, suffix = '%', positive }) => (
  <div className="flex flex-col items-center px-3 py-2 bg-primary-bg/60 rounded-lg border border-primary-border/30 min-w-[80px]">
    <span className="text-[10px] text-text-muted font-medium uppercase tracking-wide">{label}</span>
    <span className={`text-sm font-bold ${positive == null ? 'text-text-primary' : positive ? 'text-accent-green' : 'text-accent-red'}`}>
      {typeof value === 'number' ? `${value > 0 ? '+' : ''}${value.toFixed(1)}${suffix}` : value}
    </span>
  </div>
);

const RecommendationCard = ({ recommendation }) => {
  // Support both Supabase format (strategy, thesis, catalysts, upside_percent, sectors.name)
  // and legacy Python format (recommendation, rationale, tailwinds, upside_potential_pct, sector)
  const ticker = recommendation.ticker;
  const companyName = recommendation.company_name;
  const aiScore = recommendation.ai_score;

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

  // New AI metrics
  const priceFrom52w = recommendation.price_from_52w_high;
  const priceFromATH = recommendation.price_from_ath;
  const sma200 = recommendation.sma_200;
  const currentPrice = recommendation.current_price;
  const valMethods = recommendation.valuation_methods;

  const sma200Diff = sma200 && currentPrice ? ((currentPrice - sma200) / sma200 * 100) : null;

  // Score config for border glow
  const scoreConfig = aiScore != null ? getScoreConfig(aiScore) : null;

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
            {/* Header: Ticker + AI Score */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-black text-text-primary group-hover:text-accent-blue transition-colors">{ticker}</h3>
                  <Badge variant={badgeVariant}>{labelText}</Badge>
                  {aiScore >= 85 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-accent-green/20 text-accent-green border border-accent-green/40 rounded-full animate-pulse">
                      🔥 Screaming Buy
                    </span>
                  )}
                </div>
                <p className="text-text-secondary text-sm font-medium">{companyName}</p>
                {currentPrice != null && (
                  <p className="text-text-primary text-lg font-bold mt-1">${currentPrice.toFixed(2)}</p>
                )}
              </div>
              <div className="ml-4">
                <AIScoreBadge score={aiScore} />
              </div>
            </div>

            {/* Tags row */}
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

            {/* Key Price Metrics */}
            {(priceFrom52w != null || priceFromATH != null || sma200Diff != null) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {priceFrom52w != null && (
                  <MetricPill label="From 52W High" value={priceFrom52w} positive={priceFrom52w > -10} />
                )}
                {priceFromATH != null && (
                  <MetricPill label="From ATH" value={priceFromATH} positive={priceFromATH > -15} />
                )}
                {sma200Diff != null && (
                  <MetricPill label="vs 200-DMA" value={sma200Diff} positive={sma200Diff > 0} />
                )}
              </div>
            )}

            <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">{thesis}</p>

            {/* Valuation Methods Returns */}
            {valMethods && (
              <div className="pt-3 mb-3 border-t border-primary-border/50">
                <p className="text-xs text-text-muted font-semibold mb-2 uppercase tracking-wide">Potential Returns by Valuation</p>
                <div className="grid grid-cols-4 gap-2">
                  {valMethods.dcf != null && (
                    <div className="text-center px-2 py-1.5 bg-primary-bg/40 rounded-lg">
                      <p className="text-[10px] text-text-muted">DCF</p>
                      <p className={`text-xs font-bold ${valMethods.dcf > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        {valMethods.dcf > 0 ? '+' : ''}{valMethods.dcf.toFixed(1)}%
                      </p>
                    </div>
                  )}
                  {valMethods.pe_based != null && (
                    <div className="text-center px-2 py-1.5 bg-primary-bg/40 rounded-lg">
                      <p className="text-[10px] text-text-muted">P/E</p>
                      <p className={`text-xs font-bold ${valMethods.pe_based > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        {valMethods.pe_based > 0 ? '+' : ''}{valMethods.pe_based.toFixed(1)}%
                      </p>
                    </div>
                  )}
                  {valMethods.graham != null && (
                    <div className="text-center px-2 py-1.5 bg-primary-bg/40 rounded-lg">
                      <p className="text-[10px] text-text-muted">Graham</p>
                      <p className={`text-xs font-bold ${valMethods.graham > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        {valMethods.graham > 0 ? '+' : ''}{valMethods.graham.toFixed(1)}%
                      </p>
                    </div>
                  )}
                  {valMethods.avg_return != null && (
                    <div className="text-center px-2 py-1.5 bg-gradient-to-b from-accent-blue/15 to-accent-blue/5 rounded-lg border border-accent-blue/20">
                      <p className="text-[10px] text-accent-blue font-medium">Avg</p>
                      <p className={`text-xs font-bold ${valMethods.avg_return > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        {valMethods.avg_return > 0 ? '+' : ''}{valMethods.avg_return.toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {catalysts.length > 0 && (
              <div className="pt-3 border-t border-primary-border/50">
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
