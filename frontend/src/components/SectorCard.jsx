import { Link } from 'react-router-dom';

const SectorCard = ({ sector }) => {
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-accent-green';
    if (score >= 40) return 'text-accent-yellow';
    return 'text-accent-red';
  };

  const getStanceColor = (stance) => {
    if (stance === 'Bullish') return 'badge-green';
    if (stance === 'Bearish') return 'badge-red';
    return 'badge-yellow';
  };

  return (
    <Link to={`/sectors/${sector.id}`}>
      <div className="card-hover cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-text-primary">{sector.name}</h3>
          <span className={`badge ${getStanceColor(sector.stance)}`}>
            {sector.stance}
          </span>
        </div>

        <div className="flex items-baseline space-x-2 mb-3">
          <span className={`text-3xl font-bold ${getScoreColor(sector.conviction_score)}`}>
            {sector.conviction_score}
          </span>
          <span className="text-text-secondary text-sm">/ 100</span>
        </div>

        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {sector.summary}
        </p>

        <div className="flex flex-wrap gap-2">
          {sector.top_themes?.slice(0, 3).map((theme, idx) => (
            <span key={idx} className="px-2 py-1 bg-primary-hover text-text-secondary text-xs rounded">
              {theme}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default SectorCard;
