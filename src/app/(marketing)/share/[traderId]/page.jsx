import { ShareProfileScreen } from "@/features/marketing/screens";

export default async function ShareProfilePage({ params }) {
  const { traderId } = await params;

  return <ShareProfileScreen traderId={traderId} />;
}
