// Health check utilities for production monitoring

import { db } from '~/db';
import { sql } from 'drizzle-orm';
import { createClient } from './supabase-server';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  checks: {
    database: HealthStatus;
    supabase: HealthStatus;
    memory: HealthStatus;
    uptime: HealthStatus;
  };
  environment: string;
  version: string;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message: string;
  responseTime?: number;
  details?: Record<string, any>;
}

// Database health check
export async function checkDatabaseHealth(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  try {
    await db.execute(sql`SELECT 1`);
    const responseTime = Date.now() - startTime;
    
    return {
      status: responseTime < 1000 ? 'healthy' : 'degraded',
      message: 'Database connection successful',
      responseTime,
      details: {
        responseTimeMs: responseTime,
        threshold: 1000,
      },
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

// Supabase health check
export async function checkSupabaseHealth(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      return {
        status: 'unhealthy',
        message: `Supabase auth service error: ${error.message}`,
        responseTime,
        details: {
          error: error.message,
          responseTimeMs: responseTime,
        },
      };
    }
    
    return {
      status: responseTime < 2000 ? 'healthy' : 'degraded',
      message: 'Supabase auth service accessible',
      responseTime,
      details: {
        responseTimeMs: responseTime,
        threshold: 2000,
      },
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Supabase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

// Memory health check
export function checkMemoryHealth(): HealthStatus {
  const memUsage = process.memoryUsage();
  const usedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const totalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const usagePercent = (usedMB / totalMB) * 100;
  
  let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
  let message = 'Memory usage normal';
  
  if (usagePercent > 90) {
    status = 'unhealthy';
    message = 'Memory usage critically high';
  } else if (usagePercent > 75) {
    status = 'degraded';
    message = 'Memory usage high';
  }
  
  return {
    status,
    message,
    details: {
      usedMB,
      totalMB,
      usagePercent: Math.round(usagePercent * 100) / 100,
      threshold: 75,
      criticalThreshold: 90,
    },
  };
}

// Uptime health check
export function checkUptimeHealth(): HealthStatus {
  const uptime = process.uptime();
  const uptimeHours = uptime / 3600;
  
  return {
    status: 'healthy',
    message: `Application uptime: ${Math.round(uptimeHours * 100) / 100} hours`,
    details: {
      uptimeSeconds: uptime,
      uptimeHours: Math.round(uptimeHours * 100) / 100,
    },
  };
}

// Comprehensive health check
export async function performHealthCheck(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  // Run all health checks in parallel
  const [database, supabase, memory, uptime] = await Promise.all([
    checkDatabaseHealth(),
    checkSupabaseHealth(),
    Promise.resolve(checkMemoryHealth()),
    Promise.resolve(checkUptimeHealth()),
  ]);
  
  // Determine overall status
  const checks = { database, supabase, memory, uptime };
  const unhealthyCount = Object.values(checks).filter(check => check.status === 'unhealthy').length;
  const degradedCount = Object.values(checks).filter(check => check.status === 'degraded').length;
  
  let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
  if (unhealthyCount > 0) {
    overallStatus = 'unhealthy';
  } else if (degradedCount > 0) {
    overallStatus = 'degraded';
  }
  
  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks,
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  };
}

// Simple health check for basic monitoring
export async function simpleHealthCheck(): Promise<{ status: string; timestamp: string }> {
  try {
    // Quick database check
    await db.execute(sql`SELECT 1`);
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
    };
  }
}
