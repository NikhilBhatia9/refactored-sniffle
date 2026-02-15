import { Link } from 'react-router-dom';

const SectorCard = ({ sector }) => {
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-accent-green';
    if (score >= 40) return 'text-accent-yellow';
    return 'text-accent-red';
  };

  const getOutlookColor = (outlook) => {
    if (outlook === 'bullish') return 'badge-green';
    if (outlook === 'bearish') return 'badge-red';
    return 'badge-yellow';
  };

  return (
    <Link to={`/sectors/${sector.sector.toLowerCase().replace(/ /g, '-')}`}>
      <div className="card-hover cursor-pointer group">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-blue transition-colors">{sector.sector}</h3>
          <span className={`badge ${getOutlookColor(sector.outlook)}`}>
            {sector.outlook.toUpperCase()}
          </span>
        </div>

        <div className="flex items-baseline space-x-3 mb-4">
          <span className={`text-4xl font-black ${getScoreColor(sector.score)}`}>
            {sector.score}
          </span>
          <span className="text-text-secondary text-sm font-medium">/ 100</span>
          <div className="flex-1 ml-4">
            <div className="h-2 bg-primary-bg rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  sector.score >= 70 ? 'bg-gradient-to-r from-accent-green to-emerald-400' : 
                  sector.score >= 40 ? 'bg-gradient-to-r from-accent-yellow to-amber-400' : 
                  'bg-gradient-to-r from-accent-red to-red-400'
                }`}
                style={{ width: `${sector.score}%` }}
              ></div>
            </div>
          </div>
        </div>

        <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
          {sector.rationale}
        </p>

        <div className="flex flex-wrap gap-2">
          {sector.top_picks?.slice(0, 3).map((pick, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-primary-hover to-primary-bg text-accent-blue text-xs rounded-lg border border-accent-blue/30 font-bold">
              {pick}
            </span>
          ))}
        </div>
        
        {sector.trend && (
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-xs text-text-muted uppercase tracking-wide">Trend:</span>
            <span className={`text-xs font-semibold ${
              sector.trend === 'improving' ? 'text-accent-green' : 
              sector.trend === 'declining' ? 'text-accent-red' : 
              'text-text-secondary'
            }`}>
              {sector.trend === 'improving' ? '↑' : sector.trend === 'declining' ? '↓' : '→'} {sector.trend}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SectorCard;
