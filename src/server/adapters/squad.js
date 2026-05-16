import crypto from "node:crypto";
import { canUseSquad, env } from "@/lib/env";

export class SquadError extends Error {
  constructor(message, meta = {}) {
    super(message);
    this.name = "SquadError";
    this.meta = meta;
  }
}

function isSandboxServiceUnavailable(error) {
  if (!(error instanceof SquadError)) return false;
  return /Merchant not eligible|Merchant not profiled/i.test(error.message);
}

function toKobo(amount) {
  return String(Math.round(Number(amount || 0) * 100));
}

function compact(value, fallback = undefined) {
  if (value == null || value === "") return fallback;
  return String(value).trim();
}

function splitName(fullName = "Mama Titi") {
  const parts = compact(fullName, "Mama Titi").split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "Mama",
    lastName: parts.slice(1).join(" ") || "Trader",
  };
}

function transactionRef(prefix, id = "demo") {
  const safeId = String(id).replace(/[^a-zA-Z0-9]/g, "").slice(-10) || "demo";
  return `ECONID_${prefix}_${safeId}_${Date.now()}`;
}

function normalizeSquadResult(kind, response, requestPayload = {}) {
  const data = response?.data ?? {};

  if (kind === "virtualAccount") {
    return {
      status: "sandbox_account_created",
      provider: "squad",
      traderId: requestPayload.customer_identifier,
      virtualAccountNumber: data.virtual_account_number ?? data.virtualAccountNumber,
      bankCode: data.bank_code,
      beneficiaryAccount: data.beneficiary_account,
      customerIdentifier: data.customer_identifier ?? requestPayload.customer_identifier,
      providerMessage: response?.message,
      providerPayload: response,
    };
  }

  if (kind === "payment") {
    return {
      status: "checkout_created",
      provider: "squad",
      checkoutUrl: data.checkout_url ?? data.auth_url ?? data.checkoutUrl,
      transactionRef: data.transaction_ref ?? requestPayload.transaction_ref,
      amount: Number(data.transaction_amount ?? requestPayload.amount ?? 0) / 100,
      currency: data.currency ?? requestPayload.currency,
      channels: data.authorized_channels ?? requestPayload.payment_channels,
      recurring: Boolean(data.is_recurring ?? requestPayload.is_recurring),
      providerMessage: response?.message,
      providerPayload: response,
    };
  }

  if (kind === "verify") {
    return {
      status: data.transaction_status ?? response?.message ?? "unknown",
      provider: "squad",
      transactionRef: data.transaction_ref ?? requestPayload.transaction_ref,
      amount: Number(data.transaction_amount ?? 0) / 100,
      currency: data.transaction_currency_id,
      channel: data.transaction_type,
      providerPayload: response,
    };
  }

  if (kind === "lookup") {
    return {
      status: "account_lookup_ok",
      provider: "squad",
      accountName: data.account_name ?? requestPayload.account_name,
      accountNumber: data.account_number ?? requestPayload.account_number,
      providerPayload: response,
    };
  }

  if (kind === "transfer" || kind === "requery") {
    return {
      status: data.nip_transaction_reference ? "disbursed" : "queued_for_disbursement",
      provider: "squad",
      transferReference: data.transaction_reference ?? requestPayload.transaction_reference,
      nipReference: data.nip_transaction_reference,
      amount: Number(data.amount ?? requestPayload.amount ?? 0) / 100,
      accountNumber: data.account_number ?? requestPayload.account_number,
      accountName: data.account_name ?? requestPayload.account_name,
      destinationInstitution: data.destination_institution_name,
      providerMessage: response?.message,
      providerPayload: response,
    };
  }

  return {
    status: response?.success ? "success" : "submitted",
    provider: "squad",
    providerMessage: response?.message,
    providerPayload: response,
  };
}

async function squadFetch(path, { method = "POST", body, query } = {}) {
  if (!canUseSquad()) {
    return null;
  }

  const url = new URL(`${env.squadBaseUrl}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value != null && value !== "") url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${env.squadSecretKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.success === false) {
    throw new SquadError(payload?.message || `Squad request failed with status ${response.status}`, {
      status: response.status,
      path,
      payload,
    });
  }

  return payload;
}

export function buildVirtualAccountPayload(input = {}) {
  const { firstName, lastName } = splitName(input.fullName);
  const customerIdentifier = compact(input.traderId, compact(input.customer_identifier, "trd-mama-titi"));

  return {
    first_name: compact(input.firstName, firstName),
    last_name: compact(input.lastName, lastName),
    mobile_num: compact(input.phone, "08000000000"),
    email: compact(input.email, "demo-trader@econsid.local"),
    bvn: compact(input.bvn, "22222222222"),
    dob: compact(input.dob, "1986-05-13"),
    gender: compact(input.gender, "F"),
    address: compact(input.address, `${compact(input.market, "Balogun Market")}, Lagos`),
    customer_identifier: customerIdentifier,
  };
}

export async function createVirtualAccount(input = {}) {
  const body = buildVirtualAccountPayload(input);
  const response = await squadFetch("/virtual-account", { method: "POST", body });
  if (!response) return null;
  return normalizeSquadResult("virtualAccount", response, body);
}

export function buildPaymentPayload(input = {}, flow = "credit_repayment") {
  const ref = compact(input.transactionRef, transactionRef(flow === "insurance_subscription" ? "INS" : "PAY", input.traderId));
  const amount = input.amount ?? input.premium;

  return {
    amount: toKobo(amount),
    email: compact(input.email, "demo-trader@econsid.local"),
    currency: "NGN",
    initiate_type: "inline",
    transaction_ref: ref,
    customer_name: compact(input.customerName, compact(input.fullName, "Mama Titi")),
    callback_url: compact(input.callbackUrl, `${env.appUrl}/dashboard/${flow === "insurance_subscription" ? "insurance" : "credit"}?transaction_ref=${ref}`),
    payment_channels: ["card", "bank", "ussd", "transfer"],
    is_recurring: flow === "insurance_subscription",
    metadata: {
      traderId: compact(input.traderId, "trd-mama-titi"),
      flow,
      tier: input.tier ?? null,
      note: compact(input.note, flow),
      amount: Number(amount),
    },
  };
}

export async function initiatePayment(input = {}, flow = "credit_repayment") {
  const body = buildPaymentPayload(input, flow);
  const response = await squadFetch("/transaction/initiate", { method: "POST", body });
  if (!response) return null;
  return normalizeSquadResult("payment", response, body);
}

export async function verifyTransaction(transactionRef) {
  const ref = compact(transactionRef);
  const response = await squadFetch(`/transaction/verify/${encodeURIComponent(ref)}`, {
    method: "GET",
  });
  if (!response) return null;
  return normalizeSquadResult("verify", response, { transaction_ref: ref });
}

export async function simulateVirtualAccountPayment(input = {}) {
  const body = {
    virtual_account_number: compact(input.virtualAccountNumber ?? input.virtual_account_number, "7834927713"),
    amount: toKobo(input.amount ?? 10000),
  };
  const response = await squadFetch("/virtual-account/simulate/payment", { method: "POST", body });
  if (!response) return null;
  return {
    status: "simulated_payment_sent",
    provider: "squad",
    virtualAccountNumber: body.virtual_account_number,
    amount: Number(body.amount) / 100,
    providerPayload: response,
  };
}

export async function lookupAccount(input = {}) {
  const body = {
    bank_code: compact(input.bankCode ?? input.bank_code, "000013"),
    account_number: compact(input.accountNumber ?? input.account_number, "0123456789"),
  };
  const response = await squadFetch("/payout/account/lookup", { method: "POST", body });
  if (!response) return null;
  return normalizeSquadResult("lookup", response, body);
}

export function buildTransferPayload(input = {}, lookup = {}) {
  const ref = compact(input.transactionReference, transactionRef("TRF", input.traderId));
  const bankCode = compact(input.bankCode ?? input.bank_code, "000013");
  const accountNumber = compact(input.accountNumber ?? input.account_number, "0123456789");
  const accountName = compact(lookup.accountName ?? input.accountName ?? input.account_name, "MAMA TITI");

  return {
    transaction_reference: ref,
    amount: toKobo(input.amount),
    currency_id: "NGN",
    account_number: accountNumber,
    account_name: accountName,
    bank_code: bankCode,
    remark: compact(input.remark, `EconID credit ${compact(input.traderId, "demo")}`),
  };
}

export async function createTransfer(input = {}) {
  const lookup = await lookupAccount(input).catch((error) => {
    if (env.demoMode || isSandboxServiceUnavailable(error)) {
      return {
        status: "account_lookup_deferred",
        provider: "squad",
        accountName: compact(input.accountName ?? input.account_name, "MAMA TITI"),
        accountNumber: compact(input.accountNumber ?? input.account_number, "0123456789"),
        fallback: true,
        providerError: error.meta ?? { message: error.message },
      };
    }
    throw error;
  });
  const body = buildTransferPayload(input, lookup ?? {});
  const response = await squadFetch("/payout/transfer", { method: "POST", body }).catch((error) => {
    if (env.demoMode || isSandboxServiceUnavailable(error)) {
      return {
        status: error.meta?.status ?? 202,
        success: true,
        message: "Squad sandbox transfer queued for demo disbursement",
        data: body,
        fallback: true,
        error: error.meta ?? { message: error.message },
      };
    }
    throw error;
  });
  if (!response) return null;
  return {
    ...normalizeSquadResult("transfer", response, body),
    lookup,
    fallback: Boolean(response?.fallback || lookup?.fallback),
  };
}

export async function requeryTransfer(transactionReference) {
  const body = { transaction_reference: compact(transactionReference) };
  const response = await squadFetch("/payout/requery", { method: "POST", body });
  if (!response) return null;
  return normalizeSquadResult("requery", response, body);
}

export async function listTransfers(input = {}) {
  const today = new Date();
  const endDate = compact(input.endDate, today.toISOString().slice(0, 10));
  const start = new Date(today);
  start.setDate(today.getDate() - 7);
  const query = {
    currency: "NGN",
    start_date: compact(input.startDate, start.toISOString().slice(0, 10)),
    end_date: endDate,
    page: compact(input.page, "1"),
    perpage: compact(input.perPage ?? input.perpage, "10"),
    reference: compact(input.reference, undefined),
  };
  const response = await squadFetch("/transaction", { method: "GET", query });
  if (!response) return null;
  return {
    status: "transactions_loaded",
    provider: "squad",
    transactions: response?.data ?? [],
    providerPayload: response,
  };
}

export function extractWebhookEvent(payload = {}) {
  const body = payload.Body ?? payload.body ?? {};
  const paymentInfo = body.payment_information ?? body.paymentInformation ?? {};
  const metadata = body.meta ?? body.metadata ?? payload.metadata ?? {};
  const transactionRef = payload.TransactionRef ?? payload.transaction_ref ?? body.transaction_ref;

  return {
    event: payload.Event ?? payload.event ?? "unknown",
    transactionRef,
    status: body.transaction_status ?? payload.transaction_status ?? "unknown",
    amount: Number(body.amount ?? body.transaction_amount ?? payload.amount ?? 0) / 100,
    channel: body.transaction_type ?? paymentInfo.payment_type ?? payload.channel,
    tokenId: paymentInfo.token_id ?? body.token_id,
    flow: metadata.flow ?? payload.flow ?? (body.virtual_account_number ? "virtual_account_inflow" : "unmapped"),
    metadata,
    body,
  };
}

export function verifySquadWebhook(rawBody, signature) {
  if (!env.squadWebhookSecret) {
    return env.demoMode;
  }

  const digest = crypto.createHmac("sha256", env.squadWebhookSecret).update(rawBody).digest("hex");
  return digest === signature;
}
