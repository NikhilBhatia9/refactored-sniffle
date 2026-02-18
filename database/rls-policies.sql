-- Alpha Oracle 2.0 - Row-Level Security Policies
-- Supabase RLS Configuration

-- Enable RLS on all tables
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE economic_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE geopolitical_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_positions ENABLE ROW LEVEL SECURITY;

-- Public read access for demo/anonymous users
CREATE POLICY "Public can read sectors"
  ON sectors FOR SELECT
  USING (true);

CREATE POLICY "Public can read recommendations"
  ON recommendations FOR SELECT
  USING (true);

CREATE POLICY "Public can read market_data"
  ON market_data FOR SELECT
  USING (true);

CREATE POLICY "Public can read economic_indicators"
  ON economic_indicators FOR SELECT
  USING (true);

CREATE POLICY "Public can read geopolitical_risks"
  ON geopolitical_risks FOR SELECT
  USING (true);

-- Portfolio policies: Users can only access their own portfolios
CREATE POLICY "Users can view own portfolios"
  ON portfolios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own portfolios"
  ON portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios"
  ON portfolios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios"
  ON portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- Portfolio positions: Through portfolio ownership
CREATE POLICY "Users can view own portfolio positions"
  ON portfolio_positions FOR SELECT
  USING (
    portfolio_id IN (
      SELECT id FROM portfolios WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own portfolio positions"
  ON portfolio_positions FOR ALL
  USING (
    portfolio_id IN (
      SELECT id FROM portfolios WHERE user_id = auth.uid()
    )
  );
