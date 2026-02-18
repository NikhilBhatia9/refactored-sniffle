// Sectors API routes

import express, { Request, Response } from 'express';
import { getSectors, getSectorByName } from '../config/supabase';
import { RecommendationEngine } from '../services/recommendationEngine';
import { logger } from '../utils/logger';

const router = express.Router();
const engine = new RecommendationEngine();

/**
 * GET /api/sectors
 * Get all sectors
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const sectors = await getSectors();

    res.json({
      success: true,
      data: sectors,
      count: sectors.length
    });
  } catch (error: any) {
    logger.error('Error fetching sectors', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sectors',
      message: error.message
    });
  }
});

/**
 * GET /api/sectors/:name
 * Get sector by name with analysis
 */
router.get('/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const analysis = await engine.analyzeSector(name);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    logger.error(`Error fetching sector ${req.params.name}`, error.message);
    res.status(404).json({
      success: false,
      error: 'Sector not found',
      message: error.message
    });
  }
});

export default router;
