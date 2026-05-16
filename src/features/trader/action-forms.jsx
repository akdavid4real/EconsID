"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, Input, Select } from "@/components/ui/primitives";
import { postJson } from "@/lib/client-api";
import { demoData } from "@/lib/demo-data";

function ResponseNote({ error, message }) {
  if (error) {
    return <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p>;
  }

  if (message) {
    return <p className="text-sm font-medium text-[var(--color-primary)]">{message}</p>;
  }

  return null;
}

export function CreditApplyForm() {
  const router = useRouter();
  const [amount, setAmount] = useState(String(demoData.trader.availableCredit));
  const [purpose, setPurpose] = useState("stock");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await postJson("/api/credit/apply", {
        amount: Number(amount),
        purpose,
      });
      setMessage(`Application saved in ${response.meta?.mode ?? "demo"} mode.`);
      router.push("/dashboard/credit");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Field label="Amount">
        <Input value={amount} inputMode="numeric" onChange={(event) => setAmount(event.target.value)} />
      </Field>
      <Field label="Purpose">
        <Select value={purpose} onChange={(event) => setPurpose(event.target.value)}>
          <option value="stock">Stock top-up</option>
          <option value="restock">Restock trade goods</option>
          <option value="rent">Rent or stall cost</option>
        </Select>
      </Field>
      <ResponseNote error={error} message={message} />
      <Button tone="gold" className="justify-center" icon={false}>
        {loading ? "Submitting..." : "Apply now"}
      </Button>
    </form>
  );
}

export function CreditRepayForm() {
  const router = useRouter();
  const [amount, setAmount] = useState("39000");
  const [note, setNote] = useState("Weekly installment");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await postJson("/api/credit/repay", {
        amount: Number(amount),
        note,
      });
      if (response.data?.checkoutUrl && !response.data.checkoutUrl.startsWith("/")) {
        window.location.assign(response.data.checkoutUrl);
        return;
      }
      setMessage(`Repayment saved in ${response.meta?.mode ?? "demo"} mode.`);
      router.push("/dashboard/credit");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Field label="Amount">
        <Input value={amount} inputMode="numeric" onChange={(event) => setAmount(event.target.value)} />
      </Field>
      <Field label="Note">
        <Input value={note} onChange={(event) => setNote(event.target.value)} />
      </Field>
      <ResponseNote error={error} message={message} />
      <Button tone="gold" className="justify-center" icon={false}>
        {loading ? "Submitting..." : "Confirm repayment"}
      </Button>
    </form>
  );
}

export function InsuranceSubscribeForm() {
  const router = useRouter();
  const [tier, setTier] = useState("2");
  const [premium, setPremium] = useState("300");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await postJson("/api/insurance/initiate", {
        tier: Number(tier),
        premium: Number(premium),
      });
      if (response.data?.checkoutUrl && !response.data.checkoutUrl.startsWith("/")) {
        window.location.assign(response.data.checkoutUrl);
        return;
      }
      setMessage(`Cover started in ${response.meta?.mode ?? "demo"} mode.`);
      router.push("/dashboard/insurance");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Field label="Tier">
        <Select value={tier} onChange={(event) => setTier(event.target.value)}>
          <option value="1">Tier 1</option>
          <option value="2">Tier 2</option>
          <option value="3">Tier 3</option>
        </Select>
      </Field>
      <Field label="Daily premium">
        <Input value={premium} inputMode="numeric" onChange={(event) => setPremium(event.target.value)} />
      </Field>
      <ResponseNote error={error} message={message} />
      <Button tone="gold" className="justify-center" icon={false}>
        {loading ? "Starting..." : "Start cover"}
      </Button>
    </form>
  );
}

export function InsuranceClaimForm() {
  const router = useRouter();
  const [claimType, setClaimType] = useState("stock-loss");
  const [description, setDescription] = useState("");
  const [claimAmount, setClaimAmount] = useState("10000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await postJson("/api/insurance/claim", {
        claimType,
        description,
        claimAmount: Number(claimAmount),
      });
      const nextId = response.data?.claimId ?? "demo-claim";
      setMessage(`Claim reviewed in ${response.meta?.mode ?? "demo"} mode.`);
      router.push(`/dashboard/insurance/claims/${nextId}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Field label="What happened?">
        <Select value={claimType} onChange={(event) => setClaimType(event.target.value)}>
          <option value="stock-loss">Stock loss</option>
          <option value="stall-damage">Stall damage</option>
          <option value="income-interruption">Income interruption</option>
        </Select>
      </Field>
      <Field label="Tell us in your words">
        <textarea
          className="min-h-36 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(63,125,82,0.14)]"
          placeholder="Example: Rain entered my stall and damaged two fabric bundles."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </Field>
      <Field label="Claim amount">
        <Input value={claimAmount} inputMode="numeric" onChange={(event) => setClaimAmount(event.target.value)} />
      </Field>
      <ResponseNote error={error} message={message} />
      <Button tone="gold" className="justify-center" icon={false}>
        {loading ? "Submitting..." : "Submit claim"}
      </Button>
    </form>
  );
}
