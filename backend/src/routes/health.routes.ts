import { Router, Request, Response } from 'express';
import { ApiSuccessResponse, HealthCheckData } from '../types/api.js';
import { env } from '../config/env.js';
import { getDatabaseStatus } from '../config/database.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const dbStatus = getDatabaseStatus();
  const isHealthy = dbStatus === 'connected';

  const healthData: HealthCheckData = {
    status: isHealthy ? 'ok' : 'degraded',
    service: 'flowmetrics-api',
    version: '0.1.0',
    environment: env.NODE_ENV,
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    timestamp: new Date().toISOString(),
  };

  const response: ApiSuccessResponse<HealthCheckData> = {
    success: true,
    data: healthData,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  res.status(isHealthy ? 200 : 503).json(response);
});

export default router;
