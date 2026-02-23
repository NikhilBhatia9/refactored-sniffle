"""
Market Data Service - Fetches live stock data from Yahoo Finance (yfinance).
No API key required. Falls back gracefully if data is unavailable.
"""
import yfinance as yf
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Curated watchlist of stocks to analyze — covers all 11 GICS sectors
WATCHLIST = [
    # Technology
    "MSFT", "AAPL", "NVDA", "GOOGL", "META",
    # Healthcare
    "UNH", "LLY", "JNJ", "ABBV", "TMO",
    # Financials
    "JPM", "BAC", "V", "MA", "BRK-B",
    # Consumer Staples
    "PG", "KO", "WMT", "COST", "PEP",
    # Energy
    "XOM", "CVX", "COP", "SLB", "EOG",
    # Industrials
    "CAT", "HON", "UNP", "DE", "GE",
    # Consumer Discretionary
    "AMZN", "TSLA", "HD", "NKE", "MCD",
    # Communication Services
    "NFLX", "DIS", "T", "VZ", "CMCSA",
    # Materials
    "LIN", "APD", "NEM", "FCX", "NUE",
    # Utilities
    "NEE", "DUK", "SO", "AEP", "EXC",
    # Real Estate
    "PLD", "AMT", "EQIX", "CCI", "PSA",
]


MAX_DESCRIPTION_LENGTH = 500


def fetch_stock_data(ticker: str) -> Optional[dict]:
    """
    Fetches fundamental and price data for a ticker via yfinance.
    Returns a dict with all fields needed to generate a recommendation,
    or None if the fetch fails.
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info

        # Guard: skip if no price data
        current_price = info.get("currentPrice") or info.get("regularMarketPrice")
        if not current_price:
            return None

        return {
            "ticker": ticker,
            "company_name": info.get("longName", ticker),
            "sector": info.get("sector", "Unknown"),
            "current_price": float(current_price),
            "target_mean_price": float(info.get("targetMeanPrice") or current_price),
            "pe_ratio": info.get("trailingPE"),
            "forward_pe": info.get("forwardPE"),
            "peg_ratio": info.get("pegRatio"),
            "dividend_yield": (info.get("dividendYield") or 0) * 100,  # convert to %
            "market_cap_billions": (info.get("marketCap") or 0) / 1e9,
            "52w_high": info.get("fiftyTwoWeekHigh"),
            "52w_low": info.get("fiftyTwoWeekLow"),
            "revenue_growth": info.get("revenueGrowth"),
            "earnings_growth": info.get("earningsGrowth"),
            "profit_margins": info.get("profitMargins"),
            "debt_to_equity": info.get("debtToEquity"),
            "return_on_equity": info.get("returnOnEquity"),
            "beta": info.get("beta"),
            "analyst_recommendation": info.get("recommendationKey", "hold"),
            "analyst_count": info.get("numberOfAnalystOpinions", 0),
            "short_ratio": info.get("shortRatio"),
            "description": (info.get("longBusinessSummary") or "")[:MAX_DESCRIPTION_LENGTH],
        }
    except Exception as e:
        logger.warning(f"Failed to fetch data for {ticker}: {e}")
        return None
