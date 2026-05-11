const truthy = new Set(["1", "true", "yes", "on"]);

function read(key, fallback = "") {
  return process.env[key] ?? fallback;
}

export const env = {
  appUrl: read("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  supabaseUrl: read("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: read("SUPABASE_SERVICE_ROLE_KEY"),
  squadSecretKey: read("SQUAD_SECRET_KEY"),
  squadBaseUrl: read("SQUAD_BASE_URL", "https://sandbox-api-d.squadco.com"),
  squadWebhookSecret: read("SQUAD_WEBHOOK_SECRET"),
  mistralApiKey: read("MISTRAL_API_KEY"),
  demoMode: truthy.has(read("ECONID_DEMO_MODE", "true").toLowerCase()),
};

export function canUseSupabase() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function canUseSupabaseAdmin() {
  return Boolean(canUseSupabase() && env.supabaseServiceRoleKey);
}

export function canUseSquad() {
  return Boolean(env.squadSecretKey && env.squadBaseUrl);
}
