"""
Portfolio API endpoints - Portfolio allocation suggestions.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.models.schemas import PortfolioAllocation, RiskTolerance, StockRecommendation
from app.services import demo_data
from app.services.recommendation_engine import RecommendationEngine
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])


@router.get("/allocation", response_model=List[PortfolioAllocation])
async def get_portfolio_allocation(
    risk_tolerance: RiskTolerance = Query(
        RiskTolerance.MODERATE,
        description="Risk tolerance: conservative, moderate, or aggressive"
    )
):
    """
    Returns recommended portfolio allocation by sector based on risk tolerance.
    
    **Conservative Portfolio** (Capital preservation focus):
    - Heavy defensive sectors (Healthcare, Staples, Utilities)
    - High dividend yields
    - Lower volatility
    - Recession protection
    
    **Moderate Portfolio** (Balanced growth and income):
    - Balanced sector exposure
    - Mix of growth and defensive
    - Moderate dividend yield
    - Diversified risk
    
    **Aggressive Portfolio** (Maximum growth potential):
    - Heavy growth sectors (Technology, Communication)
    - Higher beta stocks
    - Emphasis on secular trends
    - Accept higher volatility for higher returns
    
    Each allocation includes:
    - Sector name
    - Recommended weight (%)
    - Rationale for the allocation
    
    Allocations are dynamically adjusted based on:
    - Current economic cycle
    - Sector valuations
    - Macro environment
    - Risk/reward profiles
    """
    try:
        allocation = demo_data.get_demo_portfolio_allocation(risk_tolerance.value)
        
        # Sort by weight (highest first)
        sorted_allocation = sorted(
            allocation,
            key=lambda x: x.weight_pct,
            reverse=True
        )
        
        return sorted_allocation
        
    except Exception as e:
        logger.error(f"Error generating portfolio allocation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recommendations", response_model=List[StockRecommendation])
async def get_portfolio_recommendations(
    risk_tolerance: RiskTolerance = Query(
        RiskTolerance.MODERATE,
        description="Risk tolerance: conservative, moderate, or aggressive"
    ),
    n: int = Query(
        10,
        ge=5,
        le=20,
        description="Number of stock recommendations"
    )
):
    """
    Returns a diversified portfolio of stock recommendations based on risk tolerance.
    
    The recommendations are selected to create a balanced portfolio appropriate
    for the investor's risk profile:
    
    **Conservative**: 60% defensive + 40% quality growth
    **Moderate**: 40% growth + 30% defensive + 20% value + 10% contrarian
    **Aggressive**: 60% growth + 30% contrarian + 10% value
    
    Returns actual stock picks with full analysis for each position.
    """
    try:
        rec_engine = RecommendationEngine()
        recommendations = rec_engine.get_portfolio_ideas(
            risk_tolerance=risk_tolerance.value,
            n=n
        )
        
        return recommendations
        
    except Exception as e:
        logger.error(f"Error generating portfolio recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))
