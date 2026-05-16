"use client";

import { useEffect, useState } from "react";
import { Card, SectionTitle } from "@/components/ui/primitives";
import { fetchJson } from "@/lib/client-api";

export function LenderLiveSummary() {
  const [state, setState] = useState({ loading: true, error: "", data: null });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetchJson("/api/lender/summary");
        if (active) setState({ loading: false, error: "", data: response.data });
      } catch (error) {
        if (active) setState({ loading: false, error: error.message, data: null });
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  if (state.loading) {
    return (
      <Card className="space-y-2">
        <SectionTitle title="Saved lender status" body="Loading recent saved platform activity." />
      </Card>
    );
  }

  if (state.error) {
    return (
      <Card className="space-y-2">
        <SectionTitle title="Saved lender status" body={state.error} />
      </Card>
    );
  }

  const data = state.data ?? {};

  return (
    <Card className="space-y-4">
      <SectionTitle title="Saved lender status" body="This block reads current persisted platform activity." />
      <div className="grid gap-2">
        <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
          <span className="text-sm text-[var(--color-muted)]">Credit applications</span>
          <span className="font-bold">{data.creditApplicationsCount ?? 0}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
          <span className="text-sm text-[var(--color-muted)]">Insurance claims</span>
          <span className="font-bold">{data.insuranceClaimsCount ?? 0}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
          <span className="text-sm text-[var(--color-muted)]">Stored webhooks</span>
          <span className="font-bold">{data.webhookEventsCount ?? 0}</span>
        </div>
      </div>
      <div className="grid gap-2">
        {(data.latestWebhookEvents ?? []).length > 0 ? (
          data.latestWebhookEvents.map((event) => (
            <div key={event.id} className="rounded-2xl bg-[var(--color-surface-alt)] p-3 text-sm text-[var(--color-ink)]">
              <p className="font-bold">{event.payload?.parsed?.event ?? "Squad event"}</p>
              <p className="mt-1 text-[var(--color-muted)]">
                {event.payload?.parsed?.transactionRef ?? event.event_hash}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-2xl bg-[var(--color-surface-alt)] p-3 text-sm text-[var(--color-muted)]">
            No live webhook events stored yet.
          </p>
        )}
      </div>
    </Card>
  );
}
