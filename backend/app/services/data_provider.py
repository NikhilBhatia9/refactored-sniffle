"""
Market data provider service for Alpha Oracle.
Fetches real-time market data from external APIs (Alpha Vantage, FRED).
Falls back to demo data if API keys are not configured.
"""
import httpx
from typing import Optional, Dict, Any
import logging
from app.config import settings
from app.services import demo_data

logger = logging.getLogger(__name__)


class MarketDataProvider:
    """
    Provides market data from external APIs with graceful fallback to demo data.
    Ensures the platform works out-of-the-box without API keys.
    """
    
    def __init__(self):
        self.alpha_vantage_key = settings.ALPHA_VANTAGE_API_KEY
        self.fred_key = settings.FRED_API_KEY
        self.use_demo_data = not (self.alpha_vantage_key and self.fred_key)
        
        if self.use_demo_data:
            logger.info("API keys not configured. Using demo data mode.")
        else:
            logger.info("API keys configured. Using live data mode.")
    
    async def get_sector_performance(self) -> Dict[str, Any]:
        """
        Fetches sector ETF performance data.
        Sectors: XLK (Tech), XLF (Financials), XLE (Energy), XLV (Healthcare),
                XLY (Discretionary), XLP (Staples), XLI (Industrials), XLB (Materials),
                XLRE (Real Estate), XLC (Communication), XLU (Utilities)
        """
        if self.use_demo_data:
            return self._get_demo_sector_performance()
        
        try:
            sector_etfs = ['XLK', 'XLF', 'XLE', 'XLV', 'XLY', 'XLP', 'XLI', 'XLB', 'XLRE', 'XLC', 'XLU']
            sector_data = {}
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                for etf in sector_etfs:
                    try:
                        url = f"https://www.alphavantage.co/query"
                        params = {
                            'function': 'GLOBAL_QUOTE',
                            'symbol': etf,
                            'apikey': self.alpha_vantage_key
                        }
                        response = await client.get(url, params=params)
                        data = response.json()
                        
                        if 'Global Quote' in data:
                            sector_data[etf] = data['Global Quote']
                    except Exception as e:
                        logger.warning(f"Error fetching {etf}: {e}")
            
            return sector_data if sector_data else self._get_demo_sector_performance()
            
        except Exception as e:
            logger.error(f"Error in get_sector_performance: {e}")
            return self._get_demo_sector_performance()
    
    def _get_demo_sector_performance(self) -> Dict[str, Any]:
        """Returns demo sector performance data"""
        return {
            'XLK': {'05. price': '195.50', '09. change': '1.25', '10. change percent': '0.64%'},
            'XLF': {'05. price': '38.75', '09. change': '0.15', '10. change percent': '0.39%'},
            'XLE': {'05. price': '88.20', '09. change': '1.80', '10. change percent': '2.08%'},
            'XLV': {'05. price': '142.30', '09. change': '0.85', '10. change percent': '0.60%'},
            'XLY': {'05. price': '168.40', '09. change': '-0.60', '10. change percent': '-0.36%'},
            'XLP': {'05. price': '76.50', '09. change': '0.45', '10. change percent': '0.59%'},
            'XLI': {'05. price': '112.80', '09. change': '-0.35', '10. change percent': '-0.31%'},
            'XLB': {'05. price': '82.90', '09. change': '-0.75', '10. change percent': '-0.90%'},
            'XLRE': {'05. price': '36.20', '09. change': '-0.55', '10. change percent': '-1.50%'},
            'XLC': {'05. price': '78.50', '09. change': '0.20', '10. change percent': '0.26%'},
            'XLU': {'05. price': '63.40', '09. change': '0.35', '10. change percent': '0.55%'}
        }
    
    async def get_stock_quote(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Fetches real-time stock quote for a given ticker.
        Returns price, change, volume, etc.
        """
        if self.use_demo_data:
            return self._get_demo_stock_quote(ticker)
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                url = f"https://www.alphavantage.co/query"
                params = {
                    'function': 'GLOBAL_QUOTE',
                    'symbol': ticker,
                    'apikey': self.alpha_vantage_key
                }
                response = await client.get(url, params=params)
                data = response.json()
                
                if 'Global Quote' in data:
                    return data['Global Quote']
                else:
                    return self._get_demo_stock_quote(ticker)
                    
        except Exception as e:
            logger.error(f"Error fetching quote for {ticker}: {e}")
            return self._get_demo_stock_quote(ticker)
    
    def _get_demo_stock_quote(self, ticker: str) -> Dict[str, Any]:
        """Returns demo stock quote"""
        demo_quotes = {
            'UNH': {'05. price': '528.40', '09. change': '5.20', '10. change percent': '0.99%'},
            'LLY': {'05. price': '568.25', '09. change': '8.50', '10. change percent': '1.52%'},
            'XOM': {'05. price': '102.35', '09. change': '1.85', '10. change percent': '1.84%'},
            'MSFT': {'05. price': '375.80', '09. change': '2.40', '10. change percent': '0.64%'},
            'NVDA': {'05. price': '735.50', '09. change': '12.30', '10. change percent': '1.70%'},
        }
        return demo_quotes.get(ticker, {'05. price': '100.00', '09. change': '0.00', '10. change percent': '0.00%'})
    
    async def get_company_overview(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Fetches company fundamentals: P/E, P/B, EPS, dividend yield, market cap, etc.
        """
        if self.use_demo_data:
            return self._get_demo_company_overview(ticker)
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                url = f"https://www.alphavantage.co/query"
                params = {
                    'function': 'OVERVIEW',
                    'symbol': ticker,
                    'apikey': self.alpha_vantage_key
                }
                response = await client.get(url, params=params)
                data = response.json()
                
                if data and 'Symbol' in data:
                    return data
                else:
                    return self._get_demo_company_overview(ticker)
                    
        except Exception as e:
            logger.error(f"Error fetching overview for {ticker}: {e}")
            return self._get_demo_company_overview(ticker)
    
    def _get_demo_company_overview(self, ticker: str) -> Dict[str, Any]:
        """Returns demo company overview"""
        demo_overviews = {
            'UNH': {
                'Symbol': 'UNH',
                'Name': 'UnitedHealth Group',
                'Sector': 'Healthcare',
                'MarketCapitalization': '485200000000',
                'PERatio': '24.5',
                'PEGRatio': '1.8',
                'DividendYield': '0.014',
                'EPS': '21.56'
            },
            'LLY': {
                'Symbol': 'LLY',
                'Name': 'Eli Lilly',
                'Sector': 'Healthcare',
                'MarketCapitalization': '540800000000',
                'PERatio': '88.4',
                'PEGRatio': '2.1',
                'DividendYield': '0.007',
                'EPS': '6.42'
            }
        }
        return demo_overviews.get(ticker, {
            'Symbol': ticker,
            'Name': ticker,
            'Sector': 'Unknown',
            'MarketCapitalization': '10000000000',
            'PERatio': '20.0',
            'PEGRatio': '1.5',
            'DividendYield': '0.02',
            'EPS': '5.00'
        })
    
    async def get_economic_indicators(self) -> Dict[str, Any]:
        """
        Fetches economic indicators from FRED API:
        - GDP growth
        - CPI (inflation)
        - Unemployment rate
        - Federal funds rate
        """
        if self.use_demo_data:
            return self._get_demo_economic_indicators()
        
        try:
            indicators = {}
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Fetch key indicators from FRED
                fred_series = {
                    'gdp': 'GDP',
                    'cpi': 'CPIAUCSL',
                    'unemployment': 'UNRATE',
                    'fed_funds': 'FEDFUNDS'
                }
                
                for key, series_id in fred_series.items():
                    try:
                        url = f"https://api.stlouisfed.org/fred/series/observations"
                        params = {
                            'series_id': series_id,
                            'api_key': self.fred_key,
                            'file_type': 'json',
                            'limit': 1,
                            'sort_order': 'desc'
                        }
                        response = await client.get(url, params=params)
                        data = response.json()
                        
                        if 'observations' in data and data['observations']:
                            indicators[key] = data['observations'][0]['value']
                    except Exception as e:
                        logger.warning(f"Error fetching {series_id}: {e}")
            
            return indicators if indicators else self._get_demo_economic_indicators()
            
        except Exception as e:
            logger.error(f"Error in get_economic_indicators: {e}")
            return self._get_demo_economic_indicators()
    
    def _get_demo_economic_indicators(self) -> Dict[str, Any]:
        """Returns demo economic indicators"""
        return {
            'gdp': '2.1',
            'cpi': '3.7',
            'unemployment': '3.8',
            'fed_funds': '5.25'
        }
