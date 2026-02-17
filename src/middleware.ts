import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add request logging
  const start = Date.now();
  
  const response = NextResponse.next();
  
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
