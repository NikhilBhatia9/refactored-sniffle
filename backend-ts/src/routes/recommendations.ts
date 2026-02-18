// Recommendations API routes

import express, { Request, Response } from 'express';
import { getRecommendations } from '../config/supabase';
import { RecommendationEngine } from '../services/recommendationEngine';
import { logger } from '../utils/logger';
import { RecommendationFilters } from '../types';

const router = express.Router();
const engine = new RecommendationEngine();

/**
 * GET /api/recommendations
 * Get stock recommendations with optional filters
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      strategy,
      sector,
      min_conviction,
      risk_level,
      limit = '20'
    } = req.query;

    const filters: RecommendationFilters = {};
    
    if (strategy && typeof strategy === 'string') {
      filters.strategy = strategy as any;
    }
    
    if (sector && typeof sector === 'string') {
      filters.sector = sector;
    }
    
    if (min_conviction && typeof min_conviction === 'string') {
      filters.minConviction = parseFloat(min_conviction);
    }
    
    if (risk_level && typeof risk_level === 'string') {
      filters.riskLevel = risk_level as any;
    }

    const limitNum = parseInt(limit as string) || 20;

    const recommendations = await engine.filterRecommendations(filters, limitNum);

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
      filters
    });
  } catch (error: any) {
    logger.error('Error fetching recommendations', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations',
      message: error.message
    });
  }
});

/**
 * GET /api/recommendations/top
 * Get top investment opportunities
 */
router.get('/top', async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;
    const limitNum = parseInt(limit as string) || 10;

    const recommendations = await engine.getTopOpportunities(limitNum);

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length
    });
  } catch (error: any) {
    logger.error('Error fetching top opportunities', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top opportunities',
      message: error.message
    });
  }
});

/**
 * GET /api/recommendations/growth
 * Get growth picks
 */
router.get('/growth', async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;
    const limitNum = parseInt(limit as string) || 10;

    const recommendations = await engine.getGrowthPicks(limitNum);

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
      strategy: 'growth'
    });
  } catch (error: any) {
    logger.error('Error fetching growth picks', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch growth picks',
      message: error.message
    });
  }
});

/**
 * GET /api/recommendations/value
 * Get value picks
 */
router.get('/value', async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;
    const limitNum = parseInt(limit as string) || 10;

    const recommendations = await engine.getValuePicks(limitNum);

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
      strategy: 'value'
    });
  } catch (error: any) {
    logger.error('Error fetching value picks', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch value picks',
      message: error.message
    });
  }
});

/**
 * GET /api/recommendations/defensive
 * Get defensive picks
 */
router.get('/defensive', async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;
    const limitNum = parseInt(limit as string) || 10;

    const recommendations = await engine.getDefensivePicks(limitNum);

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
      strategy: 'defensive'
    });
  } catch (error: any) {
    logger.error('Error fetching defensive picks', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch defensive picks',
      message: error.message
    });
  }
});

/**
 * GET /api/recommendations/contrarian
 * Get contrarian picks
 */
router.get('/contrarian', async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;
    const limitNum = parseInt(limit as string) || 10;

    const recommendations = await engine.getContrarianPicks(limitNum);

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
      strategy: 'contrarian'
    });
  } catch (error: any) {
    logger.error('Error fetching contrarian picks', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contrarian picks',
      message: error.message
    });
  }
});

export default router;
