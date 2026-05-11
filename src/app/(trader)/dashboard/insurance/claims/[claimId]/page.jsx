import { InsuranceClaimDetailScreen } from "@/features/trader/screens";

export default async function InsuranceClaimDetailPage({ params }) {
  const { claimId } = await params;

  return <InsuranceClaimDetailScreen claimId={claimId} />;
}
