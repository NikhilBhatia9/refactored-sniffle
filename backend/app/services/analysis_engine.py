"""
Analysis Engine - The brain of Alpha Oracle.
Implements investment logic following strategies of legendary investors.
Performs cycle analysis, sector scoring, and valuation assessments.
"""
from typing import Dict, List, Tuple
from app.models.schemas import (
    EconomicCycle, MacroSnapshot, SectorAnalysis, 
    StockRecommendation, Outlook, Recommendation
)
import logging

logger = logging.getLogger(__name__)


class AnalysisEngine:
    """
    Core analysis engine implementing investment philosophy.
    Encodes strategies from Buffett, Lynch, Dalio, and Marks.
    """
    
    # Economic cycle sector preferences based on historical performance
    CYCLE_SECTOR_MATRIX = {
        EconomicCycle.EXPANSION: {
            # Early expansion favors cyclicals and interest-rate sensitive
            'Consumer Discretionary': 1.3,
            'Financials': 1.25,
            'Real Estate': 1.2,
            'Industrials': 1.2,
            'Technology': 1.15,
            'Materials': 1.1,
            'Communication Services': 1.1,
            'Consumer Staples': 0.9,
            'Healthcare': 0.95,
            'Utilities': 0.85,
            'Energy': 0.9
        },
        EconomicCycle.PEAK: {
            # Late cycle favors defensives and commodities
            'Energy': 1.3,
            'Materials': 1.2,
            'Healthcare': 1.2,
            'Consumer Staples': 1.15,
            'Utilities': 1.1,
            'Technology': 0.9,
            'Communication Services': 0.95,
            'Financials': 0.95,
            'Consumer Discretionary': 0.8,
            'Real Estate': 0.85,
            'Industrials': 0.9
        },
        EconomicCycle.CONTRACTION: {
            # Recession favors quality defensives
            'Healthcare': 1.35,
            'Consumer Staples': 1.3,
            'Utilities': 1.25,
            'Communication Services': 1.0,
            'Technology': 0.95,
            'Financials': 0.75,
            'Energy': 0.8,
            'Consumer Discretionary': 0.7,
            'Industrials': 0.7,
            'Materials': 0.65,
            'Real Estate': 0.7
        },
        EconomicCycle.TROUGH: {
            # Early recovery favors beaten-down cyclicals
            'Financials': 1.3,
            'Consumer Discretionary': 1.25,
            'Industrials': 1.2,
            'Materials': 1.15,
            'Real Estate': 1.15,
            'Technology': 1.1,
            'Energy': 1.0,
            'Communication Services': 1.05,
            'Healthcare': 0.95,
            'Consumer Staples': 0.9,
            'Utilities': 0.9
        }
    }
    
    def determine_economic_cycle(self, macro_data: MacroSnapshot) -> EconomicCycle:
        """
        Determines current economic cycle phase using leading indicators.
        
        Logic:
        - EXPANSION: GDP strong, unemployment falling, yield curve normal
        - PEAK: GDP slowing, inflation rising, yield curve flattening/inverting
        - CONTRACTION: GDP negative, unemployment rising, rates cutting
        - TROUGH: GDP stabilizing, stimulus active, sentiment very negative
        """
        gdp = macro_data.gdp_growth
        unemployment = macro_data.unemployment
        inflation = macro_data.inflation_rate
        yield_curve = macro_data.yield_curve_spread
        vix = macro_data.vix
        
        # Yield curve inversion is strong recession signal
        if yield_curve < -10:
            if gdp < 0:
                return EconomicCycle.CONTRACTION
            else:
                return EconomicCycle.PEAK
        
        # High inflation + slowing growth = late cycle
        if inflation > 3.0 and gdp < 2.5:
            return EconomicCycle.PEAK
        
        # Negative growth = recession
        if gdp < 0:
            return EconomicCycle.CONTRACTION
        
        # Low unemployment + strong growth = expansion
        if unemployment < 4.5 and gdp > 2.0:
            return EconomicCycle.EXPANSION
        
        # High unemployment + stabilizing = trough
        if unemployment > 6.0 and vix > 25:
            return EconomicCycle.TROUGH
        
        # Default to expansion in ambiguous cases
        return EconomicCycle.EXPANSION
    
    def score_sector(
        self, 
        sector: str, 
        cycle_phase: EconomicCycle,
        macro_data: MacroSnapshot,
        sector_data: SectorAnalysis
    ) -> float:
        """
        Scores sector attractiveness (0-100) based on multiple factors.
        
        Components:
        - 40%: Cycle alignment (how well suited to current phase)
        - 25%: Valuation (relative to historical norms)
        - 20%: Tailwind/headwind balance
        - 15%: Macro sensitivity (rates, inflation, growth)
        """
        # Cycle alignment score (0-100)
        cycle_multiplier = self.CYCLE_SECTOR_MATRIX.get(cycle_phase, {}).get(sector, 1.0)
        cycle_score = min(100, cycle_multiplier * 60)  # Max 100, typical 60-80
        
        # Valuation score (simplified - in production would use P/E, P/B ratios)
        # For now, assume sectors with positive outlook have better valuations
        if sector_data.outlook == Outlook.BULLISH:
            valuation_score = 70
        elif sector_data.outlook == Outlook.BEARISH:
            valuation_score = 40
        else:
            valuation_score = 55
        
        # Tailwind/headwind balance
        tailwind_count = len(sector_data.tailwinds)
        headwind_count = len(sector_data.headwinds)
        net_winds = tailwind_count - headwind_count
        wind_score = min(100, max(0, 50 + net_winds * 10))
        
        # Macro sensitivity adjustments
        macro_score = 50
        
        # Rate-sensitive sectors penalized when rates high
        if macro_data.fed_funds_rate > 4.5:
            if sector in ['Real Estate', 'Utilities']:
                macro_score -= 20
            elif sector in ['Financials']:
                macro_score += 10  # Banks benefit from higher rates
        
        # Inflation hedge sectors favored when inflation high
        if macro_data.inflation_rate > 3.0:
            if sector in ['Energy', 'Materials', 'Consumer Staples']:
                macro_score += 15
        
        # Risk-off benefits defensives
        if macro_data.vix > 20:
            if sector in ['Healthcare', 'Consumer Staples', 'Utilities']:
                macro_score += 15
        
        # Composite score
        final_score = (
            cycle_score * 0.40 +
            valuation_score * 0.25 +
            wind_score * 0.20 +
            macro_score * 0.15
        )
        
        return round(min(100, max(0, final_score)), 1)
    
    def analyze_headwinds_tailwinds(
        self, 
        sector: str,
        macro_data: MacroSnapshot
    ) -> Tuple[List[str], List[str]]:
        """
        Generates sector-specific headwinds and tailwinds.
        Categorized by: Political, Geopolitical, Economic, Technological, Demographic
        """
        # This would be enhanced with real-time news analysis in production
        # For now, return static analysis that's contextual to macro environment
        
        headwinds = []
        tailwinds = []
        
        # Rate environment impacts
        if macro_data.fed_funds_rate > 4.0:
            if sector in ['Real Estate', 'Utilities', 'Consumer Discretionary']:
                headwinds.append("High interest rate environment pressuring valuations")
            if sector == 'Financials':
                tailwinds.append("Net interest margin expansion from higher rates")
        
        # Inflation impacts
        if macro_data.inflation_rate > 3.0:
            if sector in ['Energy', 'Materials']:
                tailwinds.append("Inflation drives commodity demand and pricing")
            if sector in ['Consumer Discretionary', 'Retail']:
                headwinds.append("Input cost inflation pressuring margins")
            if sector == 'Consumer Staples':
                tailwinds.append("Pricing power to pass through inflation")
        
        # Growth impacts
        if macro_data.gdp_growth < 2.0:
            if sector in ['Consumer Discretionary', 'Industrials', 'Materials']:
                headwinds.append("Slowing economic growth hurts cyclical demand")
            if sector in ['Healthcare', 'Consumer Staples', 'Utilities']:
                tailwinds.append("Defensive characteristics in slower growth environment")
        
        return headwinds, tailwinds
    
    def calculate_fair_value(self, fundamentals: Dict) -> float:
        """
        Estimates fair value using simple blended approach.
        
        In production would use:
        - DCF model with industry-specific assumptions
        - Relative valuation vs peers
        - Sum-of-parts for conglomerates
        
        For now: Simple P/E based approach
        """
        try:
            current_price = float(fundamentals.get('05. price', 100))
            pe_ratio = float(fundamentals.get('PERatio', 20))
            
            # Assume fair P/E is 18 for market
            fair_pe = 18.0
            
            if pe_ratio > 0:
                fair_value = current_price * (fair_pe / pe_ratio)
                return round(fair_value, 2)
            else:
                return current_price
                
        except Exception as e:
            logger.error(f"Error calculating fair value: {e}")
            return 100.0
    
    def calculate_conviction_score(
        self,
        ticker: str,
        sector_score: float,
        valuation_discount: float,
        tailwind_count: int,
        headwind_count: int,
        macro_alignment: float
    ) -> float:
        """
        Calculates conviction score (0-100) for a stock recommendation.
        
        Components:
        - 25%: Valuation attractiveness (discount to fair value)
        - 25%: Growth prospects (simplified)
        - 20%: Macro/sector alignment
        - 15%: Tailwind strength
        - 15%: Technical/momentum (simplified)
        """
        # Valuation component (25%)
        # Discount >20% = high score, Premium >20% = low score
        valuation_component = min(100, max(0, 50 + valuation_discount * 2))
        
        # Growth component (25%) - simplified, would use actual EPS growth
        growth_component = 65  # Assume moderate growth
        
        # Macro alignment (20%)
        macro_component = macro_alignment
        
        # Tailwind strength (15%)
        net_winds = tailwind_count - headwind_count
        wind_component = min(100, max(0, 50 + net_winds * 15))
        
        # Momentum (15%) - simplified
        momentum_component = 60
        
        conviction = (
            valuation_component * 0.25 +
            growth_component * 0.25 +
            macro_component * 0.20 +
            wind_component * 0.15 +
            momentum_component * 0.15
        )
        
        return round(min(100, max(0, conviction)), 1)
    
    def generate_stock_recommendation(
        self,
        ticker: str,
        company_name: str,
        sector: str,
        current_price: float,
        fair_value: float,
        pe_ratio: float,
        peg_ratio: float,
        dividend_yield: float,
        market_cap: float,
        sector_score: float,
        macro_data: MacroSnapshot,
        headwinds: List[str],
        tailwinds: List[str],
        rationale: str
    ) -> StockRecommendation:
        """
        Generates comprehensive stock recommendation with conviction scoring.
        """
        # Calculate upside
        upside_pct = ((fair_value - current_price) / current_price) * 100
        
        # Determine recommendation level
        if upside_pct > 20:
            recommendation = Recommendation.STRONG_BUY
        elif upside_pct > 10:
            recommendation = Recommendation.BUY
        elif upside_pct > -5:
            recommendation = Recommendation.HOLD
        elif upside_pct > -15:
            recommendation = Recommendation.SELL
        else:
            recommendation = Recommendation.STRONG_SELL
        
        # Calculate conviction score
        conviction = self.calculate_conviction_score(
            ticker=ticker,
            sector_score=sector_score,
            valuation_discount=upside_pct,
            tailwind_count=len(tailwinds),
            headwind_count=len(headwinds),
            macro_alignment=sector_score
        )
        
        return StockRecommendation(
            ticker=ticker,
            company_name=company_name,
            sector=sector,
            recommendation=recommendation,
            conviction_score=conviction,
            current_price=current_price,
            fair_value_estimate=fair_value,
            upside_potential_pct=round(upside_pct, 1),
            pe_ratio=pe_ratio,
            peg_ratio=peg_ratio,
            dividend_yield=dividend_yield,
            market_cap=market_cap,
            headwinds=headwinds,
            tailwinds=tailwinds,
            rationale=rationale
        )
    
    def optimize_portfolio(
        self,
        recommendations: List[StockRecommendation],
        risk_tolerance: str
    ) -> Dict[str, float]:
        """
        Optimizes portfolio allocation based on recommendations and risk tolerance.
        
        Conservative: More defensive sectors, lower vol
        Moderate: Balanced
        Aggressive: More growth/cyclical, higher vol
        """
        # Group by sector
        sector_scores = {}
        for rec in recommendations:
            if rec.sector not in sector_scores:
                sector_scores[rec.sector] = []
            sector_scores[rec.sector].append(rec.conviction_score)
        
        # Average conviction by sector
        sector_avg = {
            sector: sum(scores) / len(scores)
            for sector, scores in sector_scores.items()
        }
        
        # Adjust based on risk tolerance
        if risk_tolerance == 'conservative':
            # Boost defensive sectors
            defensive_sectors = ['Healthcare', 'Consumer Staples', 'Utilities']
            for sector in defensive_sectors:
                if sector in sector_avg:
                    sector_avg[sector] *= 1.3
        elif risk_tolerance == 'aggressive':
            # Boost growth sectors
            growth_sectors = ['Technology', 'Communication Services', 'Consumer Discretionary']
            for sector in growth_sectors:
                if sector in sector_avg:
                    sector_avg[sector] *= 1.3
        
        # Normalize to 100%
        total = sum(sector_avg.values())
        allocation = {
            sector: round((score / total) * 100, 1)
            for sector, score in sector_avg.items()
        }
        
        return allocation
