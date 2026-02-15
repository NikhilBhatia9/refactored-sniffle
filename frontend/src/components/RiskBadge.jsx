const RiskBadge = ({ level }) => {
  const getRiskStyle = (level) => {
    const normalized = level.toLowerCase();
    if (normalized === 'low') return 'badge-green';
    if (normalized === 'medium' || normalized === 'moderate') return 'badge-yellow';
    if (normalized === 'high') return 'badge-red';
    return 'badge-blue';
  };

  return (
    <span className={`badge ${getRiskStyle(level)}`}>
      {level.toUpperCase()}
    </span>
  );
};

export default RiskBadge;
