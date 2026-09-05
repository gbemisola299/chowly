export const dynamic = "force-dynamic";

import { getRestaurants } from "@/lib/actions";
import MarketplaceView from "@/components/MarketplaceView";
import { AppShellHeader } from "@/components/AppShellHeader";

export default async function Home() {
  const restaurants = await getRestaurants();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppShellHeader showRoleToggle={false} />
      <MarketplaceView restaurants={restaurants} />
    </div>
  );
}
