const MacroIndicator = ({ indicator }) => {
  const getStatusColor = (status) => {
    if (status === 'Positive' || status === 'Bullish') return 'text-accent-green';
    if (status === 'Negative' || status === 'Bearish') return 'text-accent-red';
    return 'text-accent-yellow';
  };

  const getStatusBg = (status) => {
    if (status === 'Positive' || status === 'Bullish') return 'bg-accent-green/10 border-accent-green/20';
    if (status === 'Negative' || status === 'Bearish') return 'bg-accent-red/10 border-accent-red/20';
    return 'bg-accent-yellow/10 border-accent-yellow/20';
  };

  const getArrowIcon = (status) => {
    if (status === 'Positive' || status === 'Bullish') return '↗';
    if (status === 'Negative' || status === 'Bearish') return '↘';
    return '→';
  };

  return (
    <div className={`card border ${getStatusBg(indicator.status)}`}>
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-medium text-text-secondary">{indicator.name}</h4>
        <span className={`text-2xl ${getStatusColor(indicator.status)}`}>
          {getArrowIcon(indicator.status)}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-bold ${getStatusColor(indicator.status)}`}>
            {indicator.value}
          </span>
          {indicator.change && (
            <span className={`text-sm ${getStatusColor(indicator.status)}`}>
              {indicator.change > 0 ? '+' : ''}{indicator.change}%
            </span>
          )}
        </div>
      </div>

      <p className="text-text-secondary text-xs leading-relaxed">
        {indicator.interpretation || indicator.summary}
      </p>
    </div>
  );
};

export default MacroIndicator;
