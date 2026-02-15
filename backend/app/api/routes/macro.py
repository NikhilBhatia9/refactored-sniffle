"""
Macro API endpoints - Economic indicators and cycle analysis.
"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import MacroSnapshot, GeopoliticalRisk, EconomicCycle
from app.services import demo_data
from app.services.analysis_engine import AnalysisEngine
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/macro", tags=["macro"])


@router.get("", response_model=MacroSnapshot)
async def get_macro_snapshot():
    """
    Returns current macroeconomic snapshot.
    
    Provides key indicators:
    - GDP growth rate
    - Inflation (CPI)
    - Unemployment rate
    - Federal funds rate
    - Yield curve spread (10Y-2Y)
    - Consumer confidence index
    - VIX (volatility index)
    - Dollar index (DXY)
    - Oil price (WTI)
    - Economic cycle phase
    
    These indicators drive sector allocation and stock selection.
    """
    try:
        macro_snapshot = demo_data.get_demo_macro_snapshot()
        return macro_snapshot
        
    except Exception as e:
        logger.error(f"Error fetching macro snapshot: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cycle", response_model=dict)
async def get_cycle_analysis():
    """
    Returns economic cycle analysis and sector implications.
    
    Analyzes current position in economic cycle:
    - **Expansion**: Early cycle recovery (favor cyclicals, financials, discretionary)
    - **Peak**: Late cycle (favor energy, materials, defensives)
    - **Contraction**: Recession (favor healthcare, staples, utilities)
    - **Trough**: Bottom (favor beaten-down cyclicals for recovery)
    
    Returns:
    - Current cycle phase
    - Cycle characteristics
    - Favored sectors
    - Sectors to avoid
    - Key indicators supporting assessment
    """
    try:
        macro_snapshot = demo_data.get_demo_macro_snapshot()
        analysis_engine = AnalysisEngine()
        
        cycle_phase = analysis_engine.determine_economic_cycle(macro_snapshot)
        
        # Get sector preferences for this cycle
        sector_preferences = analysis_engine.CYCLE_SECTOR_MATRIX.get(cycle_phase, {})
        
        # Sort sectors by preference
        favored_sectors = sorted(
            sector_preferences.items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]
        
        avoid_sectors = sorted(
            sector_preferences.items(),
            key=lambda x: x[1]
        )[:5]
        
        # Cycle characteristics
        cycle_info = {
            EconomicCycle.EXPANSION: {
                "description": "Early expansion with accelerating growth",
                "characteristics": [
                    "GDP growth accelerating",
                    "Unemployment falling",
                    "Corporate profits improving",
                    "Yield curve normalizing"
                ]
            },
            EconomicCycle.PEAK: {
                "description": "Late cycle expansion nearing peak",
                "characteristics": [
                    "GDP growth slowing",
                    "Inflation rising",
                    "Yield curve flattening/inverting",
                    "Tight labor market"
                ]
            },
            EconomicCycle.CONTRACTION: {
                "description": "Recession with contracting activity",
                "characteristics": [
                    "Negative GDP growth",
                    "Rising unemployment",
                    "Corporate profits falling",
                    "Fed cutting rates"
                ]
            },
            EconomicCycle.TROUGH: {
                "description": "Economic bottom with stabilization",
                "characteristics": [
                    "GDP stabilizing after decline",
                    "Monetary/fiscal stimulus active",
                    "Sentiment extremely negative",
                    "Valuations compressed"
                ]
            }
        }
        
        return {
            "cycle_phase": cycle_phase,
            "description": cycle_info[cycle_phase]["description"],
            "characteristics": cycle_info[cycle_phase]["characteristics"],
            "favored_sectors": [
                {"sector": s[0], "multiplier": s[1]}
                for s in favored_sectors
            ],
            "avoid_sectors": [
                {"sector": s[0], "multiplier": s[1]}
                for s in avoid_sectors
            ],
            "supporting_indicators": {
                "gdp_growth": macro_snapshot.gdp_growth,
                "inflation_rate": macro_snapshot.inflation_rate,
                "unemployment": macro_snapshot.unemployment,
                "yield_curve_spread": macro_snapshot.yield_curve_spread,
                "vix": macro_snapshot.vix
            }
        }
        
    except Exception as e:
        logger.error(f"Error in cycle analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/geopolitical", response_model=List[GeopoliticalRisk])
async def get_geopolitical_risks():
    """
    Returns geopolitical risk assessments affecting markets.
    
    Analyzes risks by region:
    - Risk level (low/medium/high/critical)
    - Description of the risk
    - Sectors most affected
    - Investment implications
    
    Geopolitical factors are increasingly important in investment decisions,
    affecting supply chains, commodity prices, and sector performance.
    """
    try:
        risks = demo_data.get_demo_geopolitical_risks()
        
        # Sort by risk level (critical first)
        risk_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
        sorted_risks = sorted(
            risks,
            key=lambda x: risk_order.get(x.risk_level.value, 0),
            reverse=True
        )
        
        return sorted_risks
        
    except Exception as e:
        logger.error(f"Error fetching geopolitical risks: {e}")
        raise HTTPException(status_code=500, detail=str(e))
