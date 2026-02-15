const CycleIndicator = ({ cycle }) => {
  const phases = ['Early Expansion', 'Mid Expansion', 'Late Expansion', 'Early Contraction', 'Mid Contraction', 'Late Contraction'];
  
  const currentPhaseIndex = phases.findIndex(p => p.toLowerCase() === cycle.current_phase?.toLowerCase());
  const validPhaseIndex = currentPhaseIndex !== -1 ? currentPhaseIndex : 0;

  const getPhaseColor = (index) => {
    if (index === validPhaseIndex) return 'bg-accent-blue border-accent-blue';
    if (index < validPhaseIndex) return 'bg-accent-green/20 border-accent-green/40';
    return 'bg-primary-border border-primary-border';
  };

  const getPhaseLabel = (phase) => {
    return phase.replace(' ', '\n');
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-6">Market Cycle Position</h3>
      
      <div className="flex items-center justify-between mb-8">
        {phases.map((phase, index) => (
          <div key={phase} className="flex flex-col items-center flex-1">
            <div className={`w-full h-2 border-2 transition-all ${getPhaseColor(index)} ${index === validPhaseIndex ? 'animate-pulse' : ''}`}>
            </div>
            <p className={`text-xs text-center mt-2 whitespace-pre-line ${index === validPhaseIndex ? 'text-accent-blue font-semibold' : 'text-text-muted'}`}>
              {getPhaseLabel(phase)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-text-secondary text-sm mb-1">Current Phase</p>
          <p className="text-text-primary font-semibold">{cycle.current_phase}</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm mb-1">Confidence</p>
          <p className="text-accent-blue font-semibold">{cycle.confidence}%</p>
        </div>
        {cycle.expected_duration && (
          <div className="col-span-2">
            <p className="text-text-secondary text-sm mb-1">Expected Duration</p>
            <p className="text-text-primary">{cycle.expected_duration}</p>
          </div>
        )}
      </div>

      {cycle.indicators && (
        <div className="mt-6 pt-6 border-t border-primary-border">
          <p className="text-text-secondary text-sm mb-3">Key Indicators</p>
          <div className="space-y-2">
            {Object.entries(cycle.indicators).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-text-secondary capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-text-primary font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CycleIndicator;
