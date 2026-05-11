import crypto from "node:crypto";
import { canUseSquad, env } from "@/lib/env";

async function squadFetch(path, body) {
  const response = await fetch(`${env.squadBaseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.squadSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Squad request failed with status ${response.status}`);
  }

  return response.json();
}

export async function createVirtualAccount(payload) {
  if (!canUseSquad()) {
    return null;
  }

  return squadFetch("/virtual-account", payload);
}

export async function initiatePayment(payload) {
  if (!canUseSquad()) {
    return null;
  }

  return squadFetch("/transaction/initiate", payload);
}

export async function createTransfer(payload) {
  if (!canUseSquad()) {
    return null;
  }

  return squadFetch("/payout/transfer", payload);
}

export function verifySquadWebhook(rawBody, signature) {
  if (!env.squadWebhookSecret) {
    return env.demoMode;
  }

  const digest = crypto.createHmac("sha256", env.squadWebhookSecret).update(rawBody).digest("hex");
  return digest === signature;
}
