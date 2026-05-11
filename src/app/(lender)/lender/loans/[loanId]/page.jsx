import { LoanDetailScreen } from "@/features/lender/screens";

export default async function LoanDetailPage({ params }) {
  const { loanId } = await params;

  return <LoanDetailScreen loanId={loanId} />;
}
