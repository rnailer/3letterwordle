import { NextRequest, NextResponse } from 'next/server';
import { createSbServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = await createSbServer();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/', req.url), { status: 303 });
}
