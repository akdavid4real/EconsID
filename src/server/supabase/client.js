import { createClient } from "@supabase/supabase-js";
import { canUseSupabase, env } from "@/lib/env";

export function getSupabaseBrowserClient() {
  if (!canUseSupabase()) {
    return null;
  }

  if (!globalThis.__ECONID_SUPABASE_BROWSER__) {
    globalThis.__ECONID_SUPABASE_BROWSER__ = createClient(env.supabaseUrl, env.supabaseAnonKey);
  }

  return globalThis.__ECONID_SUPABASE_BROWSER__;
}
