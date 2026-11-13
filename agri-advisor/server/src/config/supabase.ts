import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Admin / Service Role client (strictly server-side, for privileged operations like storage administration and backend tasks)
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Standard client for public or token-based queries
export const supabasePublic = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

/**
 * Creates an authenticated Supabase client using the caller's JWT.
 * This automatically respects Supabase Row Level Security (RLS).
 */
export function createAuthenticatedClient(jwtToken: string) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
