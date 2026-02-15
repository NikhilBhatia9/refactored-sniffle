"""
Recommendations API endpoints - Stock recommendations and filters.
"""
from fastapi import APIRouter, HTTPException, Query, Path
from typing import List, Optional
from app.models.schemas import StockRecommendation, Strategy
from app.services.recommendation_engine import RecommendationEngine
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.get("", response_model=List[StockRecommendation])
async def get_recommendations(
    strategy: Optional[Strategy] = Query(
        Strategy.ALL,
        description="Investment strategy: all, growth, value, defensive, contrarian"
    ),
    sector: Optional[str] = Query(
        None,
        description="Filter by sector (e.g., Technology, Healthcare)"
    ),
    min_conviction: Optional[float] = Query(
        None,
        ge=0,
        le=100,
        description="Minimum conviction score (0-100)"
    ),
    limit: int = Query(
        20,
        ge=1,
        le=50,
        description="Maximum number of recommendations to return"
    )
):
    """
    Returns stock recommendations filtered by strategy, sector, and conviction.
    
    Strategies:
    - **all**: All recommendations sorted by conviction
    - **growth**: High-growth momentum plays (Tech, Healthcare, Comm Services)
    - **value**: Deep value with margin of safety (low P/E, high upside)
    - **defensive**: Recession-resistant, high dividend (Staples, Healthcare, Utilities)
    - **contrarian**: Oversold with improving fundamentals
    
    Each recommendation includes:
    - Conviction score (0-100)
    - Current price vs fair value estimate
    - Upside potential percentage
    - Key fundamentals (P/E, PEG, dividend yield)
    - Headwinds and tailwinds
    - Detailed investment rationale
    """
    try:
        rec_engine = RecommendationEngine()
        
        recommendations = rec_engine.filter_recommendations(
            strategy=strategy,
            sector=sector,
            min_conviction=min_conviction,
            limit=limit
        )
        
        return recommendations
        
    except Exception as e:
        logger.error(f"Error fetching recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{ticker}", response_model=StockRecommendation)
async def get_recommendation_detail(
    ticker: str = Path(..., description="Stock ticker symbol (e.g., AAPL, MSFT)")
):
    """
    Returns detailed recommendation for a specific stock ticker.
    
    Includes:
    - Full investment thesis and rationale
    - Complete list of tailwinds and headwinds
    - Valuation analysis and fair value estimate
    - Recommendation level (strong buy to strong sell)
    - Conviction score
    - Time horizon
    """
    try:
        rec_engine = RecommendationEngine()
        recommendation = rec_engine.get_recommendation_by_ticker(ticker)
        
        if not recommendation:
            raise HTTPException(
                status_code=404,
                detail=f"No recommendation found for ticker '{ticker}'. This ticker may not be in our coverage universe."
            )
        
        return recommendation
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching recommendation for {ticker}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
