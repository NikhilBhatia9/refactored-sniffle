"""
Recommendation Engine - Generates investment recommendations.
Filters and ranks stocks by strategy: growth, value, defensive, contrarian.
"""
from typing import List, Optional
from app.models.schemas import StockRecommendation, Strategy
from app.services import demo_data
import logging

logger = logging.getLogger(__name__)


class RecommendationEngine:
    """
    Generates and filters stock recommendations based on investment strategies.
    Implements different lenses: growth, value, defensive, contrarian.
    """
    
    def __init__(self):
        self.all_recommendations = demo_data.get_demo_stock_recommendations()
    
    def get_top_opportunities(self, n: int = 10) -> List[StockRecommendation]:
        """
        Returns top N investment opportunities across all sectors.
        Sorted by conviction score.
        """
        sorted_recs = sorted(
            self.all_recommendations,
            key=lambda x: x.conviction_score,
            reverse=True
        )
        return sorted_recs[:n]
    
    def get_sector_opportunities(
        self, 
        sector: str, 
        n: int = 5
    ) -> List[StockRecommendation]:
        """
        Returns best picks within a specific sector.
        """
        sector_recs = [
            rec for rec in self.all_recommendations 
            if rec.sector.lower() == sector.lower()
        ]
        
        sorted_recs = sorted(
            sector_recs,
            key=lambda x: x.conviction_score,
            reverse=True
        )
        
        return sorted_recs[:n]
    
    def get_defensive_picks(self, n: int = 10) -> List[StockRecommendation]:
        """
        Returns defensive/recession-resistant picks.
        
        Criteria:
        - Defensive sectors (Healthcare, Consumer Staples, Utilities)
        - High dividend yield (>2%)
        - Lower volatility (proxied by sector)
        - Strong balance sheets
        
        Philosophy: "Sleep well at night" - Peter Lynch
        """
        defensive_sectors = ['Healthcare', 'Consumer Staples', 'Utilities']
        
        defensive_recs = [
            rec for rec in self.all_recommendations
            if (rec.sector in defensive_sectors or 
                (rec.dividend_yield and rec.dividend_yield > 2.0))
        ]
        
        # Sort by combination of conviction and dividend yield
        sorted_recs = sorted(
            defensive_recs,
            key=lambda x: x.conviction_score + (x.dividend_yield or 0) * 5,
            reverse=True
        )
        
        return sorted_recs[:n]
    
    def get_growth_picks(self, n: int = 10) -> List[StockRecommendation]:
        """
        Returns high-growth momentum plays.
        
        Criteria:
        - Growth sectors (Technology, Healthcare biotech, Communication)
        - High revenue/earnings growth
        - PEG ratio < 2.5 (growth at reasonable price - Peter Lynch GARP)
        - Strong secular tailwinds
        
        Philosophy: "The best business to own is one that over time can employ 
        large amounts of capital at very high rates of return" - Warren Buffett
        """
        growth_sectors = [
            'Technology', 
            'Communication Services', 
            'Healthcare',
            'Consumer Discretionary'
        ]
        
        growth_recs = [
            rec for rec in self.all_recommendations
            if (rec.sector in growth_sectors and
                rec.peg_ratio and rec.peg_ratio < 3.0 and
                len(rec.tailwinds) >= 3)
        ]
        
        # Sort by conviction score
        sorted_recs = sorted(
            growth_recs,
            key=lambda x: x.conviction_score,
            reverse=True
        )
        
        return sorted_recs[:n]
    
    def get_value_picks(self, n: int = 10) -> List[StockRecommendation]:
        """
        Returns deep value/turnaround candidates.
        
        Criteria:
        - Low P/E ratio (<15)
        - Significant upside to fair value (>15%)
        - Out of favor but fundamentals improving
        - Margin of safety
        
        Philosophy: "Price is what you pay, value is what you get" - Warren Buffett
        """
        value_recs = [
            rec for rec in self.all_recommendations
            if (rec.pe_ratio and rec.pe_ratio < 20 and
                rec.upside_potential_pct > 10)
        ]
        
        # Sort by upside potential (margin of safety)
        sorted_recs = sorted(
            value_recs,
            key=lambda x: x.upside_potential_pct,
            reverse=True
        )
        
        return sorted_recs[:n]
    
    def get_contrarian_picks(self, n: int = 10) -> List[StockRecommendation]:
        """
        Returns contrarian/oversold opportunities with improving fundamentals.
        
        Criteria:
        - Sectors currently out of favor (bearish outlook)
        - More tailwinds than headwinds emerging
        - Significant upside potential
        - Turning points in fundamentals
        
        Philosophy: "The time to buy is when there's blood in the streets" - Baron Rothschild
        "You make money by buying things that are down and out" - Howard Marks
        """
        # Look for stocks with strong upside despite bearish sector sentiment
        contrarian_recs = [
            rec for rec in self.all_recommendations
            if (rec.upside_potential_pct > 15 and
                len(rec.tailwinds) > len(rec.headwinds))
        ]
        
        # Sort by upside potential
        sorted_recs = sorted(
            contrarian_recs,
            key=lambda x: x.upside_potential_pct,
            reverse=True
        )
        
        return sorted_recs[:n]
    
    def filter_recommendations(
        self,
        strategy: Optional[Strategy] = Strategy.ALL,
        sector: Optional[str] = None,
        min_conviction: Optional[float] = None,
        limit: int = 20
    ) -> List[StockRecommendation]:
        """
        Filters recommendations based on multiple criteria.
        
        Args:
            strategy: Investment strategy filter (growth/value/defensive/contrarian)
            sector: Sector filter
            min_conviction: Minimum conviction score
            limit: Maximum number of results
        """
        # Start with appropriate strategy subset
        if strategy == Strategy.GROWTH:
            filtered = self.get_growth_picks(n=limit)
        elif strategy == Strategy.VALUE:
            filtered = self.get_value_picks(n=limit)
        elif strategy == Strategy.DEFENSIVE:
            filtered = self.get_defensive_picks(n=limit)
        elif strategy == Strategy.CONTRARIAN:
            filtered = self.get_contrarian_picks(n=limit)
        else:
            filtered = self.all_recommendations.copy()
        
        # Apply sector filter
        if sector:
            filtered = [
                rec for rec in filtered
                if rec.sector.lower() == sector.lower()
            ]
        
        # Apply conviction filter
        if min_conviction:
            filtered = [
                rec for rec in filtered
                if rec.conviction_score >= min_conviction
            ]
        
        # Sort by conviction and limit
        sorted_recs = sorted(
            filtered,
            key=lambda x: x.conviction_score,
            reverse=True
        )
        
        return sorted_recs[:limit]
    
    def get_recommendation_by_ticker(self, ticker: str) -> Optional[StockRecommendation]:
        """
        Returns detailed recommendation for a specific ticker.
        """
        for rec in self.all_recommendations:
            if rec.ticker.upper() == ticker.upper():
                return rec
        return None
    
    def get_portfolio_ideas(
        self,
        risk_tolerance: str = "moderate",
        n: int = 10
    ) -> List[StockRecommendation]:
        """
        Returns a diversified portfolio of recommendations based on risk tolerance.
        
        Conservative: Heavy defensive, income focus
        Moderate: Balanced across strategies
        Aggressive: Growth and cyclical focus
        """
        if risk_tolerance.lower() == "conservative":
            # 60% defensive, 40% quality growth
            defensive = self.get_defensive_picks(n=int(n * 0.6))
            quality_growth = self.get_growth_picks(n=int(n * 0.4))
            return defensive + quality_growth
        
        elif risk_tolerance.lower() == "aggressive":
            # 60% growth, 30% contrarian, 10% value
            growth = self.get_growth_picks(n=int(n * 0.6))
            contrarian = self.get_contrarian_picks(n=int(n * 0.3))
            value = self.get_value_picks(n=int(n * 0.1))
            return growth + contrarian + value
        
        else:  # moderate
            # 40% growth, 30% defensive, 20% value, 10% contrarian
            growth = self.get_growth_picks(n=int(n * 0.4))
            defensive = self.get_defensive_picks(n=int(n * 0.3))
            value = self.get_value_picks(n=int(n * 0.2))
            contrarian = self.get_contrarian_picks(n=int(n * 0.1))
            return growth + defensive + value + contrarian
