"use client";

import { useEffect, useState } from "react";
import { Activity, RefreshCcw, Search, Send } from "lucide-react";
import { Badge, Button, Card, Field, Input, SectionTitle } from "@/components/ui/primitives";
import { postJson } from "@/lib/client-api";
import { demoData } from "@/lib/demo-data";

function ResultBox({ result }) {
  if (!result) return null;

  return (
    <pre className="max-h-64 overflow-auto rounded-2xl bg-[var(--color-shell)] p-4 text-xs leading-5 text-white">
      {JSON.stringify(result, null, 2)}
    </pre>
  );
}

export function SquadOperationsPanel() {
  const [status, setStatus] = useState(null);
  const [transactionRef, setTransactionRef] = useState("ECONID_PAY_DEMO");
  const [transferRef, setTransferRef] = useState("ECONID_TRF_DEMO");
  const [amount, setAmount] = useState("10000");
  const [virtualAccountNumber, setVirtualAccountNumber] = useState(demoData.trader.virtualAccount);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  async function loadStatus() {
    setLoading("status");
    setError("");
    try {
      const response = await fetch("/api/squad/status", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? "Unable to load Squad status");
      setStatus(payload.data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading("");
    }
  }

  useEffect(() => {
    let active = true;

    async function fetchStatus() {
      try {
        const response = await fetch("/api/squad/status", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error ?? "Unable to load Squad status");
        if (active) setStatus(payload.data);
      } catch (loadError) {
        if (active) setError(loadError.message);
      }
    }

    fetchStatus();
    return () => {
      active = false;
    };
  }, []);

  async function runAction(name, path, body) {
    setLoading(name);
    setError("");
    try {
      const response = await postJson(path, body);
      setResult(response);
      await loadStatus();
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setLoading("");
    }
  }

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <SectionTitle title="Squad Operations" body="Sandbox controls for payment, transfer, and webhook demos." />
        <Badge tone={status?.mode === "live-sandbox" ? "positive" : "gold"}>
          {status?.mode ?? "loading"}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-[var(--color-surface-alt)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">Base URL</p>
          <p className="mt-2 break-all text-sm font-bold text-[var(--color-ink)]">{status?.baseUrl ?? "..."}</p>
        </div>
        <div className="rounded-2xl bg-[var(--color-surface-alt)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">Secret key</p>
          <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">{status?.secretKey ?? "..."}</p>
        </div>
        <div className="rounded-2xl bg-[var(--color-surface-alt)] p-4 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">Webhook URL</p>
          <p className="mt-2 break-all text-sm font-bold text-[var(--color-ink)]">{status?.webhookUrl ?? "..."}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid gap-3">
          <Field label="Transaction ref">
            <Input value={transactionRef} onChange={(event) => setTransactionRef(event.target.value)} />
          </Field>
          <Button
            icon={Search}
            tone="secondary"
            className="justify-center"
            onClick={() => runAction("verify", "/api/squad/verify", { transactionRef })}
          >
            {loading === "verify" ? "Verifying..." : "Verify"}
          </Button>
        </div>

        <div className="grid gap-3">
          <Field label="Virtual account">
            <Input value={virtualAccountNumber} onChange={(event) => setVirtualAccountNumber(event.target.value)} />
          </Field>
          <Field label="Amount">
            <Input value={amount} inputMode="numeric" onChange={(event) => setAmount(event.target.value)} />
          </Field>
          <Button
            icon={Send}
            tone="gold"
            className="justify-center"
            onClick={() =>
              runAction("simulate", "/api/squad/simulate-payment", {
                virtualAccountNumber,
                amount: Number(amount),
              })
            }
          >
            {loading === "simulate" ? "Simulating..." : "Simulate payment"}
          </Button>
        </div>

        <div className="grid gap-3">
          <Field label="Transfer ref">
            <Input value={transferRef} onChange={(event) => setTransferRef(event.target.value)} />
          </Field>
          <Button
            icon={RefreshCcw}
            tone="secondary"
            className="justify-center"
            onClick={() => runAction("requery", "/api/squad/transfer-requery", { transactionReference: transferRef })}
          >
            {loading === "requery" ? "Checking..." : "Requery transfer"}
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm font-semibold text-[var(--color-danger)]">{error}</p> : null}
      <ResultBox result={result} />

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink)]">
          <Activity className="h-4 w-4" aria-hidden="true" />
          Latest webhooks
        </div>
        <div className="grid gap-2">
          {(status?.latestWebhookEvents ?? []).length > 0 ? (
            status.latestWebhookEvents.map((event) => (
              <div key={event.id} className="rounded-2xl bg-[var(--color-surface-alt)] p-3 text-sm">
                <p className="font-bold text-[var(--color-ink)]">
                  {event.payload?.parsed?.event ?? event.payload?.Event ?? "Squad event"}
                </p>
                <p className="mt-1 text-[var(--color-muted)]">
                  {event.payload?.parsed?.transactionRef ?? event.payload?.TransactionRef ?? event.event_hash}
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-[var(--color-surface-alt)] p-3 text-sm text-[var(--color-muted)]">
              No webhook events stored yet.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
