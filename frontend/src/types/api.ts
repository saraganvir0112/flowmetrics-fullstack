export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    [key: string]: unknown;
  };
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: ApiErrorDetail[] | unknown;
  };
  meta?: {
    timestamp: string;
    [key: string]: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export type DatabaseConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'disconnecting';

export interface HealthCheckData {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  version: string;
  environment: string;
  uptime: number;
  database: DatabaseConnectionStatus;
  timestamp: string;
}
