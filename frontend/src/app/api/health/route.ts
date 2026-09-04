import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'flowmetrics-frontend',
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString(),
      backendApi: process.env.NEXT_PUBLIC_API_URL || 'https://flowmetrics-fullstack.onrender.com/api',
    },
    { status: 200 }
  );
}
