import { Router, Request, Response } from 'express';
import { ApiSuccessResponse, HealthCheckData } from '../types/api.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const healthData: HealthCheckData = {
    status: 'ok',
    service: 'flowmetrics-api',
    version: '0.1.0',
    environment: env.NODE_ENV,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };

  const response: ApiSuccessResponse<HealthCheckData> = {
    success: true,
    data: healthData,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  res.status(200).json(response);
});

export default router;
