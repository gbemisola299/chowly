export const dynamic = "force-dynamic";

import { getMenu, getStaff, getAllOrders, getRestaurantById } from "@/lib/actions";
import AppShell from "@/components/AppShell";
import { notFound } from "next/navigation";

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const [restaurant, menu, staff, orders] = await Promise.all([
    getRestaurantById(id),
    getMenu(id),
    getStaff(id),
    getAllOrders(id),
  ]);

  if (!restaurant) return notFound();

  return (
    <AppShell 
      restaurant={restaurant}
      menu={menu} 
      staff={staff} 
      initialOrders={orders} 
    />
  );
}
