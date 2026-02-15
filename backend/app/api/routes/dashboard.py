"""
Dashboard API endpoint - Provides comprehensive dashboard summary.
Combines macro data, sector rankings, recommendations, and portfolio suggestions.
"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import DashboardSummary
from app.services import demo_data
from app.services.recommendation_engine import RecommendationEngine
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardSummary)
async def get_dashboard():
    """
    Returns complete dashboard summary with all key data.
    
    This is the primary endpoint for the main dashboard view.
    Combines:
    - Macro economic snapshot
    - Top stock recommendations
    - Sector rankings and analyses
    - Geopolitical risk assessments
    - Suggested portfolio allocation
    - Market regime classification
    """
    try:
        # Get all data components
        macro_snapshot = demo_data.get_demo_macro_snapshot()
        sector_analyses = demo_data.get_demo_sector_analyses()
        geopolitical_risks = demo_data.get_demo_geopolitical_risks()
        market_regime = demo_data.get_demo_market_regime()
        
        # Get top recommendations
        rec_engine = RecommendationEngine()
        top_recommendations = rec_engine.get_top_opportunities(n=5)
        
        # Get suggested allocation (moderate by default)
        suggested_allocation = demo_data.get_demo_portfolio_allocation("moderate")
        
        # Sort sectors by score
        sorted_sectors = sorted(
            sector_analyses,
            key=lambda x: x.score,
            reverse=True
        )
        
        return DashboardSummary(
            macro_snapshot=macro_snapshot,
            top_recommendations=top_recommendations,
            sector_rankings=sorted_sectors,
            geopolitical_risks=geopolitical_risks,
            suggested_allocation=suggested_allocation,
            market_regime=market_regime
        )
        
    except Exception as e:
        logger.error(f"Error generating dashboard: {e}")
        raise HTTPException(status_code=500, detail=str(e))
