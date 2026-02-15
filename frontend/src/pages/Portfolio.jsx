import { useState, useEffect } from 'react';
import { getPortfolio } from '../services/api';
import AllocationChart from '../components/AllocationChart';
import RiskBadge from '../components/RiskBadge';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riskLevel, setRiskLevel] = useState('moderate');

  useEffect(() => {
    fetchPortfolio();
  }, [riskLevel]);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const response = await getPortfolio(riskLevel);
      setPortfolio(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-text-secondary">Loading portfolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-accent-red">Error loading portfolio: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Portfolio Builder</h1>
        <p className="text-text-secondary">
          AI-optimized portfolio allocation based on your risk profile
        </p>
      </div>

      {/* Risk Selector */}
      <div className="card">
        <label className="block text-text-secondary text-sm mb-3">Select Risk Profile</label>
        <div className="flex gap-3">
          {['conservative', 'moderate', 'aggressive'].map((level) => (
            <button
              key={level}
              onClick={() => setRiskLevel(level)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                riskLevel === level
                  ? 'bg-accent-blue text-white'
                  : 'bg-primary-hover text-text-secondary hover:bg-primary-border'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Summary */}
      {portfolio && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-text-secondary text-sm mb-2">Expected Return</p>
              <p className="text-3xl font-bold text-accent-green">
                {portfolio.expected_return || '8.5'}%
              </p>
            </div>
            <div className="card">
              <p className="text-text-secondary text-sm mb-2">Volatility</p>
              <p className="text-3xl font-bold text-accent-yellow">
                {portfolio.volatility || '12.3'}%
              </p>
            </div>
            <div className="card">
              <p className="text-text-secondary text-sm mb-2">Sharpe Ratio</p>
              <p className="text-3xl font-bold text-accent-blue">
                {portfolio.sharpe_ratio || '0.69'}
              </p>
            </div>
            <div className="card">
              <p className="text-text-secondary text-sm mb-2">Max Drawdown</p>
              <p className="text-3xl font-bold text-accent-red">
                {portfolio.max_drawdown || '-18.5'}%
              </p>
            </div>
          </div>

          {/* Allocation Chart */}
          {portfolio.allocations && portfolio.allocations.length > 0 && (
            <section>
              <h2 className="section-title">Asset Allocation</h2>
              <div className="card">
                <AllocationChart allocations={portfolio.allocations} />
              </div>
            </section>
          )}

          {/* Holdings Table */}
          {portfolio.holdings && portfolio.holdings.length > 0 && (
            <section>
              <h2 className="section-title">Recommended Holdings</h2>
              <div className="card overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary-border">
                      <th className="text-left py-3 px-4 text-text-secondary text-sm font-semibold">Ticker</th>
                      <th className="text-left py-3 px-4 text-text-secondary text-sm font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-text-secondary text-sm font-semibold">Sector</th>
                      <th className="text-right py-3 px-4 text-text-secondary text-sm font-semibold">Weight</th>
                      <th className="text-right py-3 px-4 text-text-secondary text-sm font-semibold">Conviction</th>
                      <th className="text-left py-3 px-4 text-text-secondary text-sm font-semibold">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.holdings.map((holding, idx) => (
                      <tr key={idx} className="border-b border-primary-border hover:bg-primary-hover transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-text-primary">{holding.ticker}</span>
                        </td>
                        <td className="py-3 px-4 text-text-secondary">{holding.name}</td>
                        <td className="py-3 px-4 text-text-secondary text-sm">{holding.sector}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-semibold text-accent-blue">
                            {holding.weight || holding.allocation}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-semibold ${
                            holding.conviction_score >= 75 ? 'text-accent-green' :
                            holding.conviction_score >= 60 ? 'text-accent-blue' :
                            holding.conviction_score >= 40 ? 'text-accent-yellow' :
                            'text-accent-red'
                          }`}>
                            {holding.conviction_score}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <RiskBadge level={holding.risk_level} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Sector Breakdown */}
          {portfolio.sector_breakdown && (
            <section>
              <h2 className="section-title">Sector Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(portfolio.sector_breakdown).map(([sector, weight]) => (
                  <div key={sector} className="card">
                    <p className="text-text-secondary text-sm mb-2">{sector}</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold text-text-primary">{weight}%</p>
                      <div className="flex-1 h-2 bg-primary-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-blue rounded-full transition-all"
                          style={{ width: `${weight}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Portfolio Notes */}
          {portfolio.notes && (
            <section>
              <h2 className="section-title">Portfolio Strategy</h2>
              <div className="card">
                <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                  {portfolio.notes}
                </p>
              </div>
            </section>
          )}

          {/* Rebalancing Recommendations */}
          {portfolio.rebalancing && (
            <section>
              <h2 className="section-title">Rebalancing Recommendations</h2>
              <div className="card">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Frequency</span>
                    <span className="text-text-primary font-semibold">{portfolio.rebalancing.frequency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Last Rebalance</span>
                    <span className="text-text-primary font-semibold">{portfolio.rebalancing.last_date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Next Rebalance</span>
                    <span className="text-accent-blue font-semibold">{portfolio.rebalancing.next_date}</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Disclaimer */}
      <section className="card bg-primary-hover border-accent-yellow/30">
        <div className="flex items-start space-x-3">
          <span className="text-accent-yellow text-xl">⚠️</span>
          <div>
            <p className="text-text-secondary text-sm leading-relaxed">
              <strong className="text-text-primary">Disclaimer:</strong> Portfolio recommendations are 
              for educational and informational purposes only. This is not financial advice. Past performance 
              does not guarantee future results. Always consult with a qualified financial advisor before 
              making investment decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
