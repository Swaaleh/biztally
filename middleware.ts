// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );
  
const {
    data: { user },
  } = await supabase.auth.getUser();

  const loginUrl = new URL('/login', request.url);

  // If the user is not authenticated and is trying to access a protected route, redirect to login.
  if (!user && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to continue if authenticated
  return response;
}

export const config = {
  matcher: [
    '/dashboard',
    '/products',
    '/customers',
    '/sales'
  ],
};