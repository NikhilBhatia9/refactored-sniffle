"""
Demo data provider for Alpha Oracle.
Provides realistic sample data when API keys are not configured.
This ensures the platform works out-of-the-box for demonstration purposes.

The demo data represents a late-cycle expansion scenario with rising rates.
"""
from datetime import datetime
from app.models.schemas import (
    SectorAnalysis, MacroSnapshot, StockRecommendation, 
    GeopoliticalRisk, PortfolioAllocation, Outlook, 
    Recommendation, RiskLevel, EconomicCycle, MarketRegime
)


def get_demo_macro_snapshot() -> MacroSnapshot:
    """
    Returns a realistic macro snapshot representing late-cycle expansion.
    Characteristics: Moderate growth, rising inflation, tightening monetary policy
    """
    return MacroSnapshot(
        gdp_growth=2.1,
        inflation_rate=3.7,
        unemployment=3.8,
        fed_funds_rate=5.25,
        yield_curve_spread=-15,  # Slightly inverted, warning signal
        consumer_confidence=102.5,
        vix=16.5,
        dollar_index=103.2,
        oil_price=82.5,
        economic_cycle_phase=EconomicCycle.PEAK,
        last_updated=datetime.now()
    )


def get_demo_sector_analyses() -> list[SectorAnalysis]:
    """
    Returns comprehensive sector analyses for all 11 GICS sectors.
    Reflects late-cycle dynamics: defensive sectors favored, cyclicals under pressure
    """
    return [
        # Defensive sectors scoring high in late cycle
        SectorAnalysis(
            sector="Healthcare",
            score=85,
            economic_cycle_phase=EconomicCycle.PEAK,
            outlook=Outlook.BULLISH,
            top_picks=["UNH", "JNJ", "LLY"],
            headwinds=[
                "Regulatory scrutiny on drug pricing",
                "Medicare negotiation pressure",
                "Patent cliffs for key drugs"
            ],
            tailwinds=[
                "Aging demographics driving demand",
                "GLP-1 drugs revolution (weight loss)",
                "Strong pricing power",
                "Defensive characteristics in late cycle",
                "Innovation in biotech and gene therapy"
            ],
            rationale="Healthcare is ideal for late-cycle positioning. Aging demographics provide secular growth, while defensive characteristics protect in slowdowns. GLP-1 weight loss drugs are a multi-hundred billion dollar opportunity. Recommend overweight.",
            trend="improving"
        ),
        SectorAnalysis(
            sector="Consumer Staples",
            score=78,
            economic_cycle_phase=EconomicCycle.PEAK,
            outlook=Outlook.BULLISH,
            top_picks=["PG", "KO", "WMT"],
            headwinds=[
                "Input cost inflation pressuring margins",
                "Private label competition",
                "Slow organic growth"
            ],
            tailwinds=[
                "Pricing power in inflationary environment",
                "Stable demand regardless of economy",
                "Strong cash flows and dividends",
                "Defensive in late cycle"
            ],
            rationale="Staples offer protection as cycle matures. Companies have demonstrated pricing power to pass through inflation. High dividend yields attractive as rates peak. Classic late-cycle positioning.",
            trend="stable"
        ),
        SectorAnalysis(
            sector="Utilities",
            score=72,
            economic_cycle_phase=EconomicCycle.CONTRACTION,
            outlook=Outlook.NEUTRAL,
            top_picks=["NEE", "DUK", "SO"],
            headwinds=[
                "High interest rate sensitivity",
                "Regulatory rate cases",
                "Capital intensive growth"
            ],
            tailwinds=[
                "Renewable energy transition spending",
                "Stable regulated cash flows",
                "High dividend yields",
                "Defensive demand profile"
            ],
            rationale="Utilities face headwind from higher rates but offer defensive characteristics. Renewable energy capex provides growth. Wait for rate stabilization before overweighting.",
            trend="stable"
        ),
        
        # Mid-cycle sectors under pressure
        SectorAnalysis(
            sector="Technology",
            score=68,
            economic_cycle_phase=EconomicCycle.EXPANSION,
            outlook=Outlook.NEUTRAL,
            top_picks=["MSFT", "NVDA", "AAPL"],
            headwinds=[
                "High valuations vulnerable to rising rates",
                "Antitrust regulatory pressure",
                "China geopolitical tensions",
                "Difficult YoY comparisons",
                "Rate sensitivity of growth multiples"
            ],
            tailwinds=[
                "AI adoption accelerating across industries",
                "Cloud migration still early innings",
                "Strong balance sheets and cash generation",
                "Digital transformation secular trend",
                "Productivity enhancements from AI"
            ],
            rationale="Tech leadership (MSFT, NVDA, AAPL) remains strong with AI tailwinds, but valuations stretched. Rising rates pressure growth multiples. Selective exposure to AI beneficiaries warranted, but trim mega-cap overweight.",
            trend="declining"
        ),
        SectorAnalysis(
            sector="Communication Services",
            score=62,
            economic_cycle_phase=EconomicCycle.EXPANSION,
            outlook=Outlook.NEUTRAL,
            top_picks=["META", "GOOGL", "NFLX"],
            headwinds=[
                "Advertising spending slowing",
                "Regulatory scrutiny intensifying",
                "Competition in streaming",
                "User growth saturation"
            ],
            tailwinds=[
                "Digital ad market still growing",
                "AI improving ad targeting and content",
                "Emerging markets growth opportunity",
                "Content monetization improving"
            ],
            rationale="Mixed picture. Digital advertising slowing but AI improves economics. Regulatory overhang persists. META best positioned with efficiency gains and AI integration.",
            trend="stable"
        ),
        
        # Cyclical sectors struggling in late cycle
        SectorAnalysis(
            sector="Consumer Discretionary",
            score=55,
            economic_cycle_phase=EconomicCycle.EXPANSION,
            outlook=Outlook.BEARISH,
            top_picks=["AMZN", "HD", "NKE"],
            headwinds=[
                "Consumer spending slowing under rate pressure",
                "High debt service costs hurting demand",
                "Trade-down behavior emerging",
                "Inventory normalization pain",
                "Weak housing market hurting home improvement"
            ],
            tailwinds=[
                "Pent-up demand in autos",
                "Experiences/travel still strong",
                "Wealthy consumer resilient"
            ],
            rationale="Discretionary faces significant late-cycle headwinds. Higher rates pressure leveraged consumers. Housing slowdown hurts home improvement. Selectively own market share gainers like Amazon.",
            trend="declining"
        ),
        SectorAnalysis(
            sector="Financials",
            score=58,
            economic_cycle_phase=EconomicCycle.EXPANSION,
            outlook=Outlook.NEUTRAL,
            top_picks=["JPM", "BAC", "V"],
            headwinds=[
                "Regional bank stress from rate shock",
                "Commercial real estate exposure",
                "Credit quality deterioration ahead",
                "Deposit flight risk"
            ],
            tailwinds=[
                "Net interest margin expansion from rates",
                "Payments growth from nominal GDP",
                "Capital return to shareholders",
                "Trading revenues elevated"
            ],
            rationale="Financials benefiting from rate rise but credit concerns mounting. Stay with highest quality (JPM) and payment processors (V, MA) with no credit risk. Avoid regional banks.",
            trend="stable"
        ),
        SectorAnalysis(
            sector="Industrials",
            score=60,
            economic_cycle_phase=EconomicCycle.EXPANSION,
            outlook=Outlook.NEUTRAL,
            top_picks=["UNP", "CAT", "HON"],
            headwinds=[
                "Slowing global PMIs",
                "Destocking cycle",
                "Rising wage costs",
                "China slowdown impact"
            ],
            tailwinds=[
                "Infrastructure spending from government bills",
                "Aerospace recovery continues",
                "Reshoring and supply chain reconfiguration",
                "Automation and productivity investments"
            ],
            rationale="Industrials facing cyclical slowdown but infrastructure and aerospace provide offsets. Quality names with pricing power preferred. Underweight overall.",
            trend="declining"
        ),
        
        # Commodities and late-cycle beneficiaries
        SectorAnalysis(
            sector="Energy",
            score=75,
            economic_cycle_phase=EconomicCycle.PEAK,
            outlook=Outlook.BULLISH,
            top_picks=["XOM", "CVX", "COP"],
            headwinds=[
                "Demand slowdown if recession hits",
                "Energy transition long-term pressure",
                "Political and ESG headwinds"
            ],
            tailwinds=[
                "Underinvestment in oil supply",
                "OPEC+ supply discipline",
                "Natural gas strength from LNG demand",
                "Strong free cash flow and capital returns",
                "Inflation hedge characteristics"
            ],
            rationale="Energy benefits from supply constraints and geopolitical tensions. Strong cash generation enables massive buybacks. Best late-cycle inflation hedge. Overweight quality integrated majors.",
            trend="improving"
        ),
        SectorAnalysis(
            sector="Materials",
            score=52,
            economic_cycle_phase=EconomicCycle.EXPANSION,
            outlook=Outlook.BEARISH,
            top_picks=["LIN", "APD", "NEM"],
            headwinds=[
                "China slowdown hurting demand",
                "Inventory destocking",
                "Weak construction activity",
                "Commodity price volatility"
            ],
            tailwinds=[
                "Supply discipline in chemicals",
                "Green transition metal demand",
                "Infrastructure spending support"
            ],
            rationale="Materials suffering from China weakness and destocking. Avoid broad exposure. Selective positioning in industrial gases (LIN) and precious metals (NEM) as recession hedge.",
            trend="declining"
        ),
        SectorAnalysis(
            sector="Real Estate",
            score=48,
            economic_cycle_phase=EconomicCycle.EXPANSION,
            outlook=Outlook.BEARISH,
            top_picks=["PLD", "AMT", "EQIX"],
            headwinds=[
                "High interest rate sensitivity",
                "Office sector distress",
                "Retail mall challenges",
                "CMBS market stress",
                "Valuation compression from higher rates"
            ],
            tailwinds=[
                "Data center demand from AI",
                "Industrial/logistics strength from e-commerce",
                "Cell tower steady cash flows"
            ],
            rationale="Real estate under severe pressure from rate spike. Office and retail deeply challenged. Only own specialized REITs with secular tailwinds: data centers (EQIX), logistics (PLD), towers (AMT). Underweight.",
            trend="declining"
        )
    ]


def get_demo_stock_recommendations() -> list[StockRecommendation]:
    """
    Returns 20 detailed stock recommendations across sectors.
    Reflects late-cycle positioning: defensive bias, quality focus, inflation hedges
    """
    return [
        # Strong Buy - Highest Conviction
        StockRecommendation(
            ticker="UNH",
            company_name="UnitedHealth Group",
            sector="Healthcare",
            recommendation=Recommendation.STRONG_BUY,
            conviction_score=92,
            current_price=528.40,
            fair_value_estimate=620.00,
            upside_potential_pct=17.3,
            pe_ratio=24.5,
            peg_ratio=1.8,
            dividend_yield=1.4,
            market_cap=485.2,
            headwinds=["Regulatory scrutiny", "Medicare Advantage rate pressure"],
            tailwinds=["Aging demographics", "Optum growth", "Pricing power", "Defensive characteristics"],
            rationale="UNH is the highest quality healthcare name with unmatched scale and integration. Optum health services provides above-market growth. Late-cycle defensive positioning essential. MA rate pressure overblown. Margin expansion path clear. Top pick.",
            time_horizon="12-24 months"
        ),
        StockRecommendation(
            ticker="LLY",
            company_name="Eli Lilly",
            sector="Healthcare",
            recommendation=Recommendation.STRONG_BUY,
            conviction_score=90,
            current_price=568.25,
            fair_value_estimate=700.00,
            upside_potential_pct=23.2,
            pe_ratio=88.4,
            peg_ratio=2.1,
            dividend_yield=0.7,
            market_cap=540.8,
            headwinds=["Elevated valuation", "Incretin class competition intensifying"],
            tailwinds=["GLP-1 obesity drugs mega-opportunity", "Alzheimer's drug approval", "Pipeline strength", "Pricing power"],
            rationale="LLY has two massive franchises: GLP-1 obesity drugs (Mounjaro/Zepbound) addressing $100B+ market, and Alzheimer's (Kisunla). Obesity epidemic ensures decades of growth. Valuation justified by growth. Manufacturing capacity expanding.",
            time_horizon="24+ months"
        ),
        StockRecommendation(
            ticker="XOM",
            company_name="Exxon Mobil",
            sector="Energy",
            recommendation=Recommendation.BUY,
            conviction_score=88,
            current_price=102.35,
            fair_value_estimate=125.00,
            upside_potential_pct=22.1,
            pe_ratio=9.8,
            peg_ratio=0.9,
            dividend_yield=3.5,
            market_cap=415.7,
            headwinds=["Energy transition long-term", "Demand risk if recession"],
            tailwinds=["Underinvestment in supply", "Strong FCF generation", "Share buybacks", "Inflation hedge"],
            rationale="XOM benefits from supply constraints and OPEC discipline. Generating massive FCF enabling $17B+ annual buybacks. Best-in-class integrated model. Late-cycle inflation hedge with 3.5% yield. Oil likely supported at $75-85 floor.",
            time_horizon="12-18 months"
        ),
        
        # Buy Recommendations
        StockRecommendation(
            ticker="MSFT",
            company_name="Microsoft",
            sector="Technology",
            recommendation=Recommendation.BUY,
            conviction_score=85,
            current_price=375.80,
            fair_value_estimate=430.00,
            upside_potential_pct=14.4,
            pe_ratio=32.5,
            peg_ratio=2.2,
            dividend_yield=0.9,
            market_cap=2790.5,
            headwinds=["High valuation", "Rate sensitivity", "Slower Azure growth"],
            tailwinds=["AI leadership with OpenAI", "Copilot monetization", "Cloud secular growth", "Enterprise moat"],
            rationale="MSFT best positioned for AI revolution through OpenAI partnership. Copilot adds new revenue stream. Azure growth moderating but still double-digit. Valuation rich but justified by AI optionality. Quality compounder.",
            time_horizon="18-24 months"
        ),
        StockRecommendation(
            ticker="JPM",
            company_name="JPMorgan Chase",
            sector="Financials",
            recommendation=Recommendation.BUY,
            conviction_score=83,
            current_price=168.50,
            fair_value_estimate=195.00,
            upside_potential_pct=15.7,
            pe_ratio=11.2,
            peg_ratio=1.8,
            dividend_yield=2.6,
            market_cap=485.3,
            headwinds=["Credit deterioration ahead", "CRE exposure concerns"],
            tailwinds=["NIM expansion from rates", "Market share gains", "Fortress balance sheet", "Best-in-class management"],
            rationale="JPM is the gold standard in banking. Fortress balance sheet survived regional bank crisis. NII benefiting from rates. Credit concerns overdone - reserves adequate. Dimon's leadership unmatched. Flight to quality benefits JPM.",
            time_horizon="12-18 months"
        ),
        StockRecommendation(
            ticker="NVDA",
            company_name="NVIDIA",
            sector="Technology",
            recommendation=Recommendation.BUY,
            conviction_score=82,
            current_price=735.50,
            fair_value_estimate=850.00,
            upside_potential_pct=15.6,
            pe_ratio=65.2,
            peg_ratio=1.9,
            dividend_yield=0.05,
            market_cap=1825.4,
            headwinds=["Extreme valuation", "Competition emerging", "China restrictions"],
            tailwinds=["AI infrastructure buildout", "Data center dominance", "Software monetization", "Pricing power"],
            rationale="NVDA is the pick-and-shovel play on AI revolution. Data center GPU demand insatiable. H100/H200 sold out through 2024. Software layer (CUDA) creates moat. Valuation elevated but growth justifies premium. Trim on strength.",
            time_horizon="12-18 months"
        ),
        StockRecommendation(
            ticker="PG",
            company_name="Procter & Gamble",
            sector="Consumer Staples",
            recommendation=Recommendation.BUY,
            conviction_score=80,
            current_price=158.75,
            fair_value_estimate=175.00,
            upside_potential_pct=10.2,
            pe_ratio=25.8,
            peg_ratio=3.5,
            dividend_yield=2.5,
            market_cap=375.2,
            headwinds=["Slowing organic growth", "FX headwinds", "Private label competition"],
            tailwinds=["Pricing power", "Defensive demand", "Strong brands", "Dividend aristocrat"],
            rationale="PG epitomizes late-cycle defensive positioning. Proven ability to pass through inflation. Portfolio of leading brands (Tide, Pampers, Gillette) have pricing power. 2.5% yield with 67-year dividend growth streak. Safe haven.",
            time_horizon="12-24 months"
        ),
        StockRecommendation(
            ticker="CVX",
            company_name="Chevron",
            sector="Energy",
            recommendation=Recommendation.BUY,
            conviction_score=80,
            current_price=148.90,
            fair_value_estimate=172.00,
            upside_potential_pct=15.5,
            pe_ratio=10.5,
            peg_ratio=1.1,
            dividend_yield=3.9,
            market_cap=268.5,
            headwinds=["Permian growth slowing", "Renewable transition"],
            tailwinds=["Hess acquisition adds growth", "LNG expansion", "Buybacks", "High dividend"],
            rationale="CVX combines value, income, and growth. Hess acquisition adds Guyana production growth. Permian base solid. LNG projects provide 2025+ growth. 3.9% dividend well-covered. Quality integrated model. Late-cycle hedge.",
            time_horizon="12-18 months"
        ),
        StockRecommendation(
            ticker="JNJ",
            company_name="Johnson & Johnson",
            sector="Healthcare",
            recommendation=Recommendation.BUY,
            conviction_score=78,
            current_price=158.20,
            fair_value_estimate=180.00,
            upside_potential_pct=13.8,
            pe_ratio=15.2,
            peg_ratio=2.8,
            dividend_yield=3.1,
            market_cap=385.4,
            headwinds=["Talc litigation overhang", "Pharma patent cliffs"],
            tailwinds=["MedTech growth acceleration", "Pharma pipeline", "Dividend aristocrat", "Defensive"],
            rationale="JNJ transformation post-consumer spin creating value. MedTech (surgical robots, cardiovascular) accelerating. Pharma pipeline strong despite patent losses. 3.1% yield with 61-year increase streak. Talc settlement path emerging. Quality defensive asset.",
            time_horizon="18-24 months"
        ),
        StockRecommendation(
            ticker="WMT",
            company_name="Walmart",
            sector="Consumer Staples",
            recommendation=Recommendation.BUY,
            conviction_score=77,
            current_price=165.80,
            fair_value_estimate=185.00,
            upside_potential_pct=11.6,
            pe_ratio=28.5,
            peg_ratio=2.4,
            dividend_yield=1.5,
            market_cap=442.8,
            headwinds=["Wage inflation", "Competition from AMZN", "Valuation stretched"],
            tailwinds=["Trade-down beneficiary", "E-commerce growth", "Advertising business scaling", "Inflation beneficiary"],
            rationale="WMT wins in late cycle as consumers trade down to value. E-commerce finally profitable and growing 20%+. High-margin advertising business emerging (Walmart Connect). Omnichannel advantage vs pure online. Defensive growth compounder.",
            time_horizon="12-18 months"
        ),
        
        # Hold Recommendations
        StockRecommendation(
            ticker="AAPL",
            company_name="Apple",
            sector="Technology",
            recommendation=Recommendation.HOLD,
            conviction_score=68,
            current_price=185.50,
            fair_value_estimate=185.00,
            upside_potential_pct=-0.3,
            pe_ratio=29.8,
            peg_ratio=4.2,
            dividend_yield=0.5,
            market_cap=2850.4,
            headwinds=["iPhone growth saturated", "China sales weakness", "Services growth slowing", "High valuation"],
            tailwinds=["Services high margin", "Installed base loyalty", "Vision Pro optionality", "Cash return"],
            rationale="AAPL at fair value after strong run. iPhone 15 cycle disappointing. China deteriorating (down 15%+). Services decelerating. Vision Pro unproven. Massive cash return supportive but not enough to drive upside. Hold quality position, don't add.",
            time_horizon="12 months"
        ),
        StockRecommendation(
            ticker="AMZN",
            company_name="Amazon",
            sector="Consumer Discretionary",
            recommendation=Recommendation.HOLD,
            conviction_score=65,
            current_price=155.20,
            fair_value_estimate=160.00,
            upside_potential_pct=3.1,
            pe_ratio=52.5,
            peg_ratio=2.8,
            dividend_yield=0.0,
            market_cap=1598.5,
            headwinds=["Retail margin pressure", "Consumer spending slowing", "Regulatory scrutiny", "High valuation"],
            tailwinds=["AWS remains strong", "Advertising growing", "Prime loyalty", "Logistics efficiency gains"],
            rationale="AMZN facing cyclical headwinds in retail as consumer weakens. AWS growth moderating but still leader. Advertising bright spot. Cost cutting improving margins. Fairly valued with limited upside near-term. Hold for AWS exposure.",
            time_horizon="12-18 months"
        ),
        StockRecommendation(
            ticker="GOOGL",
            company_name="Alphabet",
            sector="Communication Services",
            recommendation=Recommendation.HOLD,
            conviction_score=70,
            current_price=140.50,
            fair_value_estimate=150.00,
            upside_potential_pct=6.8,
            pe_ratio=25.2,
            peg_ratio=2.1,
            dividend_yield=0.0,
            market_cap=1755.8,
            headwinds=["Search ad slowdown", "AI threatening search moat", "Regulatory overhang", "YouTube competition"],
            tailwinds=["Search dominance", "Cloud growing", "AI integration", "Buybacks"],
            rationale="GOOGL facing existential AI threat to search but likely overblown. Integrating AI into search. Cloud accelerating. Advertising cyclically weak but durable franchise. Regulatory risk elevated (antitrust). Reasonable valuation but wait for better entry.",
            time_horizon="12-18 months"
        ),
        StockRecommendation(
            ticker="META",
            company_name="Meta Platforms",
            sector="Communication Services",
            recommendation=Recommendation.BUY,
            conviction_score=75,
            current_price=485.30,
            fair_value_estimate=550.00,
            upside_potential_pct=13.3,
            pe_ratio=28.5,
            peg_ratio=1.9,
            dividend_yield=0.0,
            market_cap=1235.7,
            headwinds=["Ad spending cyclically weak", "Competition from TikTok", "Regulatory scrutiny", "Metaverse cash burn"],
            tailwinds=["Efficiency gains driving margins", "Reels monetization", "AI improving ad targeting", "WhatsApp monetization starting"],
            rationale="META 'year of efficiency' delivering massive margin expansion. AI improving ad ROI and targeting. Reels successfully competing with TikTok. WhatsApp business monetization early innings. Metaverse spending moderating. Valuation attractive after reset.",
            time_horizon="12-18 months"
        ),
        StockRecommendation(
            ticker="V",
            company_name="Visa",
            sector="Financials",
            recommendation=Recommendation.BUY,
            conviction_score=81,
            current_price=268.40,
            fair_value_estimate=305.00,
            upside_potential_pct=13.6,
            pe_ratio=31.5,
            peg_ratio=2.5,
            dividend_yield=0.8,
            market_cap=545.8,
            headwinds=["Consumer spending slowdown", "Competition from fintech", "Regulation of interchange fees"],
            tailwinds=["Digital payments secular growth", "No credit risk", "International growth", "Cash displacement continues"],
            rationale="V is a quality compounder with no credit risk. Secular shift to digital payments continues. International opportunity large. High margins and capital-light model. Spending slowdown temporary headwind. Premium valuation justified by quality and growth durability.",
            time_horizon="18-24 months"
        ),
        
        # More diverse recommendations
        StockRecommendation(
            ticker="HD",
            company_name="Home Depot",
            sector="Consumer Discretionary",
            recommendation=Recommendation.HOLD,
            conviction_score=62,
            current_price=328.50,
            fair_value_estimate=330.00,
            upside_potential_pct=0.5,
            pe_ratio=21.5,
            peg_ratio=3.8,
            dividend_yield=2.4,
            market_cap=325.4,
            headwinds=["Housing market weakness", "Big-ticket discretionary pressure", "Mortgage rates hurting turnover"],
            tailwinds=["Home equity at highs", "Repair/remodel stable", "Pro customer steady", "Market leader"],
            rationale="HD facing cyclical headwinds from housing slowdown. Existing home sales down hurting turnover. Big-ticket discretionary weak. However, repair/remodel more stable and home equity supports spending. Fully valued. Avoid until housing stabilizes.",
            time_horizon="12-18 months"
        ),
        StockRecommendation(
            ticker="NEE",
            company_name="NextEra Energy",
            sector="Utilities",
            recommendation=Recommendation.HOLD,
            conviction_score=70,
            current_price=58.20,
            fair_value_estimate=65.00,
            upside_potential_pct=11.7,
            pe_ratio=18.5,
            peg_ratio=2.1,
            dividend_yield=3.2,
            market_cap=118.5,
            headwinds=["High rate sensitivity", "Elevated valuation for utility", "Florida regulatory risk"],
            tailwinds=["Renewable energy leader", "Rate base growth", "Data center demand", "Dividend growth"],
            rationale="NEE is highest quality utility with renewable leadership. Rate base growing 10%. Data center demand supporting Florida Power. But valuation premium compressed by higher rates. Defensive but wait for better entry point as rates stabilize.",
            time_horizon="18-24 months"
        ),
        StockRecommendation(
            ticker="LIN",
            company_name="Linde",
            sector="Materials",
            recommendation=Recommendation.BUY,
            conviction_score=76,
            current_price=425.80,
            fair_value_estimate=475.00,
            upside_potential_pct=11.6,
            pe_ratio=28.5,
            peg_ratio=2.4,
            dividend_yield=1.4,
            market_cap=208.5,
            headwinds=["Global industrial slowdown", "China weakness", "Energy costs"],
            tailwinds=["Hydrogen economy growth", "Semiconductor fab buildout", "Healthcare demand", "Pricing power"],
            rationale="LIN is highest quality materials name. Industrial gas oligopoly pricing. Hydrogen infrastructure buildout multi-decade opportunity. Chip fab construction driving demand. Defensive growth in weak materials sector. Premium quality deserves premium valuation.",
            time_horizon="18-24 months"
        ),
        StockRecommendation(
            ticker="CAT",
            company_name="Caterpillar",
            sector="Industrials",
            recommendation=Recommendation.HOLD,
            conviction_score=64,
            current_price=295.40,
            fair_value_estimate=295.00,
            upside_potential_pct=-0.1,
            pe_ratio=16.8,
            peg_ratio=2.8,
            dividend_yield=1.8,
            market_cap=152.8,
            headwinds=["Cyclical peak concerns", "China construction slowdown", "Dealer inventory destocking"],
            tailwinds=["Infrastructure spending", "Replacement cycle", "Pricing power", "Services growth"],
            rationale="CAT at cyclical peak with industrial slowdown ahead. China construction plummeting. Dealer inventories elevated. Infrastructure provides partial offset. Valuation fair not cheap. Avoid cyclicals in late cycle. Wait for reset.",
            time_horizon="12 months"
        ),
        StockRecommendation(
            ticker="PLD",
            company_name="Prologis",
            sector="Real Estate",
            recommendation=Recommendation.HOLD,
            conviction_score=66,
            current_price=118.50,
            fair_value_estimate=125.00,
            upside_potential_pct=5.5,
            pe_ratio=32.5,
            peg_ratio=4.2,
            dividend_yield=3.2,
            market_cap=108.5,
            headwinds=["Rate sensitivity", "Development yields compressed", "Slowing rent growth"],
            tailwinds=["E-commerce secular growth", "Supply discipline", "Modern logistics scarcity", "High occupancy"],
            rationale="PLD is best-in-class logistics REIT. E-commerce drives long-term demand. But REITs getting hammered by rates. Rent growth slowing. FFO multiple compressed. Quality name but sector headwinds trump. Revisit when rates stabilize.",
            time_horizon="18-24 months"
        ),
        StockRecommendation(
            ticker="NEM",
            company_name="Newmont",
            sector="Materials",
            recommendation=Recommendation.BUY,
            conviction_score=73,
            current_price=38.50,
            fair_value_estimate=48.00,
            upside_potential_pct=24.7,
            pe_ratio=45.2,
            peg_ratio=1.8,
            dividend_yield=2.8,
            market_cap=30.5,
            headwinds=["Operational challenges", "Cost inflation", "Newcrest integration risk"],
            tailwinds=["Gold hedge against uncertainty", "Recession/geopolitical safe haven", "Central bank buying", "Mining supply constrained"],
            rationale="NEM offers late-cycle recession hedge through gold exposure. Geopolitical tensions support prices. Central banks accumulating. Real rates peaking supports gold. Newcrest deal adds scale. Operational turnaround underway. Recession insurance at reasonable cost.",
            time_horizon="12-24 months"
        )
    ]


def get_demo_geopolitical_risks() -> list[GeopoliticalRisk]:
    """
    Returns current geopolitical risk assessments affecting markets
    """
    return [
        GeopoliticalRisk(
            region="China / Taiwan",
            risk_level=RiskLevel.HIGH,
            description="Elevated tensions around Taiwan with increased military posturing. Potential for conflict or blockade would disrupt global supply chains, especially semiconductors.",
            affected_sectors=["Technology", "Materials", "Industrials", "Consumer Discretionary"],
            investment_implication="Reduce exposure to companies with heavy China revenue concentration. Favor domestic supply chains and nearshoring beneficiaries. Semiconductors especially vulnerable."
        ),
        GeopoliticalRisk(
            region="Russia / Ukraine",
            risk_level=RiskLevel.MEDIUM,
            description="Ongoing conflict continues with periodic escalation. Energy and grain markets remain disrupted. Sanctions on Russia persist.",
            affected_sectors=["Energy", "Materials", "Consumer Staples"],
            investment_implication="Energy prices volatile but elevated. European energy crisis easing but remains vulnerable. Favor US energy independence plays. Agricultural commodities supported."
        ),
        GeopoliticalRisk(
            region="Middle East",
            risk_level=RiskLevel.MEDIUM,
            description="Israel-Hamas conflict with risk of broader regional escalation. Iran involvement concerns. Potential impacts to oil transit routes (Strait of Hormuz).",
            affected_sectors=["Energy", "Industrials", "Materials"],
            investment_implication="Oil price risk premium elevated. Any supply disruption would spike prices. Favor energy companies with geographically diverse assets. Defense stocks benefit."
        ),
        GeopoliticalRisk(
            region="United States",
            risk_level=RiskLevel.MEDIUM,
            description="Election year uncertainty with potential for significant policy changes. Deficit and debt ceiling concerns resurfacing. Polarization high.",
            affected_sectors=["Healthcare", "Financials", "Energy", "Communication Services"],
            investment_implication="Healthcare faces drug pricing regulation risk. Financial regulation could tighten. Energy policy uncertain. Antitrust scrutiny of big tech. Favor bipartisan beneficiaries."
        ),
        GeopoliticalRisk(
            region="Global Trade",
            risk_level=RiskLevel.MEDIUM,
            description="Trade tensions persisting with friend-shoring and deglobalization trends. Supply chain reconfiguration ongoing. Protectionist policies spreading.",
            affected_sectors=["Industrials", "Technology", "Materials", "Consumer Discretionary"],
            investment_implication="Nearshoring beneficiaries favored (Mexico manufacturing, US industrials). Global exporters face challenges. Localized supply chains preferred."
        )
    ]


def get_demo_portfolio_allocation(risk_tolerance: str) -> list[PortfolioAllocation]:
    """
    Returns recommended portfolio allocation based on risk tolerance.
    Conservative: More defensive sectors, less cyclical exposure
    Moderate: Balanced approach
    Aggressive: More growth and cyclical exposure
    """
    if risk_tolerance == "conservative":
        return [
            PortfolioAllocation(
                sector="Healthcare",
                weight_pct=25,
                rationale="Defensive characteristics, aging demographics tailwind, recession-resistant"
            ),
            PortfolioAllocation(
                sector="Consumer Staples",
                weight_pct=20,
                rationale="Stable demand, pricing power, high dividend yields, late-cycle safety"
            ),
            PortfolioAllocation(
                sector="Utilities",
                weight_pct=15,
                rationale="Bond proxy with yield, defensive demand, regulated cash flows"
            ),
            PortfolioAllocation(
                sector="Financials",
                weight_pct=12,
                rationale="Quality banks only (JPM, BAC), payment processors for growth"
            ),
            PortfolioAllocation(
                sector="Energy",
                weight_pct=10,
                rationale="Inflation hedge, strong cash flows, dividend yield"
            ),
            PortfolioAllocation(
                sector="Technology",
                weight_pct=10,
                rationale="High quality only (MSFT, AAPL), reduce growth stock exposure"
            ),
            PortfolioAllocation(
                sector="Communication Services",
                weight_pct=5,
                rationale="Minimal exposure, META only for efficiency story"
            ),
            PortfolioAllocation(
                sector="Industrials",
                weight_pct=3,
                rationale="Underweight cyclicals, infrastructure plays only"
            )
        ]
    elif risk_tolerance == "aggressive":
        return [
            PortfolioAllocation(
                sector="Technology",
                weight_pct=30,
                rationale="AI revolution theme, cloud growth, digital transformation leaders"
            ),
            PortfolioAllocation(
                sector="Healthcare",
                weight_pct=15,
                rationale="GLP-1 opportunity, biotech innovation, defensive growth"
            ),
            PortfolioAllocation(
                sector="Communication Services",
                weight_pct=12,
                rationale="Digital advertising recovery, AI integration, efficiency gains"
            ),
            PortfolioAllocation(
                sector="Energy",
                weight_pct=10,
                rationale="Inflation hedge, supply constraints, geopolitical premium"
            ),
            PortfolioAllocation(
                sector="Financials",
                weight_pct=10,
                rationale="NIM expansion from rates, quality banks, payment processors"
            ),
            PortfolioAllocation(
                sector="Consumer Discretionary",
                weight_pct=10,
                rationale="Selective exposure to Amazon, market share gainers"
            ),
            PortfolioAllocation(
                sector="Industrials",
                weight_pct=8,
                rationale="Infrastructure, aerospace recovery, automation"
            ),
            PortfolioAllocation(
                sector="Materials",
                weight_pct=5,
                rationale="Green transition metals, industrial gases for chip fabs"
            )
        ]
    else:  # moderate
        return [
            PortfolioAllocation(
                sector="Technology",
                weight_pct=20,
                rationale="Balance quality mega-caps with valuation discipline, AI beneficiaries"
            ),
            PortfolioAllocation(
                sector="Healthcare",
                weight_pct=18,
                rationale="Defensive growth, demographic tailwinds, GLP-1 opportunity"
            ),
            PortfolioAllocation(
                sector="Financials",
                weight_pct=13,
                rationale="Quality banks benefiting from rates, payment processors"
            ),
            PortfolioAllocation(
                sector="Consumer Staples",
                weight_pct=12,
                rationale="Late-cycle defense, pricing power, dividend income"
            ),
            PortfolioAllocation(
                sector="Energy",
                weight_pct=12,
                rationale="Inflation hedge, strong cash generation, supply discipline"
            ),
            PortfolioAllocation(
                sector="Industrials",
                weight_pct=10,
                rationale="Infrastructure spending, aerospace recovery, select exposure"
            ),
            PortfolioAllocation(
                sector="Communication Services",
                weight_pct=8,
                rationale="Selective exposure to META, GOOGL for recovery"
            ),
            PortfolioAllocation(
                sector="Consumer Discretionary",
                weight_pct=5,
                rationale="Underweight cyclical, Amazon and Walmart only"
            ),
            PortfolioAllocation(
                sector="Utilities",
                weight_pct=2,
                rationale="Minimal exposure given rate sensitivity"
            )
        ]


def get_demo_market_regime() -> MarketRegime:
    """Returns current market regime assessment"""
    return MarketRegime.TRANSITIONAL
