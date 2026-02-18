// Health check route

import express, { Request, Response } from 'express';
import { testConnection } from '../config/supabase';
import { logger } from '../utils/logger';

const router = express.Router();

router.get('/health', async (req: Request, res: Response) => {
  try {
    const dbConnected = await testConnection();
    
    const health = {
      status: dbConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'alpha-oracle-backend-ts',
      version: '2.0.0',
      database: dbConnected ? 'connected' : 'disconnected'
    };

    const statusCode = dbConnected ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error: any) {
    logger.error('Health check failed', error.message);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

export default router;
