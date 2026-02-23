"""
Live Recommendations Service - Orchestrates market data fetching and AI analysis
to produce real-time StockRecommendation objects.

Falls back to demo data if:
- OPENAI_API_KEY is not set
- yfinance data is unavailable
- USE_DEMO_DATA=true env var is set
"""
import os
import time
import logging
from typing import List
from app.models.schemas import StockRecommendation, Recommendation
from app.services.market_data_service import fetch_stock_data, WATCHLIST
from app.services.ai_analysis_service import analyze_stock_with_ai
from app.services import demo_data

logger = logging.getLogger(__name__)

_cached_recommendations: List[StockRecommendation] = []
_cache_timestamp: float = 0
CACHE_TTL_SECONDS = 3600  # 1 hour cache

RECOMMENDATION_MAP = {
    "STRONG_BUY": Recommendation.STRONG_BUY,
    "BUY": Recommendation.BUY,
    "HOLD": Recommendation.HOLD,
    "SELL": Recommendation.SELL,
    "STRONG_SELL": Recommendation.STRONG_SELL,
}


def _is_live_mode() -> bool:
    if os.getenv("USE_DEMO_DATA", "").lower() == "true":
        return False
    if not os.getenv("OPENAI_API_KEY"):
        return False
    return True


def _build_recommendation(stock_data: dict, ai_result: dict) -> StockRecommendation:
    current_price = stock_data["current_price"]
    ai_fair_value = ai_result.get("fair_value_estimate")
    fair_value = float(ai_fair_value) if ai_fair_value is not None else float(stock_data["target_mean_price"] or current_price)
    upside_pct = ((fair_value - current_price) / current_price) * 100

    rec_str = ai_result.get("recommendation", "HOLD").upper()
    recommendation = RECOMMENDATION_MAP.get(rec_str, Recommendation.HOLD)

    return StockRecommendation(
        ticker=stock_data["ticker"],
        company_name=stock_data["company_name"],
        sector=stock_data["sector"],
        recommendation=recommendation,
        conviction_score=float(ai_result.get("conviction_score", 50)),
        current_price=current_price,
        fair_value_estimate=round(fair_value, 2),
        upside_potential_pct=round(upside_pct, 1),
        pe_ratio=stock_data.get("pe_ratio"),
        peg_ratio=stock_data.get("peg_ratio"),
        dividend_yield=stock_data.get("dividend_yield"),
        market_cap=round(stock_data.get("market_cap_billions", 0), 1),
        headwinds=ai_result.get("headwinds", []),
        tailwinds=ai_result.get("tailwinds", []),
        rationale=ai_result.get("rationale", ""),
        time_horizon=ai_result.get("time_horizon", "12-18 months"),
    )


def get_live_recommendations(tickers: list = None) -> List[StockRecommendation]:
    """
    Fetches live market data and runs AI analysis for each ticker.
    Results are cached for CACHE_TTL_SECONDS.
    Falls back to demo data on any failure or if not in live mode.
    """
    global _cached_recommendations, _cache_timestamp

    if not _is_live_mode():
        logger.info("Using demo data (live mode disabled or OPENAI_API_KEY not set)")
        return demo_data.get_demo_stock_recommendations()

    # Return cached if fresh
    if _cached_recommendations and (time.time() - _cache_timestamp) < CACHE_TTL_SECONDS:
        logger.info(f"Returning {len(_cached_recommendations)} cached live recommendations")
        return _cached_recommendations

    ticker_list = tickers or WATCHLIST
    results: List[StockRecommendation] = []

    for ticker in ticker_list:
        try:
            stock_data = fetch_stock_data(ticker)
            if not stock_data:
                logger.warning(f"Skipping {ticker}: no market data")
                continue

            ai_result = analyze_stock_with_ai(stock_data)
            if not ai_result:
                logger.warning(f"Skipping {ticker}: AI analysis failed")
                continue

            rec = _build_recommendation(stock_data, ai_result)
            results.append(rec)
            logger.info(f"✓ {ticker}: {rec.recommendation} (conviction={rec.conviction_score})")
        except Exception as e:
            logger.error(f"Error processing {ticker}: {e}")
            continue

    if not results:
        logger.warning("No live recommendations generated; falling back to demo data")
        return demo_data.get_demo_stock_recommendations()

    _cached_recommendations = results
    _cache_timestamp = time.time()
    logger.info(f"Generated {len(results)} live recommendations")
    return results


def get_screaming_buys() -> List[StockRecommendation]:
    """
    Returns only the highest-conviction buy opportunities (conviction >= 80,
    recommendation is STRONG_BUY or BUY, upside > 10%).
    """
    all_recs = get_live_recommendations()
    screaming = [
        r for r in all_recs
        if r.conviction_score >= 80
        and r.recommendation in (Recommendation.STRONG_BUY, Recommendation.BUY)
        and r.upside_potential_pct > 10
    ]
    return sorted(screaming, key=lambda x: x.conviction_score, reverse=True)
