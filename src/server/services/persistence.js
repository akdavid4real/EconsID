import crypto from "node:crypto";
import { getSupabaseAdminClient } from "@/server/supabase/admin";

const demoStore = globalThis.__ECONID_DEMO_STORE__ ?? {
  onboardingProfiles: [],
  webhookEvents: [],
  creditApplications: [],
  creditRepayments: [],
  insuranceSubscriptions: [],
  insuranceClaims: [],
  riskScans: [],
  scoreSnapshots: [],
  traders: [],
};

if (!globalThis.__ECONID_DEMO_STORE__) {
  globalThis.__ECONID_DEMO_STORE__ = demoStore;
}

async function insertOne(table, payload) {
  const client = getSupabaseAdminClient();
  if (!client) {
    const record = {
      id: payload.id ?? crypto.randomUUID(),
      created_at: payload.created_at ?? new Date().toISOString(),
      ...payload,
    };

    if (table === "webhook_events") {
      demoStore.webhookEvents.unshift(record);
    }
    if (table === "onboarding_profiles") {
      demoStore.onboardingProfiles.unshift(record);
    }
    if (table === "credit_applications") {
      demoStore.creditApplications.unshift(record);
    }
    if (table === "credit_repayments") {
      demoStore.creditRepayments.unshift(record);
    }
    if (table === "insurance_subscriptions") {
      demoStore.insuranceSubscriptions.unshift(record);
    }
    if (table === "insurance_claims") {
      demoStore.insuranceClaims.unshift(record);
    }
    if (table === "risk_scans") {
      demoStore.riskScans.unshift(record);
    }
    if (table === "score_snapshots") {
      demoStore.scoreSnapshots.unshift(record);
    }
    if (table === "traders") {
      demoStore.traders = [record, ...demoStore.traders.filter((row) => row.external_id !== record.external_id)];
    }

    return record;
  }

  const record = {
    id: payload.id ?? crypto.randomUUID(),
    created_at: payload.created_at ?? new Date().toISOString(),
    ...payload,
  };

  const { data, error } = await client.from(table).insert(record).select("*").maybeSingle();
  if (error) {
    return null;
  }

  return data;
}

export async function saveOnboardingEvent(payload) {
  return insertOne("onboarding_profiles", payload);
}

export async function saveTraderProfile(payload) {
  const client = getSupabaseAdminClient();
  if (!client) {
    const record = {
      id: payload.id ?? crypto.randomUUID(),
      created_at: payload.created_at ?? new Date().toISOString(),
      ...payload,
    };
    demoStore.traders = [
      record,
      ...demoStore.traders.filter((row) => row.external_id !== record.external_id),
    ];
    return record;
  }

  const record = {
    external_id: payload.external_id,
    full_name: payload.full_name ?? null,
    market: payload.market ?? null,
    category: payload.category ?? null,
    location: payload.location ?? null,
  };

  const { data, error } = await client
    .from("traders")
    .upsert(record, { onConflict: "external_id" })
    .select("*")
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function saveScoreSnapshot(payload) {
  return insertOne("score_snapshots", payload);
}

export async function saveCreditApplication(payload) {
  return insertOne("credit_applications", payload);
}

export async function saveCreditRepayment(payload) {
  return insertOne("credit_repayments", payload);
}

export async function saveInsuranceSubscription(payload) {
  return insertOne("insurance_subscriptions", payload);
}

export async function saveInsuranceClaim(payload) {
  return insertOne("insurance_claims", payload);
}

export async function saveRiskScan(payload) {
  return insertOne("risk_scans", payload);
}

export async function getWebhookEventByHash(eventHash) {
  const client = getSupabaseAdminClient();
  if (!client) {
    return demoStore.webhookEvents.find((event) => event.event_hash === eventHash) ?? null;
  }

  const { data, error } = await client
    .from("webhook_events")
    .select("*")
    .eq("event_hash", eventHash)
    .limit(1)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function saveWebhookEvent(payload) {
  return insertOne("webhook_events", payload);
}

export async function getLatestWebhookEvents(limit = 5) {
  const client = getSupabaseAdminClient();
  if (!client) {
    return demoStore.webhookEvents.slice(0, limit);
  }

  const { data, error } = await client
    .from("webhook_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return data ?? [];
}

function getDemoCollection(table) {
  if (table === "onboarding_profiles") return demoStore.onboardingProfiles;
  if (table === "score_snapshots") return demoStore.scoreSnapshots;
  if (table === "credit_applications") return demoStore.creditApplications;
  if (table === "credit_repayments") return demoStore.creditRepayments;
  if (table === "insurance_subscriptions") return demoStore.insuranceSubscriptions;
  if (table === "insurance_claims") return demoStore.insuranceClaims;
  if (table === "risk_scans") return demoStore.riskScans;
  if (table === "webhook_events") return demoStore.webhookEvents;
  if (table === "traders") return demoStore.traders;
  return [];
}

export async function getLatestRowForActor(table, actorId) {
  const client = getSupabaseAdminClient();
  if (!client) {
    return getDemoCollection(table).find((row) => row.actor_id === actorId) ?? null;
  }

  const { data, error } = await client
    .from(table)
    .select("*")
    .eq("actor_id", actorId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function getTraderProfileByActorId(actorId) {
  const client = getSupabaseAdminClient();
  if (!client) {
    return demoStore.traders.find((row) => row.external_id === actorId) ?? null;
  }

  const { data, error } = await client
    .from("traders")
    .select("*")
    .eq("external_id", actorId)
    .limit(1)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function getLatestRecords(table, limit = 5) {
  const client = getSupabaseAdminClient();
  if (!client) {
    return getDemoCollection(table).slice(0, limit);
  }

  const { data, error } = await client
    .from(table)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function countRows(table) {
  const client = getSupabaseAdminClient();
  if (!client) {
    return getDemoCollection(table).length;
  }

  const { count, error } = await client
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) {
    return 0;
  }

  return count ?? 0;
}

async function patchLatestByProviderReference(table, providerReference, payload) {
  const client = getSupabaseAdminClient();
  if (!client || !providerReference) {
    const collection =
      table === "credit_repayments"
        ? demoStore.creditRepayments
        : [];
    const existing = collection.find((row) => row.provider_reference === providerReference);
    if (!existing) return null;
    existing.status = payload.status;
    existing.payload = {
      ...(existing.payload ?? {}),
      squadWebhook: payload.webhook,
      tokenId: payload.tokenId ?? existing.payload?.tokenId,
    };
    return existing;
  }

  const { data: existing, error: readError } = await client
    .from(table)
    .select("id,payload")
    .eq("provider_reference", providerReference)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (readError || !existing) {
    return null;
  }

  const nextPayload = {
    ...(existing.payload ?? {}),
    squadWebhook: payload.webhook,
    tokenId: payload.tokenId ?? existing.payload?.tokenId,
  };

  const { data, error } = await client
    .from(table)
    .update({ status: payload.status, payload: nextPayload })
    .eq("id", existing.id)
    .select("*")
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

async function patchLatestInsuranceByReference(providerReference, payload) {
  const client = getSupabaseAdminClient();
  if (!client || !providerReference) {
    const existing = demoStore.insuranceSubscriptions.find(
      (row) => row.payload?.transactionRef === providerReference
    );
    if (!existing) return null;
    existing.status = payload.status;
    existing.payload = {
      ...(existing.payload ?? {}),
      squadWebhook: payload.webhook,
      tokenId: payload.tokenId ?? existing.payload?.tokenId,
    };
    return existing;
  }

  const { data: rows, error: readError } = await client
    .from("insurance_subscriptions")
    .select("id,payload")
    .order("created_at", { ascending: false })
    .limit(20);

  if (readError || !rows?.length) {
    return null;
  }

  const existing = rows.find((row) => row.payload?.transactionRef === providerReference);
  if (!existing) {
    return null;
  }

  const nextPayload = {
    ...(existing.payload ?? {}),
    squadWebhook: payload.webhook,
    tokenId: payload.tokenId ?? existing.payload?.tokenId,
  };

  const { data, error } = await client
    .from("insurance_subscriptions")
    .update({ status: payload.status, payload: nextPayload })
    .eq("id", existing.id)
    .select("*")
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function applySquadWebhook(event) {
  const status = String(event.status ?? "").toLowerCase() === "success" ? "paid" : String(event.status ?? "received").toLowerCase();
  const payload = {
    status,
    tokenId: event.tokenId ?? null,
    webhook: event,
  };

  if (event.flow === "credit_repayment") {
    return patchLatestByProviderReference("credit_repayments", event.transactionRef, payload);
  }

  if (event.flow === "insurance_subscription") {
    return patchLatestInsuranceByReference(event.transactionRef, {
      ...payload,
      status: status === "paid" ? "active" : status,
    });
  }

  if (event.flow === "virtual_account_inflow") {
    return insertOne("score_snapshots", {
      actor_id: "squad-webhook",
      trader_id: event.metadata?.traderId ?? event.body?.customer?.customer_identifier ?? null,
      score: 680,
      credit_tier: 2,
      story: "Squad virtual account inflow recorded as score-building transaction evidence.",
      payload: { squadWebhook: event },
      mode: "demo",
    });
  }

  return null;
}
