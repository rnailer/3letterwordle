import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PLAYER_COOKIE, PLAYER_COOKIE_MAX_AGE } from './lib/cookies';

export function middleware(req: NextRequest) {
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
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
