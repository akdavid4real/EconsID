import { createClient } from "@supabase/supabase-js";
import { canUseSupabase, env } from "@/lib/env";

export function getSupabaseServerClient() {
  if (!canUseSupabase()) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
