// Recommendation Engine - Generate investment recommendations

import { supabase, getRecommendations, getSectors } from '../config/supabase';
import { logger } from '../utils/logger';
import { Recommendation, Sector, RecommendationFilters } from '../types';

export class RecommendationEngine {
  /**
   * Get top investment opportunities across all sectors
   */
  async getTopOpportunities(limit: number = 10): Promise<Recommendation[]> {
    try {
      const recommendations = await getRecommendations();
      
      // Sort by conviction score
      const sorted = recommendations.sort((a, b) => 
        b.conviction_score - a.conviction_score
      );

      return sorted.slice(0, limit);
    } catch (error: any) {
      logger.error('Error getting top opportunities', error.message);
      throw error;
    }
  }

  /**
   * Get best picks within a specific sector
   */
  async getSectorOpportunities(sectorName: string, limit: number = 5): Promise<Recommendation[]> {
    try {
      const recommendations = await getRecommendations({ sector: sectorName });
      
      // Sort by conviction score
      const sorted = recommendations.sort((a, b) => 
        b.conviction_score - a.conviction_score
      );

      return sorted.slice(0, limit);
    } catch (error: any) {
      logger.error(`Error getting sector opportunities for ${sectorName}`, error.message);
      throw error;
    }
  }

  /**
   * Get defensive/recession-resistant picks
   * 
   * Criteria:
   * - Defensive sectors (Healthcare, Consumer Staples, Utilities)
   * - Lower risk level
   * - Strong conviction scores
   * 
   * Philosophy: "Sleep well at night" - Peter Lynch
   */
  async getDefensivePicks(limit: number = 10): Promise<Recommendation[]> {
    try {
      const recommendations = await getRecommendations();
      
      const defensiveSectors = ['Healthcare', 'Consumer Staples', 'Utilities'];
      
      const defensiveRecs = recommendations.filter(rec => {
        const sectorName = rec.sectors?.name || '';
        return defensiveSectors.includes(sectorName) || rec.risk_level === 'low';
      });

      // Sort by conviction score
      const sorted = defensiveRecs.sort((a, b) => 
        b.conviction_score - a.conviction_score
      );

      return sorted.slice(0, limit);
    } catch (error: any) {
      logger.error('Error getting defensive picks', error.message);
      throw error;
    }
  }

  /**
   * Get high-growth momentum plays
   * 
   * Criteria:
   * - Growth sectors (Technology, Healthcare, Communication)
   * - Growth strategy
   * - Strong catalysts (3+)
   * 
   * Philosophy: "The best business to own is one that over time can employ 
   * large amounts of capital at very high rates of return" - Warren Buffett
   */
  async getGrowthPicks(limit: number = 10): Promise<Recommendation[]> {
    try {
      const recommendations = await getRecommendations({ strategy: 'growth' });
      
      const growthSectors = [
        'Technology', 
        'Communication Services', 
        'Healthcare',
        'Consumer Discretionary'
      ];

      const growthRecs = recommendations.filter(rec => {
        const sectorName = rec.sectors?.name || '';
        const hasCatalysts = rec.catalysts && rec.catalysts.length >= 3;
        return growthSectors.includes(sectorName) && hasCatalysts;
      });

      // Sort by conviction score
      const sorted = growthRecs.sort((a, b) => 
        b.conviction_score - a.conviction_score
      );

      return sorted.slice(0, limit);
    } catch (error: any) {
      logger.error('Error getting growth picks', error.message);
      throw error;
    }
  }

  /**
   * Get deep value/turnaround candidates
   * 
   * Criteria:
   * - Value strategy
   * - Significant upside to fair value (>10%)
   * - Out of favor but fundamentals improving
   * 
   * Philosophy: "Price is what you pay, value is what you get" - Warren Buffett
   */
  async getValuePicks(limit: number = 10): Promise<Recommendation[]> {
    try {
      const recommendations = await getRecommendations({ strategy: 'value' });
      
      const valueRecs = recommendations.filter(rec => {
        const pe = rec.valuation_metrics?.pe || 0;
        return pe < 20 && rec.upside_percent > 10;
      });

      // Sort by upside potential (margin of safety)
      const sorted = valueRecs.sort((a, b) => 
        b.upside_percent - a.upside_percent
      );

      return sorted.slice(0, limit);
    } catch (error: any) {
      logger.error('Error getting value picks', error.message);
      throw error;
    }
  }

  /**
   * Get contrarian/oversold opportunities with improving fundamentals
   * 
   * Criteria:
   * - Significant upside potential
   * - More catalysts than risks
   * - Contrarian strategy
   * 
   * Philosophy: "The time to buy is when there's blood in the streets" - Baron Rothschild
   */
  async getContrarianPicks(limit: number = 10): Promise<Recommendation[]> {
    try {
      const recommendations = await getRecommendations({ strategy: 'contrarian' });
      
      const contrarianRecs = recommendations.filter(rec => {
        const catalystCount = rec.catalysts?.length || 0;
        const riskCount = rec.risks?.length || 0;
        return rec.upside_percent > 15 && catalystCount > riskCount;
      });

      // Sort by upside potential
      const sorted = contrarianRecs.sort((a, b) => 
        b.upside_percent - a.upside_percent
      );

      return sorted.slice(0, limit);
    } catch (error: any) {
      logger.error('Error getting contrarian picks', error.message);
      throw error;
    }
  }

  /**
   * Filter recommendations based on multiple criteria
   */
  async filterRecommendations(
    filters: RecommendationFilters,
    limit: number = 20
  ): Promise<Recommendation[]> {
    try {
      // Get strategy-specific picks
      let recommendations: Recommendation[];

      if (filters.strategy === 'growth') {
        recommendations = await this.getGrowthPicks(limit * 2);
      } else if (filters.strategy === 'value') {
        recommendations = await this.getValuePicks(limit * 2);
      } else if (filters.strategy === 'defensive') {
        recommendations = await this.getDefensivePicks(limit * 2);
      } else if (filters.strategy === 'contrarian') {
        recommendations = await this.getContrarianPicks(limit * 2);
      } else {
        // All strategies
        recommendations = await getRecommendations(filters);
      }

      // Apply additional filters
      let filtered = recommendations;

      if (filters.minConviction) {
        filtered = filtered.filter(rec => rec.conviction_score >= filters.minConviction!);
      }

      if (filters.sector) {
        filtered = filtered.filter(rec => {
          const sectorName = rec.sectors?.name || '';
          return sectorName.toLowerCase() === filters.sector!.toLowerCase();
        });
      }

      if (filters.riskLevel) {
        filtered = filtered.filter(rec => rec.risk_level === filters.riskLevel);
      }

      return filtered.slice(0, limit);
    } catch (error: any) {
      logger.error('Error filtering recommendations', error.message);
      throw error;
    }
  }

  /**
   * Analyze sector performance and generate insights
   */
  async analyzeSector(sectorName: string): Promise<any> {
    try {
      const { data: sector, error: sectorError } = await supabase
        .from('sectors')
        .select('*')
        .eq('name', sectorName)
        .single();

      if (sectorError) throw sectorError;

      const recommendations = await this.getSectorOpportunities(sectorName, 10);

      // Calculate sector statistics
      const avgConviction = recommendations.length > 0
        ? recommendations.reduce((sum, rec) => sum + rec.conviction_score, 0) / recommendations.length
        : 0;

      const avgUpside = recommendations.length > 0
        ? recommendations.reduce((sum, rec) => sum + rec.upside_percent, 0) / recommendations.length
        : 0;

      return {
        sector,
        recommendations,
        statistics: {
          totalRecommendations: recommendations.length,
          averageConviction: avgConviction.toFixed(2),
          averageUpside: avgUpside.toFixed(2),
          highConvictionCount: recommendations.filter(r => r.conviction_score >= 8.0).length,
          lowRiskCount: recommendations.filter(r => r.risk_level === 'low').length
        }
      };
    } catch (error: any) {
      logger.error(`Error analyzing sector ${sectorName}`, error.message);
      throw error;
    }
  }
}
