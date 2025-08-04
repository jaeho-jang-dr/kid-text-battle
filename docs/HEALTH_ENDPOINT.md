# Health Check Endpoint Documentation

## Overview

The health check endpoint provides comprehensive system monitoring for the Kid Text Battle application, designed specifically for production deployment monitoring (e.g., Render, Railway, etc.).

## Endpoint Details

- **URL**: `/api/health`
- **Methods**: `GET`, `HEAD`
- **Authentication**: None required (public endpoint)
- **Cache**: Disabled (`no-cache, no-store, must-revalidate`)

## Response Format

### GET /api/health

Returns detailed health information in JSON format:

```json
{
  "status": "healthy",  // "healthy" | "degraded" | "unhealthy"
  "message": "All systems operational",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "checks": {
    "database": {
      "status": true,
      "message": "Database is healthy",
      "responseTime": 5
    },
    "system": {
      "status": true,
      "uptime": 3600,
      "memory": {
        "used": 104857600,
        "total": 134217728,
        "percentage": 78
      },
      "platform": "linux",
      "nodeVersion": "v18.17.0"
    },
    "features": {
      "characters": true,
      "battles": true,
      "users": true,
      "admins": true
    }
  },
  "deployment": {
    "version": "0.0.9",
    "environment": "production",
    "useSQLite": true,
    "databasePath": "/var/data/kid-text-battle.db"
  },
  "responseTime": 23
}
```

### HEAD /api/health

Returns minimal health status via headers:

- **Status Code**: 200 (healthy) or 503 (unhealthy)
- **Headers**: 
  - `X-Health-Status`: "healthy" or "unhealthy"

## Health Status Definitions

### Healthy (200)
- Database connectivity is working
- All critical tables exist
- Admin users are configured
- Memory usage is below 90%

### Degraded (200)
- System is operational but with warnings
- No admin users configured
- High memory usage (>90%)

### Unhealthy (503)
- Database connectivity failed
- Critical errors during health check
- System is not operational

## Monitoring Integration

### Render Health Checks

Configure in `render.yaml`:

```yaml
services:
  - type: web
    name: kid-text-battle
    env: node
    healthCheckPath: /api/health
    buildCommand: npm run build
    startCommand: npm run start
```

### Uptime Monitoring

Use the provided monitoring script:

```bash
# Basic monitoring
node monitor-health.js

# Custom interval (60 seconds)
node monitor-health.js --interval 60

# Monitor production URL
node monitor-health.js --url https://your-app.onrender.com/api/health

# Verbose output
VERBOSE=true node monitor-health.js
```

### Docker Health Check

Add to `Dockerfile`:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

## Testing

Test the endpoint locally:

```bash
# Run the test script
node test-health-endpoint.js

# Manual curl test
curl -i http://localhost:3008/api/health

# HEAD request test
curl -I http://localhost:3008/api/health
```

## Alerting Thresholds

The monitoring script uses these default thresholds:

- **Response Time**: 5000ms (5 seconds)
- **Memory Usage**: 85%
- **Database Response Time**: 1000ms (1 second)
- **Consecutive Failures**: 3 before critical alert

## Security Considerations

- The endpoint is public by design for monitoring services
- Database path is hidden in production environments
- No sensitive information is exposed
- Rate limiting should be applied at the infrastructure level

## Troubleshooting

### Common Issues

1. **503 Service Unavailable**
   - Check database connectivity
   - Verify database file exists and has correct permissions
   - Check if all required tables are created

2. **High Response Times**
   - Check database performance
   - Monitor server resources
   - Review application logs

3. **Memory Warnings**
   - Check for memory leaks
   - Review Node.js heap size configuration
   - Consider scaling resources

### Debug Commands

```bash
# Check if database exists
ls -la /var/data/kid-text-battle.db

# Test database connectivity
node -e "require('./lib/db').prepare('SELECT 1').get()"

# Check process memory
node -e "console.log(process.memoryUsage())"
```