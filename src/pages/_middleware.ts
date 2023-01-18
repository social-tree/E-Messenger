import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

const AuthUrls = ['/channels', '/channels/[id]', '/channels']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req, res })
  const { data } = await supabase.auth.getUser()
  if (!data.user && req?.page.name && AuthUrls.includes(req?.page.name)) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  } else if (data.user && req?.page.name && req?.page.name === '/') {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/channels'
    return NextResponse.redirect(redirectUrl)
  }
  return
}

export const config = {
  matcher: '/middleware-protected',
}
