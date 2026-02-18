// Economic indicators API routes

import express, { Request, Response } from 'express';
import { getEconomicIndicators, getMarketData, getGeopoliticalRisks } from '../config/supabase';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * GET /api/economic/indicators
 * Get economic indicators
 */
router.get('/indicators', async (req: Request, res: Response) => {
  try {
    const indicators = await getEconomicIndicators();

    res.json({
      success: true,
      data: indicators,
      count: indicators.length
    });
  } catch (error: any) {
    logger.error('Error fetching economic indicators', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch economic indicators',
      message: error.message
    });
  }
});

/**
 * GET /api/economic/market-data
 * Get market data
 */
router.get('/market-data', async (req: Request, res: Response) => {
  try {
    const { ticker } = req.query;
    const marketData = await getMarketData(ticker as string | undefined);

    res.json({
      success: true,
      data: marketData,
      count: marketData.length
    });
  } catch (error: any) {
    logger.error('Error fetching market data', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market data',
      message: error.message
    });
  }
});

/**
 * GET /api/economic/risks
 * Get geopolitical risks
 */
router.get('/risks', async (req: Request, res: Response) => {
  try {
    const risks = await getGeopoliticalRisks();

    res.json({
      success: true,
      data: risks,
      count: risks.length
    });
  } catch (error: any) {
    logger.error('Error fetching geopolitical risks', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch geopolitical risks',
      message: error.message
    });
  }
});

export default router;
