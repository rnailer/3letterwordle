import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { PLAYER_COOKIE, PLAYER_COOKIE_MAX_AGE } from './lib/cookies';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (!req.cookies.get(PLAYER_COOKIE)) {
    res.cookies.set(PLAYER_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: PLAYER_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === 'production',
    });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    });
    // Touching the user refreshes the access token cookie if needed.
    await supabase.auth.getUser();
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
