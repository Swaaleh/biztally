// middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/app/_utils/supabase/middleware'
export async function middleware(request: NextRequest) {
  // update user's auth session
  return await updateSession(request)
}


export const config = {
  matcher: [
    '/dashboard',
    '/products',
    '/customers',
    '/sales'
  ],
};