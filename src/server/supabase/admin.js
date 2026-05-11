import { createClient } from "@supabase/supabase-js";
import { canUseSupabaseAdmin, env } from "@/lib/env";

export function getSupabaseAdminClient() {
  if (!canUseSupabaseAdmin()) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
