import { getSupabaseAdminClient } from "@/server/supabase/admin";
import {
  ApiError,
  createMeta,
  fail,
  getRequestId,
  ok,
  readJson,
  requireString,
} from "@/server/api/route-kit";

export async function POST(request) {
  const requestId = getRequestId(request);
  try {
    const admin = getSupabaseAdminClient();
    if (!admin) {
      throw new ApiError("Supabase admin access is not configured", 500);
    }

    const payload = await readJson(request);
    const email = requireString(payload.email, "email");
    const password = requireString(payload.password, "password");
    const phone = requireString(payload.phone, "phone");
    const fullName = requireString(payload.fullName, "fullName");

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "trader",
        phone,
        fullName,
      },
    });

    if (error) {
      const status = /already|exists|registered/i.test(error.message) ? 409 : 422;
      throw new ApiError(error.message, status);
    }

    return ok(
      {
        userId: data.user?.id ?? null,
        email: data.user?.email ?? email,
        role: data.user?.user_metadata?.role ?? "trader",
      },
      createMeta("live", requestId)
    );
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Unable to create trader account", 500), requestId);
  }
}
