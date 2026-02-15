const ConvictionGauge = ({ score, size = 'large' }) => {
  const getColor = (score) => {
    if (score >= 75) return '#10b981'; // green
    if (score >= 60) return '#3b82f6'; // blue
    if (score >= 40) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getLabel = (score) => {
    if (score >= 75) return 'High';
    if (score >= 60) return 'Strong';
    if (score >= 40) return 'Moderate';
    return 'Low';
  };

  const color = getColor(score);
  const label = getLabel(score);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  const dimensions = size === 'small' ? { width: 60, height: 60, text: 'text-sm' } : { width: 100, height: 100, text: 'text-xl' };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
        <svg className="transform -rotate-90" width={dimensions.width} height={dimensions.height}>
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r="36"
            stroke="#1e2439"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r="36"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${dimensions.text} font-bold text-text-primary`}>{score}</span>
          {size === 'large' && (
            <span className="text-xs text-text-secondary">{label}</span>
          )}
        </div>
      </div>
      {size === 'small' && (
        <span className="text-xs text-text-secondary mt-1">{label}</span>
      )}
    </div>
  );
};

export default ConvictionGauge;
