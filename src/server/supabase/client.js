import { createClient } from "@supabase/supabase-js";
import { canUseSupabase, env } from "@/lib/env";

export function getSupabaseBrowserClient() {
  if (!canUseSupabase()) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey);
}
