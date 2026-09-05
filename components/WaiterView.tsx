"use client";

import { useEffect, useState } from "react";
import { getPendingOrders, assignOrder, markOrderServed, getCompletedOrders } from "@/lib/actions";
import { motion } from "framer-motion";
import { Clock, ChefHat, CheckCircle2, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type Staff = { id: string; name: string; role: "chef" | "bartender" };

export default function WaiterView({ restaurant, staff, initialOrders }: { restaurant: any, staff: Staff[], initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders.filter((o) => o.status === "pending"));
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [selections, setSelections] = useState<Record<string, { chef: string; bartender: string }>>({});

  const chefs = staff.filter((s) => s.role === "chef");
  const bartenders = staff.filter((s) => s.role === "bartender");

  const refresh = async () => {
    setOrders(await getPendingOrders(restaurant.id));
    setCompletedOrders(await getCompletedOrders(restaurant.id));
  };

  useEffect(() => {
    refresh(); // Instantly fetch fresh orders on mount
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [restaurant.id]);

  const handleAssign = async (orderId: string) => {
    const sel = selections[orderId];
    if (!sel) return;
    try {
      await assignOrder(orderId, sel.chef, sel.bartender);
      toast.success("Staff assigned to order");
      await refresh();
    } catch (e) {
      toast.error("Failed to assign staff");
    }
  };

  const handleServed = async (orderId: string) => {
    try {
      await markOrderServed(orderId);
      toast.success("Order marked as served");
      await refresh();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 lg:py-12 space-y-12 px-4">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-foreground tracking-tight">Active Orders</h2>
            <p className="text-muted-foreground mt-1">Manage kitchen queue for {restaurant.name}</p>
          </div>
          <div className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-xl flex items-center gap-2">
            <ChefHat size={20} />
            {orders.length} Pending
          </div>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border text-card-foreground">
            <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground">All caught up!</h3>
            <p className="text-muted-foreground mt-2">No pending orders right now. Take a breather.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order, i) => {
              const sel = selections[order.id] || { chef: order.assignedChef || "", bartender: order.assignedBartender || "" };
              const elapsedMinutes = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
              const isDelayed = elapsedMinutes > order.waitingTime;
              const hasFood = order.items.some((it: any) => it.itemType === "Food");
              const hasDrink = order.items.some((it: any) => it.itemType === "Drink");

              return (
                <motion.div key={order.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Card className={`overflow-hidden border-2 transition-colors bg-card text-card-foreground ${isDelayed ? "border-destructive/30 shadow-destructive/10" : "border-transparent hover:border-border"}`}>
                    <div className={`p-4 flex justify-between items-center ${isDelayed ? "bg-destructive text-destructive-foreground" : "bg-foreground text-background"}`}>
                      <div className="font-mono text-sm font-medium">#{order.id.slice(-6)}</div>
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Clock size={16} />
                        {elapsedMinutes} / {order.waitingTime}m
                      </div>
                    </div>
                    <div className="p-5 space-y-6">
                      <div className="space-y-2">
                        {order.items.map((it: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-start text-sm">
                            <span className="font-medium text-foreground">
                              <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs mr-2">{it.quantity}x</span>
                              {it.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.note && (
                        <div className="bg-primary/10 border border-primary/20 text-primary-foreground p-3 rounded-lg text-sm mt-3">
                          <span className="font-bold text-primary block mb-1">Note:</span>
                          <span className="text-foreground/80 italic">"{order.note}"</span>
                        </div>
                      )}

                      <div className="space-y-3 pt-4 border-t border-border">
                        <select
                          value={sel.chef}
                          disabled={!hasFood}
                          onChange={(e) => setSelections((p) => ({ ...p, [order.id]: { ...sel, chef: e.target.value } }))}
                          className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none text-foreground disabled:opacity-50 disabled:bg-muted"
                        >
                          <option value="">{hasFood ? "Assign Chef..." : "No Food in Order"}</option>
                          {hasFood && chefs.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                        <select
                          value={sel.bartender}
                          disabled={!hasDrink}
                          onChange={(e) => setSelections((p) => ({ ...p, [order.id]: { ...sel, bartender: e.target.value } }))}
                          className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none text-foreground disabled:opacity-50 disabled:bg-muted"
                        >
                          <option value="">{hasDrink ? "Assign Bartender..." : "No Drinks in Order"}</option>
                          {hasDrink && bartenders.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
                        </select>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button onClick={() => handleAssign(order.id)} className="flex-1 bg-muted text-foreground hover:bg-muted/80 transition rounded-lg py-2.5 text-sm font-semibold">
                          Update
                        </button>
                        <button onClick={() => handleServed(order.id)} className="flex-1 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 transition text-white rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
                          <CheckCircle2 size={16} /> Served
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-6 pt-8 border-t border-border">
        <div className="flex items-center gap-2 opacity-80">
          <CheckSquare size={24} className="text-primary" />
          <h2 className="text-2xl font-black text-foreground tracking-tight">Completed Orders</h2>
        </div>
        
        {completedOrders.length === 0 ? (
          <p className="text-muted-foreground italic">No completed orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 opacity-80">
            {completedOrders.map((order) => (
              <Card key={order.id} className="p-4 bg-muted border-border">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-mono text-sm font-medium">#{order.id.slice(-6)}</div>
                  <div className="text-xs font-semibold px-2 py-1 bg-green-500/20 text-green-600 rounded-md">SERVED</div>
                </div>
                <div className="space-y-1">
                  {order.items.map((it: any, idx: number) => (
                    <div key={idx} className="text-sm text-muted-foreground truncate">
                      {it.quantity}x {it.name}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
