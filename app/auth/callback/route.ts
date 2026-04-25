import { NextRequest, NextResponse } from 'next/server';
import { createSbServer } from '@/lib/supabase-server';
import { claimAnonPlays } from '@/lib/auth';
import { PLAYER_COOKIE } from '@/lib/cookies';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const errorParam = url.searchParams.get('error_description') || url.searchParams.get('error');
  const next = url.searchParams.get('next') || '/play';

  if (errorParam) {
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(errorParam)}`, req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?auth_error=missing_code', req.url));
  }

  const supabase = await createSbServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(error.message)}`, req.url));
  }

  const { data: { user } } = await supabase.auth.getUser();
  const playerId = req.cookies.get(PLAYER_COOKIE)?.value;
  if (user && playerId) {
    try {
      await claimAnonPlays(user.id, playerId);
    } catch {
      // Claim is best-effort; the session is still valid even if it fails.
    }
  }

  return NextResponse.redirect(new URL(next, req.url));
}
