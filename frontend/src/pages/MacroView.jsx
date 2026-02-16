import { useState, useEffect } from 'react';
import { getMacro, getMarketCycle, getGeopoliticalRisks } from '../services/api';
import MacroIndicator from '../components/MacroIndicator';
import CycleIndicator from '../components/CycleIndicator';
import BackendUnavailableError from '../components/BackendUnavailableError';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MacroView = () => {
  const [macro, setMacro] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [macroRes, cycleRes, risksRes] = await Promise.all([
          getMacro(),
          getMarketCycle(),
          getGeopoliticalRisks(),
        ]);
        setMacro(macroRes.data);
        setCycle(cycleRes.data);
        setRisks(risksRes.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
          setError('backend_unavailable');
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-text-secondary">Loading macro data...</div>
      </div>
    );
  }

  if (error) {
    if (error === 'backend_unavailable') {
      return <BackendUnavailableError />;
    }
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-accent-red">Error loading macro data: {error}</div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card px-3 py-2">
          {payload.map((entry, index) => (
            <div key={index}>
              <p className="text-text-secondary text-sm">{entry.name}</p>
              <p className="text-text-primary font-semibold">{entry.value}</p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Macro Economic View</h1>
        <p className="text-text-secondary">
          Comprehensive analysis of macroeconomic indicators and market cycles
        </p>
      </div>

      {/* Market Cycle */}
      {cycle && (
        <section>
          <CycleIndicator cycle={cycle} />
        </section>
      )}

      {/* Macro Indicators */}
      {macro?.indicators && macro.indicators.length > 0 && (
        <section>
          <h2 className="section-title">Key Economic Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {macro.indicators.map((indicator, idx) => (
              <MacroIndicator key={idx} indicator={indicator} />
            ))}
          </div>
        </section>
      )}

      {/* Economic Summary */}
      {macro?.summary && (
        <section>
          <h2 className="section-title">Economic Outlook</h2>
          <div className="card">
            <div className="prose prose-invert max-w-none">
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {macro.summary}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Historical Trends Chart */}
      {macro?.historical_data && (
        <section>
          <h2 className="section-title">Historical Trends</h2>
          <div className="card">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={macro.historical_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2439" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="gdp" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="inflation" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="unemployment" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Geopolitical Risks */}
      {risks && risks.length > 0 && (
        <section>
          <h2 className="section-title">Geopolitical Risk Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {risks.map((risk, idx) => (
              <div key={idx} className="card border-accent-red/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary mb-1">{risk.region}</h3>
                    <p className="text-text-secondary text-sm">{risk.event || risk.description}</p>
                  </div>
                  <span className={`badge ${
                    risk.severity === 'High' ? 'badge-red' :
                    risk.severity === 'Medium' ? 'badge-yellow' :
                    'badge-blue'
                  }`}>
                    {risk.severity}
                  </span>
                </div>

                {risk.impact && (
                  <div className="mb-4">
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {risk.impact}
                    </p>
                  </div>
                )}

                {risk.affected_sectors && risk.affected_sectors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-text-muted mb-2">Affected Sectors:</p>
                    <div className="flex flex-wrap gap-2">
                      {risk.affected_sectors.map((sector, sidx) => (
                        <span key={sidx} className="px-2 py-1 bg-accent-red/10 text-accent-red text-xs rounded">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {risk.probability && (
                  <div className="pt-4 border-t border-primary-border">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary text-sm">Probability</span>
                      <span className="text-text-primary font-semibold">{risk.probability}%</span>
                    </div>
                    <div className="mt-2 h-2 bg-primary-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-red rounded-full transition-all"
                        style={{ width: `${risk.probability}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Central Bank Policy */}
      {macro?.central_bank_policy && (
        <section>
          <h2 className="section-title">Central Bank Policy</h2>
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-text-secondary text-sm mb-2">Current Stance</p>
                <p className="text-xl font-bold text-text-primary">
                  {macro.central_bank_policy.stance}
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-sm mb-2">Interest Rate</p>
                <p className="text-xl font-bold text-accent-blue">
                  {macro.central_bank_policy.rate}%
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-sm mb-2">Next Meeting</p>
                <p className="text-xl font-bold text-text-primary">
                  {macro.central_bank_policy.next_meeting}
                </p>
              </div>
            </div>
            {macro.central_bank_policy.outlook && (
              <div className="mt-6 pt-6 border-t border-primary-border">
                <p className="text-text-secondary leading-relaxed">
                  {macro.central_bank_policy.outlook}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default MacroView;
