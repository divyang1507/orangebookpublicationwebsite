import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // ✅ Protect only specific routes, not all pages
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/user/:path*',
  ],
}
