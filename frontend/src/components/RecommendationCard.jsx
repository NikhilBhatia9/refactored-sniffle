import { Link } from 'react-router-dom';
import ConvictionGauge from './ConvictionGauge';
import RiskBadge from './RiskBadge';

const RecommendationCard = ({ recommendation }) => {
  const getStanceColor = (recommendation) => {
    if (recommendation === 'strong_buy' || recommendation === 'buy') return 'text-accent-green';
    if (recommendation === 'strong_sell' || recommendation === 'sell') return 'text-accent-red';
    return 'text-accent-yellow';
  };

  return (
    <Link to={`/recommendations/${recommendation.ticker}`}>
      <div className="card-hover cursor-pointer group overflow-hidden relative">
        {/* Gradient overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-2xl font-black text-text-primary group-hover:text-accent-blue transition-colors">{recommendation.ticker}</h3>
                <span className={`text-lg font-bold ${getStanceColor(recommendation.recommendation)}`}>
                  {(recommendation.recommendation || '').replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-text-secondary text-sm font-medium">{recommendation.company_name}</p>
            </div>
            <div className="ml-4">
              <ConvictionGauge score={recommendation.conviction_score} size="small" />
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-3 mb-4">
            <span className="text-text-secondary text-sm font-medium px-3 py-1 bg-primary-bg/50 rounded-full border border-primary-border/30">{recommendation.sector}</span>
            {recommendation.upside_potential_pct && (
              <>
                <span className="text-text-muted text-xs">•</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full border ${
                  recommendation.upside_potential_pct > 0 
                    ? 'text-accent-green bg-accent-green/10 border-accent-green/30' 
                    : 'text-accent-red bg-accent-red/10 border-accent-red/30'
                }`}>
                  Upside: {recommendation.upside_potential_pct.toFixed(1)}%
                </span>
              </>
            )}
          </div>

          <p className="text-text-secondary text-sm mb-4 line-clamp-3 leading-relaxed">
            {recommendation.rationale}
          </p>

          {recommendation.tailwinds && recommendation.tailwinds.length > 0 && (
            <div className="pt-4 border-t border-primary-border/50">
              <p className="text-xs text-text-muted font-semibold mb-2 uppercase tracking-wide">Key Tailwinds:</p>
              <div className="flex flex-wrap gap-2">
                {recommendation.tailwinds.slice(0, 3).map((tailwind, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-accent-green/20 to-accent-green/10 text-accent-green text-xs rounded-lg border border-accent-green/30 font-semibold">
                    {tailwind}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecommendationCard;
