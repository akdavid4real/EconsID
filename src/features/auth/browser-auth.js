"use client";

import { getSupabaseBrowserClient } from "@/server/supabase/client";

function getSupabaseOrThrow() {
  const client = getSupabaseBrowserClient();
  if (!client) {
    throw new Error("Supabase is not configured");
  }
  return client;
}

function formatAuthError(error, fallback) {
  return error?.message || fallback;
}

export function getBrowserSupabase() {
  return getSupabaseOrThrow();
}

export async function getAccessToken() {
  const client = getSupabaseOrThrow();
  const { data, error } = await client.auth.getSession();
  if (error) {
    throw new Error(formatAuthError(error, "Unable to load session"));
  }
  return data.session?.access_token ?? "";
}

export async function signInWithPassword({ email, password }) {
  const client = getSupabaseOrThrow();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(formatAuthError(error, "Unable to sign in"));
  }
  return data;
}

export async function signOut() {
  const client = getSupabaseOrThrow();
  const { error } = await client.auth.signOut();
  if (error) {
    throw new Error(formatAuthError(error, "Unable to sign out"));
  }
}

export async function getCurrentSession() {
  const client = getSupabaseOrThrow();
  const { data, error } = await client.auth.getSession();
  if (error) {
    throw new Error(formatAuthError(error, "Unable to load session"));
  }
  return data.session ?? null;
}

export function subscribeToAuthState(callback) {
  const client = getSupabaseOrThrow();
  const { data } = client.auth.onAuthStateChange((_event, session) => {
    callback(session ?? null);
  });
  return () => data.subscription.unsubscribe();
}
