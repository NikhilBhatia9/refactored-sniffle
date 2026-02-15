import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../services/api';
import MacroIndicator from '../components/MacroIndicator';
import RecommendationCard from '../components/RecommendationCard';
import SectorCard from '../components/SectorCard';
import AllocationChart from '../components/AllocationChart';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboard();
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-text-secondary">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-accent-red">Error loading dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Demo Mode Banner */}
      {data?.data_source === 'demo' && (
        <div className="card bg-accent-yellow/10 border-accent-yellow/30">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-accent-yellow mb-2">Demo Mode Active</h3>
              <p className="text-text-secondary mb-3">
                You're currently viewing demo data. To access real-time market data and live recommendations:
              </p>
              <ol className="text-text-secondary text-sm space-y-2 ml-4 list-decimal">
                <li>
                  Get a free API key from{' '}
                  <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
                    Alpha Vantage
                  </a>
                </li>
                <li>
                  Get a free API key from{' '}
                  <a href="https://fred.stlouisfed.org/docs/api/api_key.html" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
                    FRED
                  </a>
                </li>
                <li>Copy <code className="bg-primary-bg px-2 py-1 rounded">.env.example</code> to <code className="bg-primary-bg px-2 py-1 rounded">.env</code> in the backend directory</li>
                <li>Add both API keys to the <code className="bg-primary-bg px-2 py-1 rounded">.env</code> file</li>
                <li>Restart the backend server</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="card border-2 border-accent-blue/30">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Welcome to <span className="text-accent-blue">Alpha Oracle</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            AI-powered investment intelligence platform delivering real-time market insights, 
            sector analysis, and conviction-weighted recommendations.
          </p>
        </div>
      </section>

      {/* Market Summary */}
      {data?.market_summary && (
        <section>
          <h2 className="section-title">Market Summary</h2>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                {data.market_summary.overall_sentiment}
              </h3>
              <span className={`text-3xl ${
                data.market_summary.overall_sentiment === 'Bullish' ? 'text-accent-green' :
                data.market_summary.overall_sentiment === 'Bearish' ? 'text-accent-red' :
                'text-accent-yellow'
              }`}>
                {data.market_summary.overall_sentiment === 'Bullish' ? '↗' :
                 data.market_summary.overall_sentiment === 'Bearish' ? '↘' : '→'}
              </span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              {data.market_summary.summary}
            </p>
          </div>
        </section>
      )}

      {/* Macro Indicators */}
      {data?.macro_indicators && data.macro_indicators.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title mb-0">Key Macro Indicators</h2>
            <Link to="/macro" className="text-accent-blue text-sm hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.macro_indicators.slice(0, 4).map((indicator, idx) => (
              <MacroIndicator key={idx} indicator={indicator} />
            ))}
          </div>
        </section>
      )}

      {/* Top Recommendations */}
      {data?.top_recommendations && data.top_recommendations.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title mb-0">Top Recommendations</h2>
            <Link to="/recommendations" className="text-accent-blue text-sm hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.top_recommendations.slice(0, 4).map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </section>
      )}

      {/* Sector Heat Map */}
      {data?.sector_scores && data.sector_scores.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title mb-0">Sector Analysis</h2>
            <Link to="/sectors" className="text-accent-blue text-sm hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.sector_scores.slice(0, 6).map((sector) => (
              <SectorCard key={sector.id} sector={sector} />
            ))}
          </div>
        </section>
      )}

      {/* Portfolio Allocation */}
      {data?.portfolio_allocation && data.portfolio_allocation.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title mb-0">Recommended Allocation</h2>
            <Link to="/portfolio" className="text-accent-blue text-sm hover:underline">
              Customize →
            </Link>
          </div>
          <div className="card">
            <AllocationChart allocations={data.portfolio_allocation} />
          </div>
        </section>
      )}

      {/* Geopolitical Risks */}
      {data?.geopolitical_risks && data.geopolitical_risks.length > 0 && (
        <section>
          <h2 className="section-title">Geopolitical Risks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.geopolitical_risks.map((risk, idx) => (
              <div key={idx} className="card border-accent-red/20">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-text-primary">{risk.region}</h3>
                  <span className={`badge ${
                    risk.severity === 'High' ? 'badge-red' :
                    risk.severity === 'Medium' ? 'badge-yellow' :
                    'badge-blue'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-text-secondary text-sm mb-3">{risk.description}</p>
                {risk.affected_sectors && risk.affected_sectors.length > 0 && (
                  <div>
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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="card bg-primary-hover border-accent-yellow/30">
        <div className="flex items-start space-x-3">
          <span className="text-accent-yellow text-xl">⚠️</span>
          <div>
            <p className="text-text-secondary text-sm leading-relaxed">
              <strong className="text-text-primary">Disclaimer:</strong> All information provided by Alpha Oracle 
              is for educational and informational purposes only. This is not financial advice. Always conduct your 
              own research and consult with a qualified financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
