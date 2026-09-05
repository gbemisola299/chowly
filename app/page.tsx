import { getRestaurants } from "@/lib/actions";
import MarketplaceView from "@/components/MarketplaceView";
import { AppShellHeader } from "@/components/AppShellHeader";

export default async function Home() {
  const restaurants = await getRestaurants();

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <AppShellHeader showRoleToggle={false} />
      <MarketplaceView restaurants={restaurants} />
    </div>
  );
}
