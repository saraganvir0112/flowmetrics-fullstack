import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';

export const createApp = (): Express => {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:3000'],
      credentials: true,
    })
  );

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root endpoint info
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'Flowmetrics API',
      status: 'active',
      health: '/api/health',
    });
  });

  // API router
  app.use('/api', routes);

  // 404 handler
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};
