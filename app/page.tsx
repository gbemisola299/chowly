import { getMenu, getStaff, getAllOrders } from "@/lib/actions";
import AppShell from "@/components/AppShell";

export default async function Home() {
  const [menu, staff, orders] = await Promise.all([
    getMenu(),
    getStaff(),
    getAllOrders(),
  ]);

  return <AppShell menu={menu} staff={staff} initialOrders={orders} />;
}
