import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run on both edge and nodejs runtimes
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // If accessing the root path directly
  if (url.pathname === '/' || url.pathname === '/vignan' || url.pathname === '/vignan/') {
    url.pathname = '/vignan/StudentLoginPage';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure paths that this middleware will run for
export const config = {
  matcher: [
    // Match all paths except static files, api routes, etc.
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}; 