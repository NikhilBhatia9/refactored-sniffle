"""
Sectors API endpoints - Sector analysis and rankings.
"""
from fastapi import APIRouter, HTTPException, Path
from typing import List
from app.models.schemas import SectorAnalysis
from app.services import demo_data
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/sectors", tags=["sectors"])


@router.get("", response_model=List[SectorAnalysis])
async def get_all_sectors():
    """
    Returns analysis for all sectors with scores and rankings.
    
    Provides:
    - Sector score (0-100)
    - Economic cycle alignment
    - Outlook (bullish/bearish/neutral)
    - Top stock picks in sector
    - Headwinds and tailwinds
    - Investment rationale
    - Trend direction
    """
    try:
        sectors = demo_data.get_demo_sector_analyses()
        
        # Sort by score (highest first)
        sorted_sectors = sorted(
            sectors,
            key=lambda x: x.score,
            reverse=True
        )
        
        return sorted_sectors
        
    except Exception as e:
        logger.error(f"Error fetching sectors: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{sector_name}", response_model=SectorAnalysis)
async def get_sector_detail(
    sector_name: str = Path(..., description="Sector name (e.g., Technology, Healthcare)")
):
    """
    Returns detailed analysis for a specific sector.
    
    Includes full breakdown of:
    - Investment thesis and rationale
    - All headwinds and tailwinds
    - Top stock recommendations in sector
    - Cycle positioning
    """
    try:
        sectors = demo_data.get_demo_sector_analyses()
        
        # Find matching sector (case-insensitive)
        for sector in sectors:
            if sector.sector.lower() == sector_name.lower().replace('-', ' '):
                return sector
        
        raise HTTPException(
            status_code=404,
            detail=f"Sector '{sector_name}' not found. Available sectors: Technology, Healthcare, Financials, Energy, Consumer Staples, Consumer Discretionary, Industrials, Materials, Real Estate, Communication Services, Utilities"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching sector {sector_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
