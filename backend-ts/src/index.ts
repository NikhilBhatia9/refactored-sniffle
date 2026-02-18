// Alpha Oracle 2.0 - TypeScript Backend
// Main application entry point

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { logger } from './utils/logger';
import { testConnection } from './config/supabase';
import { DataIngestionService } from './services/dataIngestion';

// Routes
import healthRouter from './routes/health';
import recommendationsRouter from './routes/recommendations';
import sectorsRouter from './routes/sectors';
import economicRouter from './routes/economic';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/health', healthRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/sectors', sectorsRouter);
app.use('/api/economic', economicRouter);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Alpha Oracle 2.0 - TypeScript Backend',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      recommendations: '/api/recommendations',
      sectors: '/api/sectors',
      economic: '/api/economic'
    },
    documentation: 'See README.md for full API documentation'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Initialize data ingestion service
const ingestionService = new DataIngestionService();

// Initial data update on startup
async function runInitialUpdate() {
  if (!ingestionService.isLiveMode()) {
    logger.info('Running in demo mode - skipping initial data update');
    logger.info('Configure ALPHA_VANTAGE_API_KEY and FRED_API_KEY for live data');
    return;
  }

  try {
    logger.info('Running initial data update...');
    await ingestionService.runFullUpdate();
    logger.info('Initial data update completed ✓');
  } catch (error: any) {
    logger.error('Initial data update failed', error.message);
  }
}

// Schedule daily updates at 6 AM (if in live mode)
if (ingestionService.isLiveMode()) {
  cron.schedule('0 6 * * *', async () => {
    logger.info('Running scheduled data update...');
    try {
      await ingestionService.runFullUpdate();
      logger.info('Scheduled data update completed ✓');
    } catch (error: any) {
      logger.error('Scheduled data update failed', error.message);
    }
  });
  logger.info('✓ Daily updates scheduled for 6:00 AM');
} else {
  logger.info('Running in demo mode - scheduled updates disabled');
}

// Start server
async function startServer() {
  try {
    // Test database connection
    logger.info('Testing database connection...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      logger.warn('Database connection failed - server will start but may not function correctly');
    }

    // Start Express server
    app.listen(PORT, () => {
      logger.info('='.repeat(50));
      logger.info('🚀 Alpha Oracle 2.0 Backend Starting...');
      logger.info('='.repeat(50));
      logger.info(`✓ Server running on http://localhost:${PORT}`);
      logger.info(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`✓ Database: ${dbConnected ? 'Connected' : 'Disconnected'}`);
      logger.info(`✓ Data mode: ${ingestionService.isLiveMode() ? 'Live' : 'Demo'}`);
      logger.info('='.repeat(50));
    });

    // Run initial data update (only if in live mode)
    await runInitialUpdate();

  } catch (error: any) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the application
startServer();
