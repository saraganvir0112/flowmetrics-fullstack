import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  public code?: string;
  public details?: unknown;
  public statusCode?: number;

  constructor(message: string, statusCode?: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  const json: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    error: {
      message: 'Invalid JSON response from server',
      code: 'PARSE_ERROR',
    },
  }));

  if (!response.ok || !json.success) {
    const errorMsg = (!json.success && json.error?.message) || `Request failed with status ${response.status}`;
    const errorCode = (!json.success && json.error?.code) || 'API_ERROR';
    const errorDetails = !json.success ? json.error?.details : undefined;
    throw new ApiError(errorMsg, response.status, errorCode, errorDetails);
  }

  return json.data;
}
