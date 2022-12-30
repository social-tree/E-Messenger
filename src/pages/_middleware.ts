import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

const AuthUrls = ['/channels', '/forgot-password']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user && req?.page.name && AuthUrls.includes(req?.page.name)) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  } else if (session?.user && req?.page.name && req?.page.name === '/') {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/channels/1'
    return NextResponse.redirect(redirectUrl)
  }
  console.log(req?.page.name)
  return
}

export const config = {
  matcher: '/middleware-protected',
}
