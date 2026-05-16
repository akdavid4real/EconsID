"use client";

import { useEffect, useState } from "react";
import { Card, SectionTitle } from "@/components/ui/primitives";
import { fetchJson } from "@/lib/client-api";
import { formatCurrency } from "@/lib/format";

function renderStatus(summary, key) {
  return summary?.workspace?.[key] || "Not yet recorded";
}

function renderValue(value, currency = false) {
  if (value == null || value === "") return "Not yet recorded";
  return currency ? formatCurrency(Number(value)) : String(value);
}

export function TraderLiveSummary({ section = "overview" }) {
  const [state, setState] = useState({ loading: true, error: "", data: null });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetchJson("/api/trader/summary");
        if (active) {
          setState({ loading: false, error: "", data: response.data });
        }
      } catch (error) {
        if (active) {
          setState({ loading: false, error: error.message, data: null });
        }
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
        <SectionTitle title="Saved account status" body="Loading your latest saved activity." />
      </Card>
    );
  }

  if (state.error) {
    return (
      <Card className="space-y-2">
        <SectionTitle title="Saved account status" body={state.error} />
      </Card>
    );
  }

  const summary = state.data ?? {};

  if (section === "identity") {
    return (
      <Card className="space-y-4">
        <SectionTitle title="Latest saved score" body="This section reads the newest score snapshot saved for this account." />
        <div className="grid gap-2">
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <span className="text-sm text-[var(--color-muted)]">Score</span>
            <span className="font-bold">{renderValue(summary.latestScore?.score)}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <span className="text-sm text-[var(--color-muted)]">Credit tier</span>
            <span className="font-bold">{renderValue(summary.latestScore?.credit_tier)}</span>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-3 text-sm text-[var(--color-muted)]">
            {summary.latestScore?.story || "No live score story saved yet."}
          </div>
        </div>
      </Card>
    );
  }

  if (section === "insurance") {
    return (
      <Card className="space-y-4">
        <SectionTitle title="Latest saved cover" body="This reflects the newest insurance records stored for this account." />
        <div className="grid gap-2">
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <span className="text-sm text-[var(--color-muted)]">Subscription</span>
            <span className="font-bold">{renderStatus(summary, "latestCoverStatus")}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <span className="text-sm text-[var(--color-muted)]">Premium</span>
            <span className="font-bold">{renderValue(summary.latestInsurance?.premium, true)}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <span className="text-sm text-[var(--color-muted)]">Latest claim</span>
            <span className="font-bold">{renderStatus(summary, "latestClaimStatus")}</span>
          </div>
        </div>
      </Card>
    );
  }

  if (section === "credit") {
    return (
      <Card className="space-y-4">
        <SectionTitle title="Latest saved credit activity" body="This reflects the latest credit application and repayment records." />
        <div className="grid gap-2">
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <span className="text-sm text-[var(--color-muted)]">Application status</span>
            <span className="font-bold">{renderStatus(summary, "latestCreditStatus")}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <span className="text-sm text-[var(--color-muted)]">Approved amount</span>
            <span className="font-bold">{renderValue(summary.latestCreditApplication?.amount, true)}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <span className="text-sm text-[var(--color-muted)]">Repayment status</span>
            <span className="font-bold">{renderStatus(summary, "latestRepaymentStatus")}</span>
          </div>
        </div>
      </Card>
    );
  }

  if (section === "claim-detail") {
    return (
      <Card className="space-y-4">
        <SectionTitle title="Latest claim record" body="This claim detail is read from the newest stored claim for this account." />
        <div className="grid gap-2">
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <span className="text-sm text-[var(--color-muted)]">Recommendation</span>
            <span className="font-bold">{renderValue(summary.latestClaim?.recommendation)}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <span className="text-sm text-[var(--color-muted)]">Confidence</span>
            <span className="font-bold">{renderValue(summary.latestClaim?.confidence)}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <span className="text-sm text-[var(--color-muted)]">Suggested payout</span>
            <span className="font-bold">{renderValue(summary.latestClaim?.suggested_payout, true)}</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <SectionTitle title="Saved account status" body="This block reads your latest saved onboarding, score, credit, and cover records." />
      <div className="grid gap-2">
        <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
          <span className="text-sm text-[var(--color-muted)]">Profile</span>
          <span className="font-bold">{summary.profile?.full_name || "Not saved yet"}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
          <span className="text-sm text-[var(--color-muted)]">Latest onboarding</span>
          <span className="font-bold">{renderStatus(summary, "latestOnboardingStatus")}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
          <span className="text-sm text-[var(--color-muted)]">Latest score</span>
          <span className="font-bold">{renderValue(summary.latestScore?.score)}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
          <span className="text-sm text-[var(--color-muted)]">Latest cover</span>
          <span className="font-bold">{renderStatus(summary, "latestCoverStatus")}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
          <span className="text-sm text-[var(--color-muted)]">Latest credit</span>
          <span className="font-bold">{renderStatus(summary, "latestCreditStatus")}</span>
        </div>
      </div>
    </Card>
  );
}
