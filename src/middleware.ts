import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RequestLog {
  timestamp: string;
  method: string;
  url: string;
  userAgent?: string;
  ip?: string;
  responseTime?: number;
  statusCode?: number;
}

export function middleware(request: NextRequest) {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Extract request information
  const requestLog: RequestLog = {
    timestamp,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent') || undefined,
    ip: request.headers.get('x-forwarded-for') || 
       request.headers.get('x-real-ip') || 
       'unknown'
  };

  // Log request start
  console.log(`[REQUEST] ${timestamp} ${request.method} ${request.url}`, {
    userAgent: requestLog.userAgent,
    ip: requestLog.ip
  });

  const response = NextResponse.next();
  
  // Add response time header
  const responseTime = Date.now() - start;
  response.headers.set('X-Response-Time', `${responseTime}ms`);
  
  // Add request tracking headers
  response.headers.set('X-Request-ID', generateRequestId());
  response.headers.set('X-Request-Start', timestamp);
  
  // Log completion
  console.log(`[RESPONSE] ${timestamp} ${request.method} ${request.url} - ${responseTime}ms`);
  
  return response;
}

function generateRequestId(): string {
  return Math.random().toString(36).substr(2, 9) + 
         Date.now().toString(36);
}

export const config = {
  matcher: '/api/:path*',
};
