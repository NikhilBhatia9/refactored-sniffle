const MacroIndicator = ({ indicator }) => {
  // Support both Supabase format (indicator_name, trend: up/down/stable, impact)
  // and legacy Python format (name, status: Positive/Negative/Neutral, interpretation)
  const name = indicator.indicator_name ?? indicator.name ?? '';
  const value = indicator.value;
  const unit = indicator.unit ?? '';

  // Normalise status/trend to a consistent direction string
  const rawStatus = indicator.status;
  const rawTrend = indicator.trend;
  const direction = rawStatus
    ? (rawStatus === 'Positive' || rawStatus === 'Bullish' ? 'positive' : rawStatus === 'Negative' || rawStatus === 'Bearish' ? 'negative' : 'neutral')
    : (rawTrend === 'up' ? 'positive' : rawTrend === 'down' ? 'negative' : 'neutral');

  const interpretation = indicator.interpretation ?? indicator.impact ?? indicator.summary ?? '';

  const getStatusColor = (d) => {
    if (d === 'positive') return 'text-accent-green';
    if (d === 'negative') return 'text-accent-red';
    return 'text-accent-yellow';
  };

  const getStatusBg = (d) => {
    if (d === 'positive') return 'bg-accent-green/10 border-accent-green/20';
    if (d === 'negative') return 'bg-accent-red/10 border-accent-red/20';
    return 'bg-accent-yellow/10 border-accent-yellow/20';
  };

  const getArrow = (d) => {
    if (d === 'positive') return '↗';
    if (d === 'negative') return '↘';
    return '→';
  };

  return (
    <div className={`card border ${getStatusBg(direction)}`}>
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-medium text-text-secondary">{name}</h4>
        <span className={`text-2xl ${getStatusColor(direction)}`}>{getArrow(direction)}</span>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-bold ${getStatusColor(direction)}`}>
            {value}{unit && unit !== '%' ? ` ${unit}` : unit}
          </span>
          {indicator.change != null && (
            <span className={`text-sm ${getStatusColor(direction)}`}>
              {indicator.change > 0 ? '+' : ''}{indicator.change}%
            </span>
          )}
        </div>
      </div>

      <p className="text-text-secondary text-xs leading-relaxed">{interpretation}</p>
    </div>
  );
};

export default MacroIndicator;
