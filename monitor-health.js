#!/usr/bin/env node

/**
 * Health monitoring script for Kid Text Battle
 * Can be used with uptime monitoring services or cron jobs
 * 
 * Usage: node monitor-health.js [--interval <seconds>] [--url <health-url>]
 * Example: node monitor-health.js --interval 60 --url https://your-app.onrender.com/api/health
 */

const http = require('http');
const https = require('https');

// Parse command line arguments
const args = process.argv.slice(2);
const argMap = {};
for (let i = 0; i < args.length; i += 2) {
  if (args[i].startsWith('--')) {
    argMap[args[i].substring(2)] = args[i + 1];
  }
}

const INTERVAL = parseInt(argMap.interval) || 30; // Default: 30 seconds
const HEALTH_URL = argMap.url || `http://localhost:${process.env.PORT || 3008}/api/health`;

// Parse URL
const url = new URL(HEALTH_URL);
const isHttps = url.protocol === 'https:';
const httpModule = isHttps ? https : http;

// Alert thresholds
const THRESHOLDS = {
  responseTime: 5000, // 5 seconds
  memoryPercentage: 85, // 85%
  databaseResponseTime: 1000 // 1 second
};

// State tracking
let consecutiveFailures = 0;
const MAX_CONSECUTIVE_FAILURES = 3;

function checkHealth() {
  const startTime = Date.now();
  
  const options = {
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: url.pathname,
    method: 'GET',
    timeout: 10000, // 10 second timeout
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'KidTextBattle-HealthMonitor/1.0'
    }
  };

  const req = httpModule.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const responseTime = Date.now() - startTime;
      
      try {
        if (res.statusCode === 200 || res.statusCode === 503) {
          const healthData = JSON.parse(data);
          processHealthData(healthData, responseTime, res.statusCode);
          consecutiveFailures = 0;
        } else {
          handleError(`Unexpected status code: ${res.statusCode}`, responseTime);
        }
      } catch (error) {
        handleError(`Failed to parse response: ${error.message}`, responseTime);
      }
    });
  });

  req.on('error', (error) => {
    const responseTime = Date.now() - startTime;
    handleError(`Request failed: ${error.message}`, responseTime);
  });

  req.on('timeout', () => {
    req.destroy();
    const responseTime = Date.now() - startTime;
    handleError('Request timeout', responseTime);
  });

  req.end();
}

function processHealthData(healthData, responseTime, statusCode) {
  const timestamp = new Date().toISOString();
  const alerts = [];
  
  // Check overall health status
  if (healthData.status !== 'healthy') {
    alerts.push(`Health status is ${healthData.status}: ${healthData.message}`);
  }
  
  // Check response time
  if (responseTime > THRESHOLDS.responseTime) {
    alerts.push(`High response time: ${responseTime}ms (threshold: ${THRESHOLDS.responseTime}ms)`);
  }
  
  // Check database
  if (!healthData.checks?.database?.status) {
    alerts.push(`Database unhealthy: ${healthData.checks?.database?.message || 'Unknown error'}`);
  } else if (healthData.checks?.database?.responseTime > THRESHOLDS.databaseResponseTime) {
    alerts.push(`High database response time: ${healthData.checks.database.responseTime}ms`);
  }
  
  // Check memory usage
  if (healthData.checks?.system?.memory?.percentage > THRESHOLDS.memoryPercentage) {
    alerts.push(`High memory usage: ${healthData.checks.system.memory.percentage}%`);
  }
  
  // Check critical features
  const features = healthData.checks?.features || {};
  if (!features.admins) {
    alerts.push('No admin users configured');
  }
  
  // Log results
  if (alerts.length > 0) {
    console.log(`[${timestamp}] ⚠️  ALERTS:`);
    alerts.forEach(alert => console.log(`  - ${alert}`));
  } else {
    console.log(`[${timestamp}] ✅ All systems healthy (${responseTime}ms)`);
  }
  
  // Log detailed metrics in verbose mode
  if (process.env.VERBOSE === 'true') {
    console.log(`  Status: ${healthData.status}`);
    console.log(`  Response Time: ${responseTime}ms`);
    console.log(`  Database: ${healthData.checks?.database?.status ? 'OK' : 'FAIL'} (${healthData.checks?.database?.responseTime}ms)`);
    console.log(`  Memory: ${healthData.checks?.system?.memory?.percentage}%`);
    console.log(`  Uptime: ${Math.floor((healthData.checks?.system?.uptime || 0) / 60)} minutes`);
  }
}

function handleError(errorMessage, responseTime) {
  consecutiveFailures++;
  const timestamp = new Date().toISOString();
  
  console.error(`[${timestamp}] ❌ HEALTH CHECK FAILED: ${errorMessage} (${responseTime}ms)`);
  
  if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
    console.error(`[${timestamp}] 🚨 CRITICAL: ${consecutiveFailures} consecutive failures!`);
    
    // Here you could trigger additional alerts (email, webhook, etc.)
    if (process.env.ALERT_WEBHOOK) {
      // Send webhook alert
      sendWebhookAlert({
        status: 'critical',
        message: `Health check has failed ${consecutiveFailures} times consecutively`,
        url: HEALTH_URL,
        timestamp
      });
    }
  }
}

function sendWebhookAlert(alertData) {
  // Implementation for sending webhook alerts
  // This is a placeholder - implement based on your alerting service
  console.log('Webhook alert would be sent:', alertData);
}

// Start monitoring
console.log(`🏥 Kid Text Battle Health Monitor`);
console.log(`📍 Monitoring: ${HEALTH_URL}`);
console.log(`⏱️  Check interval: ${INTERVAL} seconds`);
console.log(`🚨 Alert after ${MAX_CONSECUTIVE_FAILURES} consecutive failures`);
console.log('');

// Initial check
checkHealth();

// Schedule periodic checks
setInterval(checkHealth, INTERVAL * 1000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping health monitor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Stopping health monitor...');
  process.exit(0);
});