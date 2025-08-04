import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { version } from '@/package.json';
import os from 'os';

// Health check status types
type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

interface HealthCheck {
  status: HealthStatus;
  message: string;
  timestamp: string;
  checks: {
    database: {
      status: boolean;
      message: string;
      responseTime?: number;
    };
    system: {
      status: boolean;
      uptime: number;
      memory: {
        used: number;
        total: number;
        percentage: number;
      };
      platform: string;
      nodeVersion: string;
    };
    features: {
      characters: boolean;
      battles: boolean;
      users: boolean;
      admins: boolean;
    };
  };
  deployment: {
    version: string;
    environment: string;
    useSQLite: boolean;
    databasePath?: string;
  };
}

async function checkDatabase(): Promise<{ status: boolean; message: string; responseTime?: number }> {
  const startTime = Date.now();
  
  try {
    // Test basic database connectivity
    const result = db.prepare('SELECT 1 as test').get();
    
    if (!result || (result as any).test !== 1) {
      return {
        status: false,
        message: 'Database query returned unexpected result'
      };
    }
    
    // Check if critical tables exist
    const tables = ['users', 'characters', 'animals', 'battles', 'admin_users'];
    for (const table of tables) {
      const tableExists = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
      ).get(table);
      
      if (!tableExists) {
        return {
          status: false,
          message: `Critical table '${table}' is missing`
        };
      }
    }
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: true,
      message: 'Database is healthy',
      responseTime
    };
  } catch (error) {
    return {
      status: false,
      message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

async function checkFeatures(): Promise<{ characters: boolean; battles: boolean; users: boolean; admins: boolean }> {
  try {
    // Check if we can query each critical table
    const charactersCount = db.prepare('SELECT COUNT(*) as count FROM characters').get() as { count: number };
    const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    const battlesCount = db.prepare('SELECT COUNT(*) as count FROM battles').get() as { count: number };
    const adminsCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
    
    return {
      characters: charactersCount.count >= 0,
      battles: battlesCount.count >= 0,
      users: usersCount.count >= 0,
      admins: adminsCount.count > 0 // Should have at least one admin
    };
  } catch (error) {
    console.error('Feature check error:', error);
    return {
      characters: false,
      battles: false,
      users: false,
      admins: false
    };
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Perform health checks
    const databaseCheck = await checkDatabase();
    const features = await checkFeatures();
    
    // Get system information
    const systemInfo = {
      status: true,
      uptime: process.uptime(),
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
      },
      platform: os.platform(),
      nodeVersion: process.version
    };
    
    // Determine overall health status
    let overallStatus: HealthStatus = 'healthy';
    let statusMessage = 'All systems operational';
    
    if (!databaseCheck.status) {
      overallStatus = 'unhealthy';
      statusMessage = 'Database connectivity issues';
    } else if (!features.admins) {
      overallStatus = 'degraded';
      statusMessage = 'No admin users configured';
    } else if (systemInfo.memory.percentage > 90) {
      overallStatus = 'degraded';
      statusMessage = 'High memory usage detected';
    }
    
    const healthCheck: HealthCheck = {
      status: overallStatus,
      message: statusMessage,
      timestamp: new Date().toISOString(),
      checks: {
        database: databaseCheck,
        system: systemInfo,
        features
      },
      deployment: {
        version: version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        useSQLite: process.env.USE_SQLITE === 'true',
        databasePath: process.env.NODE_ENV === 'production' ? undefined : process.env.DATABASE_PATH
      }
    };
    
    // Set appropriate status code based on health
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;
    
    // Add response time
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      ...healthCheck,
      responseTime
    }, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${responseTime}ms`
      }
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

// Optional: Add HEAD method for simpler health checks
export async function HEAD(request: NextRequest) {
  try {
    // Quick database connectivity check
    db.prepare('SELECT 1').get();
    
    return new NextResponse(null, { 
      status: 200,
      headers: {
        'X-Health-Status': 'healthy'
      }
    });
  } catch (error) {
    return new NextResponse(null, { 
      status: 503,
      headers: {
        'X-Health-Status': 'unhealthy'
      }
    });
  }
}