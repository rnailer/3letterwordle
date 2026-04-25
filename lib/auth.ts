import { createSbServer } from '@/lib/supabase-server';
import { createServerSupabase, hasSupabaseCredentials } from '@/lib/supabase';

// Returns the authenticated user id from cookies, or null if signed out.
export async function getServerUserId(): Promise<string | null> {
  if (!hasSupabaseCredentials()) return null;
  try {
    const supabase = await createSbServer();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

// Attaches every anonymous play recorded under the given player_id cookie
// to the given user. Idempotent; safe to call on every login.
export async function claimAnonPlays(userId: string, playerId: string): Promise<void> {
  if (!hasSupabaseCredentials()) return;
  const admin = createServerSupabase();
  await admin
    .from('plays')
    .update({ user_id: userId })
    .eq('player_id', playerId)
    .is('user_id', null);
}
