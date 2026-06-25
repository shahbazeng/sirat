import { NextResponse   } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Sirf page requests ko track karein (Static assets aur API ko skip karein)
  const path = request.nextUrl.pathname;
  if (
    path.startsWith('/_next') || 
    path.startsWith('/api') || 
    path.includes('.') || 
    path === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Non-blocking tracking request
  // Hum origin ko dynamic rakhte hain taake local/prod dono par chale
  const baseUrl = request.nextUrl.origin;
  
  fetch(`${baseUrl}/api/track-traffic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: path }),
  }).catch((err) => console.error("Tracking Error:", err)); 

  return NextResponse.next();
}