-- Alpha Oracle 2.0 - Demo Data Seed
-- Populate database with sample data for development and testing

-- Insert sectors
INSERT INTO sectors (name, conviction_score, trend, cycle_phase, tailwinds, headwinds, thesis)
VALUES
  ('Technology', 8.5, 'improving', 'Mid Expansion', 
   '["AI revolution", "Cloud adoption", "Digital transformation", "5G rollout"]'::jsonb,
   '["Regulatory scrutiny", "High valuations", "Interest rate sensitivity"]'::jsonb,
   'Technology sector positioned for continued growth driven by AI adoption, cloud migration, and digital transformation across industries. Despite high valuations, strong fundamentals and innovation pipeline support premium multiples.'),
  
  ('Healthcare', 7.8, 'stable', 'Mid Expansion',
   '["Aging demographics", "Innovation in biotech", "Chronic disease treatment", "Medical device advances"]'::jsonb,
   '["Regulatory risks", "Drug pricing pressure", "Patent cliffs"]'::jsonb,
   'Healthcare remains defensive with growth opportunities in biotech and medical devices. Aging population and chronic disease prevalence drive long-term demand. Regulatory headwinds present near-term challenges.'),
  
  ('Financials', 7.2, 'improving', 'Mid Expansion',
   '["Higher interest rates", "Economic growth", "Deregulation potential", "Digital banking"]'::jsonb,
   '["Credit risk", "Recession concerns", "Loan defaults"]'::jsonb,
   'Financials benefit from higher interest rate environment and economic expansion. Net interest margins expanding. Credit cycle risks remain manageable but warrant monitoring.'),
  
  ('Energy', 6.5, 'stable', 'Late Expansion',
   '["Energy transition", "Global demand recovery", "Underinvestment in supply"]'::jsonb,
   '["Regulatory pressures", "Renewable competition", "Volatility"]'::jsonb,
   'Traditional energy companies navigating transition while benefiting from supply constraints. Renewable energy investments provide growth optionality. Geopolitical risks create volatility.'),
  
  ('Consumer Discretionary', 7.0, 'improving', 'Mid Expansion',
   '["Consumer spending resilience", "E-commerce growth", "Brand loyalty"]'::jsonb,
   '["Inflation pressure", "Rising rates", "Economic uncertainty"]'::jsonb,
   'Premium brands and e-commerce leaders well-positioned. Consumer spending remains resilient but rate-sensitive. Focus on companies with pricing power.');

-- Insert sample stock recommendations
INSERT INTO recommendations (
  ticker, company_name, sector_id, strategy, conviction_score, 
  target_price, current_price, upside_percent, risk_level, thesis,
  catalysts, risks, valuation_metrics
)
SELECT 
  'AAPL', 'Apple Inc.', id, 'growth', 8.7,
  210.00, 178.50, 17.6, 'medium',
  'Leading position in premium smartphone market with strong services growth and ecosystem lock-in. Vision Pro represents new growth vector. Services segment provides high-margin recurring revenue.',
  '["Vision Pro adoption", "AI features in iOS 18", "Services expansion", "India market growth"]'::jsonb,
  '["China revenue exposure", "Smartphone market maturity", "Regulatory risks", "Competition in wearables"]'::jsonb,
  '{"pe": 28.5, "peg": 1.8, "roe": 147.0, "profit_margin": 25.3, "revenue_growth": 8.2}'::jsonb
FROM sectors WHERE name = 'Technology';

INSERT INTO recommendations (
  ticker, company_name, sector_id, strategy, conviction_score,
  target_price, current_price, upside_percent, risk_level, thesis,
  catalysts, risks, valuation_metrics
)
SELECT
  'MSFT', 'Microsoft Corporation', id, 'growth', 8.5,
  480.00, 420.00, 14.3, 'medium',
  'Cloud computing leader with strong Azure growth and AI integration across product suite. Copilot adoption accelerating. Gaming expansion through Activision acquisition provides diversification.',
  '["Azure AI growth", "Copilot adoption", "Gaming expansion", "Enterprise software strength"]'::jsonb,
  '["Cloud competition", "Regulatory scrutiny", "High valuation", "Activision integration risks"]'::jsonb,
  '{"pe": 35.2, "peg": 2.1, "roe": 42.5, "profit_margin": 36.7, "revenue_growth": 13.5}'::jsonb
FROM sectors WHERE name = 'Technology';

INSERT INTO recommendations (
  ticker, company_name, sector_id, strategy, conviction_score,
  target_price, current_price, upside_percent, risk_level, thesis,
  catalysts, risks, valuation_metrics
)
SELECT
  'NVDA', 'NVIDIA Corporation', id, 'growth', 9.2,
  950.00, 875.00, 8.6, 'high',
  'AI chip dominance with 90%+ market share in data center GPUs. H100/H200 chips seeing unprecedented demand. Long-term growth from AI infrastructure buildout.',
  '["AI infrastructure demand", "New chip launches", "Data center expansion", "Automotive AI"]'::jsonb,
  '["High valuation", "Competition from AMD/Intel", "Supply chain constraints", "Customer concentration"]'::jsonb,
  '{"pe": 68.4, "peg": 1.2, "roe": 115.0, "profit_margin": 48.5, "revenue_growth": 126.0}'::jsonb
FROM sectors WHERE name = 'Technology';

INSERT INTO recommendations (
  ticker, company_name, sector_id, strategy, conviction_score,
  target_price, current_price, upside_percent, risk_level, thesis,
  catalysts, risks, valuation_metrics
)
SELECT
  'UNH', 'UnitedHealth Group', id, 'growth', 8.0,
  580.00, 520.00, 11.5, 'medium',
  'Largest health insurer with strong Optum healthcare services business. Vertical integration drives margins. Aging demographics provide long-term tailwind.',
  '["Medicare Advantage growth", "Optum expansion", "Value-based care adoption", "Technology integration"]'::jsonb,
  '["Regulatory changes", "Medical cost inflation", "Political scrutiny", "Competition"]'::jsonb,
  '{"pe": 22.5, "peg": 1.5, "roe": 28.5, "profit_margin": 6.2, "revenue_growth": 14.5}'::jsonb
FROM sectors WHERE name = 'Healthcare';

INSERT INTO recommendations (
  ticker, company_name, sector_id, strategy, conviction_score,
  target_price, current_price, upside_percent, risk_level, thesis,
  catalysts, risks, valuation_metrics
)
SELECT
  'JPM', 'JPMorgan Chase & Co.', id, 'value', 7.8,
  175.00, 158.00, 10.8, 'medium',
  'Best-in-class bank with diversified revenue streams. Net interest margin expansion from higher rates. Strong capital position and consistent dividend growth.',
  '["Interest rate benefit", "Wealth management growth", "Market share gains", "Digital banking expansion"]'::jsonb,
  '["Credit cycle risk", "Recession impact", "Regulatory capital requirements", "Investment banking volatility"]'::jsonb,
  '{"pe": 11.2, "peg": 1.3, "roe": 17.5, "profit_margin": 32.5, "revenue_growth": 8.5}'::jsonb
FROM sectors WHERE name = 'Financials';

INSERT INTO recommendations (
  ticker, company_name, sector_id, strategy, conviction_score,
  target_price, current_price, upside_percent, risk_level, thesis,
  catalysts, risks, valuation_metrics
)
SELECT
  'XOM', 'Exxon Mobil Corporation', id, 'value', 6.8,
  125.00, 110.00, 13.6, 'medium',
  'Integrated oil major with strong cash flow generation. Disciplined capital allocation and shareholder returns. Low-carbon investments position for energy transition.',
  '["Oil price stability", "Production growth", "Buyback program", "LNG expansion"]'::jsonb,
  '["Oil price volatility", "Energy transition", "Regulatory pressure", "Stranded asset risk"]'::jsonb,
  '{"pe": 10.5, "peg": 1.8, "roe": 18.5, "profit_margin": 9.8, "dividend_yield": 3.2}'::jsonb
FROM sectors WHERE name = 'Energy';

INSERT INTO recommendations (
  ticker, company_name, sector_id, strategy, conviction_score,
  target_price, current_price, upside_percent, risk_level, thesis,
  catalysts, risks, valuation_metrics
)
SELECT
  'AMZN', 'Amazon.com, Inc.', id, 'growth', 8.3,
  175.00, 155.00, 12.9, 'medium',
  'E-commerce leader with high-margin AWS cloud business. Advertising business growing rapidly. Efficiency improvements driving margin expansion.',
  '["AWS growth", "Advertising revenue", "Prime membership", "AI investments"]'::jsonb,
  '["E-commerce competition", "Regulatory scrutiny", "Cloud competition", "Margin pressure"]'::jsonb,
  '{"pe": 52.5, "peg": 2.3, "roe": 15.2, "profit_margin": 5.7, "revenue_growth": 11.0}'::jsonb
FROM sectors WHERE name = 'Consumer Discretionary';

INSERT INTO recommendations (
  ticker, company_name, sector_id, strategy, conviction_score,
  target_price, current_price, upside_percent, risk_level, thesis,
  catalysts, risks, valuation_metrics
)
SELECT
  'TSLA', 'Tesla, Inc.', id, 'growth', 7.5,
  250.00, 195.00, 28.2, 'high',
  'EV market leader with manufacturing scale advantages. Energy storage and FSD software provide optionality. Cybertruck launch and new models expand addressable market.',
  '["Cybertruck ramp", "FSD monetization", "Energy storage growth", "New model launches"]'::jsonb,
  '["Competition intensifying", "Margin pressure", "Execution risk", "Valuation premium", "Key person risk"]'::jsonb,
  '{"pe": 72.5, "peg": 2.8, "roe": 28.5, "profit_margin": 15.5, "revenue_growth": 18.0}'::jsonb
FROM sectors WHERE name = 'Consumer Discretionary';

-- Insert economic indicators
INSERT INTO economic_indicators (indicator_name, value, unit, trend, impact, data_date)
VALUES
  ('GDP Growth Rate', 3.2, '%', 'up', 'Positive - Strong economic expansion supports corporate earnings', CURRENT_DATE - INTERVAL '1 day'),
  ('Unemployment Rate', 3.8, '%', 'stable', 'Positive - Near full employment with stable labor market', CURRENT_DATE - INTERVAL '1 day'),
  ('Inflation Rate (CPI)', 2.9, '%', 'down', 'Positive - Moderating inflation reduces pressure for rate hikes', CURRENT_DATE - INTERVAL '1 day'),
  ('Federal Funds Rate', 5.25, '%', 'stable', 'Neutral - Rates on hold as Fed assesses economic data', CURRENT_DATE - INTERVAL '1 day'),
  ('10-Year Treasury Yield', 4.35, '%', 'up', 'Neutral - Reflects strong growth expectations and inflation concerns', CURRENT_DATE - INTERVAL '1 day'),
  ('Consumer Confidence Index', 105.5, 'Index', 'up', 'Positive - Strong consumer sentiment supports spending', CURRENT_DATE - INTERVAL '1 day'),
  ('ISM Manufacturing PMI', 51.2, 'Index', 'stable', 'Positive - Manufacturing sector in expansion territory', CURRENT_DATE - INTERVAL '1 day');

-- Insert market data
INSERT INTO market_data (ticker, price, change_percent, volume, market_cap, pe_ratio, data_date)
VALUES
  ('AAPL', 178.50, 1.2, 52000000, 2800000000000, 28.5, CURRENT_DATE),
  ('MSFT', 420.00, 0.8, 28000000, 3100000000000, 35.2, CURRENT_DATE),
  ('NVDA', 875.00, 3.5, 45000000, 2200000000000, 68.4, CURRENT_DATE),
  ('GOOGL', 145.00, -0.5, 31000000, 1850000000000, 24.8, CURRENT_DATE),
  ('AMZN', 155.00, 1.8, 38000000, 1600000000000, 52.5, CURRENT_DATE),
  ('TSLA', 195.00, 2.5, 92000000, 620000000000, 72.5, CURRENT_DATE),
  ('UNH', 520.00, 0.3, 2800000, 485000000000, 22.5, CURRENT_DATE),
  ('JPM', 158.00, 1.0, 8500000, 455000000000, 11.2, CURRENT_DATE),
  ('XOM', 110.00, -0.8, 15000000, 445000000000, 10.5, CURRENT_DATE),
  ('SPY', 485.00, 0.9, 55000000, NULL, NULL, CURRENT_DATE);

-- Insert geopolitical risks
INSERT INTO geopolitical_risks (event_name, severity, affected_sectors, description, impact_assessment)
VALUES
  ('US-China Tech Tensions', 'high',
   '["Technology", "Materials", "Consumer Discretionary"]'::jsonb,
   'Ongoing technology transfer restrictions, export controls on advanced chips, and potential supply chain disruptions.',
   'Could limit growth for companies with significant China exposure. Semiconductor and hardware manufacturers most at risk. May accelerate reshoring and supply chain diversification.'),
  
  ('Inflation Persistence', 'medium',
   '["All Sectors"]'::jsonb,
   'Core inflation remaining above Fed 2% target despite recent moderation. Potential for additional rate hikes.',
   'May force Fed to maintain higher rates longer, pressuring valuations especially for growth stocks. Could slow economic growth and consumer spending.'),
  
  ('Middle East Tensions', 'medium',
   '["Energy", "Materials", "Industrials"]'::jsonb,
   'Ongoing conflicts creating potential for oil supply disruptions and commodity price volatility.',
   'Could drive energy prices higher, benefiting energy sector but pressuring consumer sectors. Risk of broader economic impact if conflicts escalate.'),
  
  ('Banking Sector Stress', 'low',
   '["Financials"]'::jsonb,
   'Regional bank challenges following 2023 failures. Commercial real estate exposure concerns.',
   'Large banks with diverse business models less exposed. Regional banks face deposit stability and CRE loan concerns. Regulatory scrutiny likely to increase.'),
  
  ('AI Regulatory Framework', 'medium',
   '["Technology"]'::jsonb,
   'Global efforts to regulate AI development and deployment. EU AI Act and similar initiatives in other jurisdictions.',
   'Could slow AI deployment and increase compliance costs. May create barriers to entry favoring established players. Long-term impact depends on final regulations.');
