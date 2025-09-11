import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
      },
    }
  );

//--------------------------------------------------
const {
    data: { user },
  } = await supabase.auth.getUser();

  const loginUrl = new URL('/login', request.url);

  // If the user is not authenticated and is trying to access a protected route, redirect to login.
  if (!user && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(loginUrl);
  }
//--------------------------------------------------
  // If the user is authenticated and is trying to access the login page, redirect to dashboard.
  if (user && request.nextUrl.pathname === '/login') {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
//--------------------------------------------------
  // If there is a user, call getUser to ensure the session is valid and

  // refreshing the auth token
await supabase.auth.getUser()
  // Allow the request to continue if authenticated
  return supabaseResponse;
}