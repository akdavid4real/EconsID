import { TraderDetailScreen } from "@/features/lender/screens";

export default async function TraderDetailPage({ params }) {
  const { id } = await params;

  return <TraderDetailScreen id={id} />;
}
