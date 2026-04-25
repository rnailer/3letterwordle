import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';

// User-scoped server client that reads/writes auth cookies through the
// Next request lifecycle. Use this when you need to know who the
// authenticated user is. For DB writes that should bypass RLS (inserts
// into plays, claim updates, etc.) keep using createServerSupabase()
// from lib/supabase.ts — that one carries the service-role key.
export async function createSbServer(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  }
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component where cookies can't be written;
          // safe to ignore — middleware will refresh the session next request.
        }
      },
    },
  });
}
