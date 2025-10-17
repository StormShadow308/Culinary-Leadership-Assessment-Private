import { NextResponse } from 'next/server';
import { performHealthCheck, simpleHealthCheck } from '~/lib/health-check';
import { logError } from '~/lib/error-handler';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const detailed = url.searchParams.get('detailed') === 'true';
    
    if (detailed) {
      // Comprehensive health check
      const healthData = await performHealthCheck();
      
      return NextResponse.json(healthData, {
        status: healthData.status === 'healthy' ? 200 : 503,
      });
    } else {
      // Simple health check
      const healthData = await simpleHealthCheck();
      
      return NextResponse.json(healthData, {
        status: healthData.status === 'healthy' ? 200 : 503,
      });
    }
  } catch (error) {
    logError(error as Error, { endpoint: '/api/health' });
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 503 }
    );
  }
}
