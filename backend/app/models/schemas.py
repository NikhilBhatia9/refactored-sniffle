"""
Pydantic models for API request/response validation.
These models define the shape of data flowing through the API.
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
from enum import Enum


class Recommendation(str, Enum):
    """Investment recommendation levels"""
    STRONG_BUY = "strong_buy"
    BUY = "buy"
    HOLD = "hold"
    SELL = "sell"
    STRONG_SELL = "strong_sell"


class Outlook(str, Enum):
    """Sector outlook"""
    BULLISH = "bullish"
    BEARISH = "bearish"
    NEUTRAL = "neutral"


class RiskLevel(str, Enum):
    """Risk levels for geopolitical events"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class EconomicCycle(str, Enum):
    """Economic cycle phases"""
    EXPANSION = "expansion"
    PEAK = "peak"
    CONTRACTION = "contraction"
    TROUGH = "trough"


class MarketRegime(str, Enum):
    """Market regime classifications"""
    BULL = "bull"
    BEAR = "bear"
    TRANSITIONAL = "transitional"
    VOLATILE = "volatile"


class SectorAnalysis(BaseModel):
    """Comprehensive sector analysis with scoring and outlook"""
    sector: str = Field(..., description="Sector name (e.g., Technology, Healthcare)")
    score: float = Field(..., ge=0, le=100, description="Sector attractiveness score (0-100)")
    economic_cycle_phase: EconomicCycle = Field(..., description="Best cycle phase for this sector")
    outlook: Outlook = Field(..., description="Current outlook: bullish, bearish, or neutral")
    top_picks: List[str] = Field(default_factory=list, description="Top stock tickers in sector")
    headwinds: List[str] = Field(default_factory=list, description="Current sector headwinds")
    tailwinds: List[str] = Field(default_factory=list, description="Current sector tailwinds")
    rationale: str = Field(..., description="Detailed investment rationale")
    trend: Optional[str] = Field(None, description="Improving, declining, or stable")
    

class MacroSnapshot(BaseModel):
    """Current macroeconomic indicators snapshot"""
    gdp_growth: float = Field(..., description="GDP growth rate (annual %)")
    inflation_rate: float = Field(..., description="CPI inflation rate (annual %)")
    unemployment: float = Field(..., description="Unemployment rate (%)")
    fed_funds_rate: float = Field(..., description="Federal funds rate (%)")
    yield_curve_spread: float = Field(..., description="10Y-2Y Treasury spread (bps)")
    consumer_confidence: float = Field(..., description="Consumer confidence index")
    vix: float = Field(..., description="VIX volatility index")
    dollar_index: float = Field(..., description="US Dollar Index (DXY)")
    oil_price: float = Field(..., description="WTI crude oil price ($/barrel)")
    economic_cycle_phase: EconomicCycle = Field(..., description="Current cycle phase")
    last_updated: datetime = Field(default_factory=datetime.now)


class StockRecommendation(BaseModel):
    """Detailed stock recommendation with conviction scoring"""
    ticker: str = Field(..., description="Stock ticker symbol")
    company_name: str = Field(..., description="Company name")
    sector: str = Field(..., description="GICS sector")
    recommendation: Recommendation = Field(..., description="Buy/sell recommendation")
    conviction_score: float = Field(..., ge=0, le=100, description="Conviction level (0-100)")
    current_price: float = Field(..., description="Current stock price")
    fair_value_estimate: float = Field(..., description="Estimated fair value")
    upside_potential_pct: float = Field(..., description="Upside potential percentage")
    pe_ratio: Optional[float] = Field(None, description="Price-to-earnings ratio")
    peg_ratio: Optional[float] = Field(None, description="PEG ratio")
    dividend_yield: Optional[float] = Field(None, description="Dividend yield (%)")
    market_cap: float = Field(..., description="Market capitalization (billions)")
    headwinds: List[str] = Field(default_factory=list, description="Key headwinds")
    tailwinds: List[str] = Field(default_factory=list, description="Key tailwinds")
    rationale: str = Field(..., description="Investment thesis and rationale")
    time_horizon: str = Field(default="12-18 months", description="Recommended holding period")
    
    class Config:
        use_enum_values = True


class GeopoliticalRisk(BaseModel):
    """Geopolitical risk assessment"""
    region: str = Field(..., description="Geographic region or country")
    risk_level: RiskLevel = Field(..., description="Risk severity level")
    description: str = Field(..., description="Risk description")
    affected_sectors: List[str] = Field(default_factory=list, description="Sectors impacted")
    investment_implication: str = Field(..., description="How to adjust portfolio")


class PortfolioAllocation(BaseModel):
    """Recommended portfolio allocation by sector"""
    sector: str = Field(..., description="Sector name")
    weight_pct: float = Field(..., ge=0, le=100, description="Recommended weight (%)")
    rationale: str = Field(..., description="Why this allocation")


class DashboardSummary(BaseModel):
    """Complete dashboard data combining all analyses"""
    macro_snapshot: MacroSnapshot
    top_recommendations: List[StockRecommendation]
    sector_rankings: List[SectorAnalysis]
    geopolitical_risks: List[GeopoliticalRisk]
    suggested_allocation: List[PortfolioAllocation]
    market_regime: MarketRegime
    data_source: str = Field(default="demo", description="Data source: 'demo' or 'live'")
    last_updated: datetime = Field(default_factory=datetime.now)


class RiskTolerance(str, Enum):
    """Investor risk tolerance levels"""
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"


class Strategy(str, Enum):
    """Investment strategies"""
    ALL = "all"
    GROWTH = "growth"
    VALUE = "value"
    DEFENSIVE = "defensive"
    CONTRARIAN = "contrarian"
