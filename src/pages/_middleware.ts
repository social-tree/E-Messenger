import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

const AuthUrls = ['/channels', 'forget-password']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  console.log(req.url)
  if (session?.user && req?.page.name && req?.page.name === '/') {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/channels/1'
    console.log('channels')
    return NextResponse.redirect(redirectUrl)
  }
  if (!session?.user && req?.page.name && AuthUrls.includes(req?.page.name)) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }
  return
}

export const config = {
  matcher: '/middleware-protected',
}
