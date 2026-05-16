import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createError, createOk } from "@/lib/utils";
import { getSupabaseServerClient } from "@/server/supabase/server";

export class ApiError extends Error {
  constructor(message, status = 400, meta = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.meta = meta;
  }
}

export function getRequestId(request) {
  return request.headers.get("x-request-id") ?? crypto.randomUUID();
}

export function createMeta(mode, requestId, extra = {}) {
  return {
    mode,
    requestId,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

export function ok(data, meta) {
  return NextResponse.json(createOk(data, meta));
}

export function fail(error, requestId) {
  const status = error instanceof ApiError ? error.status : 500;
  const message = error instanceof ApiError ? error.message : "Internal server error";
  const meta = createMeta(env.demoMode ? "demo" : "live", requestId, error instanceof ApiError ? error.meta : {});
  return NextResponse.json(createError(message, meta), { status });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError("Invalid JSON body", 400);
  }
}

export function requireString(value, field, { optional = false } = {}) {
  if (value == null || value === "") {
    if (optional) return undefined;
    throw new ApiError(`${field} is required`, 422);
  }
  if (typeof value !== "string") {
    throw new ApiError(`${field} must be a string`, 422);
  }
  return value.trim();
}

export function requireNumber(value, field, { min = undefined, max = undefined, optional = false } = {}) {
  if (value == null || value === "") {
    if (optional) return undefined;
    throw new ApiError(`${field} is required`, 422);
  }
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new ApiError(`${field} must be a number`, 422);
  }
  if (min != null && value < min) {
    throw new ApiError(`${field} must be >= ${min}`, 422);
  }
  if (max != null && value > max) {
    throw new ApiError(`${field} must be <= ${max}`, 422);
  }
  return value;
}

export function resolveMode(liveResult) {
  return liveResult && !liveResult.fallback ? "live" : "demo";
}

export function assertCronSecret(request) {
  const expected = process.env.ECONID_CRON_SECRET ?? "";
  if (!expected) {
    if (env.demoMode) return;
    throw new ApiError("Cron secret not configured", 500);
  }

  const received = request.headers.get("x-cron-secret") ?? "";
  if (received !== expected) {
    throw new ApiError("Invalid cron secret", 401);
  }
}

export async function requireActor(request, { allowDemo = false, roles = [] } = {}) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";

  const serverClient = getSupabaseServerClient();
  if (!serverClient) {
    if (allowDemo && env.demoMode) {
      const demoRole = roles.includes("trader") ? "trader" : "demo";
      if (roles.length > 0 && !roles.includes(demoRole)) {
        throw new ApiError("Forbidden", 403);
      }
      return { id: "demo-user", role: demoRole, demo: true };
    }
    throw new ApiError("Authentication is not configured", 500);
  }

  if (!token) {
    throw new ApiError("Unauthorized", 401);
  }

  const { data, error } = await serverClient.auth.getUser(token);
  if (error || !data?.user) {
    throw new ApiError("Unauthorized", 401);
  }

  const role = data.user.user_metadata?.role ?? "trader";
  if (roles.length > 0 && !roles.includes(role)) {
    throw new ApiError("Forbidden", 403);
  }

  return { id: data.user.id, role, demo: false };
}
