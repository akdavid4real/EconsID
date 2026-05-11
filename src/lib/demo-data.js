export const demoData = {
  trader: {
    id: "trd-mama-titi",
    name: "Mama Titi",
    market: "Balogun Market",
    category: "Fabric Seller",
    location: "Lagos",
    score: 680,
    trustBand: "Tier 2",
    weeklyRevenue: 200000,
    inflow90d: 2400000,
    availableCredit: 150000,
    virtualAccount: "7834927713",
    bankName: "Wema Bank",
    story:
      "Mama Titi has operated a fabric stall in Balogun Market for 15 years. Her digital payment activity shows consistent inflows across the last 90 days, with healthy contribution habits and stable turnover during peak trading periods.",
    identityBreakdown: [
      ["Income consistency", "Strong"],
      ["90-day volume", "NGN 2.4M"],
      ["Trading tenure", "15 years"],
      ["Growth trend", "+12%"],
      ["Risk flags", "0 active"],
    ],
    inflows: [
      { name: "Oluwaseun Adeyemi", method: "Squad Transfer", amount: 45000, when: "Today, 2:15 PM" },
      { name: "POS settlement", method: "Card Payment", amount: 12500, when: "Today, 11:30 AM" },
      { name: "Ngozi Chukwu", method: "Squad Transfer", amount: 85000, when: "Yesterday" },
    ],
    coverage: {
      status: "Active",
      amount: 150000,
      daysCovered: 18,
      activePlan: "Stall + Stock",
    },
    plans: [
      { name: "Stock Protection", tier: "Tier 1", price: 200, status: "available" },
      { name: "Stall + Stock", tier: "Tier 2", price: 300, status: "recommended" },
      { name: "Income Protection", tier: "Tier 3", price: 500, status: "locked" },
    ],
    loans: [
      { name: "Tier 1", amount: 50000, status: "Completed & paid", locked: false },
      { name: "Tier 2", amount: 150000, status: "Available to apply", locked: false },
      { name: "Tier 3", amount: 500000, status: "Keep building history", locked: true },
    ],
    repayments: [
      { week: "W1", label: "Week 1 Installment", amount: 39000, state: "Pending" },
      { week: "W2", label: "Week 2 Installment", amount: 39000, state: "Pending" },
      { week: "W3", label: "Week 3 Installment", amount: 39000, state: "Pending" },
      { week: "W4", label: "Final Installment", amount: 39000, state: "Pending" },
    ],
  },
  lenderSummary: {
    totals: [
      { label: "Total Traders", value: "1,240", hint: "+12% this month", tone: "neutral" },
      { label: "Active Loans", value: "NGN 48.5M", hint: "Across 450 active facilities", tone: "positive" },
      { label: "Repayment Rate", value: "91%", hint: "Target: 95%", tone: "neutral" },
      { label: "Risk Alerts", value: "14", hint: "Requires immediate review", tone: "danger" },
    ],
    traders: [
      { id: "TRD-8942", name: "Mama Titi", score: 680, status: "Good standing" },
      { id: "TRD-1104", name: "Musa Phones", score: 720, status: "Performing" },
      { id: "TRD-5521", name: "Chika Foods", score: 590, status: "At risk" },
    ],
    alerts: [
      { trader: "Chika Foods", severity: "High", reason: "7-day inflow gap on active facility" },
      { trader: "Musa Phones", severity: "Medium", reason: "Collections slower than cohort trend" },
    ],
  },
  onboardingSteps: [
    { slug: "start", title: "Phone Number", caption: "Use OTP to start a trader profile." },
    { slug: "verify", title: "Verify OTP", caption: "Confirm the phone number to continue." },
    { slug: "profile", title: "Business Details", caption: "Capture legal name, market name, and trade category." },
    { slug: "account", title: "Bank Details", caption: "Attach the payout account and create the Squad virtual account." },
  ],
};
