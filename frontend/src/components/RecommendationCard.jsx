import { Link } from 'react-router-dom';
import ConvictionGauge from './ConvictionGauge';
import RiskBadge from './RiskBadge';

const RecommendationCard = ({ recommendation }) => {
  const getStanceColor = (stance) => {
    if (stance === 'Bullish') return 'text-accent-green';
    if (stance === 'Bearish') return 'text-accent-red';
    return 'text-accent-yellow';
  };

  return (
    <Link to={`/recommendations/${recommendation.id}`}>
      <div className="card-hover cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-text-primary">{recommendation.ticker}</h3>
              <span className={`text-lg font-semibold ${getStanceColor(recommendation.stance)}`}>
                {recommendation.stance}
              </span>
            </div>
            <p className="text-text-secondary text-sm">{recommendation.company_name}</p>
          </div>
          <ConvictionGauge score={recommendation.conviction_score} size="small" />
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <RiskBadge level={recommendation.risk_level} />
          <span className="text-text-muted text-xs">•</span>
          <span className="text-text-secondary text-sm">{recommendation.sector}</span>
          {recommendation.target_price && (
            <>
              <span className="text-text-muted text-xs">•</span>
              <span className="text-text-primary text-sm font-medium">
                Target: ${recommendation.target_price}
              </span>
            </>
          )}
        </div>

        <p className="text-text-secondary text-sm mb-4 line-clamp-3">
          {recommendation.thesis}
        </p>

        {recommendation.catalysts && recommendation.catalysts.length > 0 && (
          <div className="pt-4 border-t border-primary-border">
            <p className="text-xs text-text-muted mb-2">Key Catalysts:</p>
            <div className="flex flex-wrap gap-2">
              {recommendation.catalysts.slice(0, 3).map((catalyst, idx) => (
                <span key={idx} className="px-2 py-1 bg-accent-blue/10 text-accent-blue text-xs rounded border border-accent-blue/20">
                  {catalyst}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default RecommendationCard;
