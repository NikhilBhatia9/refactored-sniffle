// Data Ingestion Service - Fetch data from external APIs

import axios from 'axios';
import dotenv from 'dotenv';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { AlphaVantageQuote, FREDObservation } from '../types';

dotenv.config();

export class DataIngestionService {
  private alphaVantageKey: string;
  private fredKey: string;
  private alphaVantageBaseUrl = 'https://www.alphavantage.co/query';
  private fredBaseUrl = 'https://api.stlouisfed.org/fred';

  constructor() {
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || '';
    this.fredKey = process.env.FRED_API_KEY || '';

    if (!this.alphaVantageKey) {
      logger.warn('Alpha Vantage API key not configured - will run in demo mode');
    }
    if (!this.fredKey) {
      logger.warn('FRED API key not configured - will run in demo mode');
    }
  }

  /**
   * Check if API keys are configured
   */
  isLiveMode(): boolean {
    return !!(this.alphaVantageKey && this.fredKey);
  }

  /**
   * Fetch stock quote from Alpha Vantage
   */
  async fetchStockQuote(ticker: string): Promise<any> {
    if (!this.alphaVantageKey) {
      logger.warn('Alpha Vantage API key not configured - skipping fetch');
      return null;
    }

    try {
      const url = `${this.alphaVantageBaseUrl}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${this.alphaVantageKey}`;
      const response = await axios.get(url);
      
      const quote = response.data['Global Quote'] as AlphaVantageQuote;
      if (!quote || !quote['01. symbol']) {
        logger.error(`No quote data for ${ticker}`);
        return null;
      }

      return {
        ticker: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change_percent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        data_date: new Date().toISOString().split('T')[0]
      };
    } catch (error: any) {
      logger.error(`Error fetching quote for ${ticker}`, error.message);
      return null;
    }
  }

  /**
   * Fetch company overview from Alpha Vantage
   */
  async fetchCompanyOverview(ticker: string): Promise<any> {
    if (!this.alphaVantageKey) {
      return null;
    }

    try {
      const url = `${this.alphaVantageBaseUrl}?function=OVERVIEW&symbol=${ticker}&apikey=${this.alphaVantageKey}`;
      const response = await axios.get(url);
      
      const overview = response.data;
      if (!overview.Symbol) {
        logger.error(`No overview data for ${ticker}`);
        return null;
      }

      return {
        ticker: overview.Symbol,
        company_name: overview.Name,
        market_cap: parseInt(overview.MarketCapitalization || '0'),
        pe_ratio: parseFloat(overview.PERatio || '0'),
        sector: overview.Sector,
        industry: overview.Industry
      };
    } catch (error: any) {
      logger.error(`Error fetching overview for ${ticker}`, error.message);
      return null;
    }
  }

  /**
   * Update market data in Supabase
   */
  async updateMarketData(tickers: string[]): Promise<void> {
    logger.info(`Updating market data for ${tickers.length} tickers`);

    for (const ticker of tickers) {
      const quoteData = await this.fetchStockQuote(ticker);
      
      if (quoteData) {
        const { error } = await supabase
          .from('market_data')
          .upsert(quoteData, {
            onConflict: 'ticker,data_date'
          });

        if (error) {
          logger.error(`Error updating market data for ${ticker}`, error);
        } else {
          logger.info(`✓ Updated ${ticker}: $${quoteData.price}`);
        }
      }

      // Respect API rate limits - Alpha Vantage: 5 calls/minute on free tier
      await this.sleep(12000);
    }

    logger.info('Market data update complete');
  }

  /**
   * Fetch economic indicator from FRED
   */
  async fetchEconomicIndicator(seriesId: string, indicatorName: string): Promise<any> {
    if (!this.fredKey) {
      logger.warn('FRED API key not configured - skipping fetch');
      return null;
    }

    try {
      const url = `${this.fredBaseUrl}/series/observations?series_id=${seriesId}&api_key=${this.fredKey}&file_type=json&sort_order=desc&limit=1`;
      const response = await axios.get(url);
      
      const observations = response.data.observations as FREDObservation[];
      if (!observations || observations.length === 0) {
        logger.error(`No data for ${seriesId}`);
        return null;
      }

      const observation = observations[0];
      return {
        indicator_name: indicatorName,
        value: parseFloat(observation.value),
        data_date: observation.date,
        unit: this.getUnitForIndicator(seriesId),
        trend: 'stable', // Could enhance with historical comparison
        impact: 'Neutral'
      };
    } catch (error: any) {
      logger.error(`Error fetching ${seriesId}`, error.message);
      return null;
    }
  }

  /**
   * Update economic indicators in Supabase
   */
  async updateEconomicIndicators(): Promise<void> {
    logger.info('Updating economic indicators');

    const indicators = [
      { seriesId: 'GDP', name: 'GDP Growth Rate' },
      { seriesId: 'UNRATE', name: 'Unemployment Rate' },
      { seriesId: 'CPIAUCSL', name: 'CPI (Inflation)' },
      { seriesId: 'DFF', name: 'Federal Funds Rate' },
      { seriesId: 'DGS10', name: '10-Year Treasury Yield' }
    ];

    for (const { seriesId, name } of indicators) {
      const data = await this.fetchEconomicIndicator(seriesId, name);
      
      if (data) {
        const { error } = await supabase
          .from('economic_indicators')
          .insert(data);

        if (error) {
          logger.error(`Error updating ${name}`, error);
        } else {
          logger.info(`✓ Updated ${name}: ${data.value}`);
        }
      }

      // Be nice to FRED API
      await this.sleep(1000);
    }

    logger.info('Economic indicators update complete');
  }

  /**
   * Get unit for FRED indicator
   */
  private getUnitForIndicator(seriesId: string): string {
    const units: Record<string, string> = {
      'GDP': '%',
      'UNRATE': '%',
      'CPIAUCSL': 'Index',
      'DFF': '%',
      'DGS10': '%'
    };
    return units[seriesId] || '';
  }

  /**
   * Sleep helper for rate limiting
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Run full data update
   */
  async runFullUpdate(): Promise<void> {
    logger.info('Starting full data update');

    const topTickers = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'TSLA', 'UNH', 'JPM', 'XOM'];
    
    try {
      await this.updateMarketData(topTickers);
      await this.updateEconomicIndicators();
      logger.info('Full data update completed successfully');
    } catch (error: any) {
      logger.error('Error during full data update', error.message);
      throw error;
    }
  }
}
