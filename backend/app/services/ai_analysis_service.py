"""
AI Analysis Service - Uses OpenAI GPT-4o to evaluate stocks and generate
investment recommendations with rationale, tailwinds, headwinds, and conviction scores.
"""
import os
import json
import logging
from typing import Optional
from openai import OpenAI

logger = logging.getLogger(__name__)


def _get_client() -> Optional[OpenAI]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    return OpenAI(api_key=api_key)


def analyze_stock_with_ai(stock_data: dict) -> Optional[dict]:
    """
    Sends stock fundamentals to GPT-4o and gets back a structured
    investment recommendation.

    Returns dict with:
    - conviction_score (float 0-100)
    - recommendation (STRONG_BUY | BUY | HOLD | SELL | STRONG_SELL)
    - fair_value_estimate (float)
    - tailwinds (list of str)
    - headwinds (list of str)
    - rationale (str, 2-4 sentences)
    - is_screaming_buy (bool)
    - time_horizon (str)
    """
    client = _get_client()
    if not client:
        logger.warning("OPENAI_API_KEY not set; skipping AI analysis")
        return None

    ticker = stock_data.get("ticker", "UNKNOWN")

    prompt = f"""You are a senior equity analyst at a top hedge fund. Analyze this stock and provide a JSON investment recommendation.

Stock: {ticker} - {stock_data.get('company_name')}
Sector: {stock_data.get('sector')}
Current Price: ${stock_data.get('current_price')}
Analyst Mean Target: ${stock_data.get('target_mean_price')}
P/E (Trailing): {stock_data.get('pe_ratio')}
P/E (Forward): {stock_data.get('forward_pe')}
PEG Ratio: {stock_data.get('peg_ratio')}
Dividend Yield: {stock_data.get('dividend_yield')}%
Market Cap: ${stock_data.get('market_cap_billions'):.1f}B
52-Week Range: ${stock_data.get('52w_low')} - ${stock_data.get('52w_high')}
Revenue Growth: {stock_data.get('revenue_growth')}
Earnings Growth: {stock_data.get('earnings_growth')}
Profit Margin: {stock_data.get('profit_margins')}
Return on Equity: {stock_data.get('return_on_equity')}
Debt/Equity: {stock_data.get('debt_to_equity')}
Beta: {stock_data.get('beta')}
Analyst Consensus: {stock_data.get('analyst_recommendation')} ({stock_data.get('analyst_count')} analysts)
Short Ratio: {stock_data.get('short_ratio')}
Business: {stock_data.get('description')}

Respond ONLY with valid JSON in this exact format:
{{
  "conviction_score": <number 0-100>,
  "recommendation": "<STRONG_BUY|BUY|HOLD|SELL|STRONG_SELL>",
  "fair_value_estimate": <number>,
  "tailwinds": ["<tailwind 1>", "<tailwind 2>", "<tailwind 3>"],
  "headwinds": ["<headwind 1>", "<headwind 2>"],
  "rationale": "<2-4 sentence investment thesis>",
  "is_screaming_buy": <true|false>,
  "time_horizon": "<6-12 months|12-18 months|18-24 months|24+ months>"
}}

A "screaming buy" means conviction_score >= 80 AND recommendation is STRONG_BUY or BUY AND upside to fair value > 10%."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3,
        )
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        logger.error(f"OpenAI analysis failed for {ticker}: {e}")
        return None
