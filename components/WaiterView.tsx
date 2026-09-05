"use client";

import { useEffect, useState } from "react";
import { getPendingOrders, assignOrder, markOrderServed } from "@/lib/actions";

type Staff = { id: string; name: string; role: "chef" | "bartender" };

export default function WaiterView({
  staff,
  initialOrders,
}: {
  staff: Staff[];
  initialOrders: any[];
}) {
  const [orders, setOrders] = useState(
    initialOrders.filter((o) => o.status === "pending")
  );
  const [selections, setSelections] = useState<
    Record<string, { chef: string; bartender: string }>
  >({});

  const chefs = staff.filter((s) => s.role === "chef");
  const bartenders = staff.filter((s) => s.role === "bartender");

  const refresh = async () => setOrders(await getPendingOrders());

  useEffect(() => {
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async (orderId: string) => {
    const sel = selections[orderId];
    if (!sel) return;
    await assignOrder(orderId, sel.chef, sel.bartender);
    await refresh();
  };

  const handleServed = async (orderId: string) => {
    await markOrderServed(orderId);
    await refresh();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-black">Pending Orders</h2>
      {orders.length === 0 && (
        <p className="text-gray-400 text-sm">No pending orders right now.</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => {
          const sel = selections[order.id] || {
            chef: order.assignedChef || "",
            bartender: order.assignedBartender || "",
          };

          const elapsedMinutes = Math.floor(
            (Date.now() - new Date(order.createdAt).getTime()) / 60000
          );
          const isDelayed = elapsedMinutes > order.waitingTime;

          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4 text-black">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-2">
                    Order #{order.id.slice(-6)}
                  </p>
                  <div className="text-sm font-medium space-y-1">
                    {order.items.map((it: any, i: number) => (
                      <div key={i}>
                        {it.quantity} × {it.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Est. wait: <span className="font-medium">{order.waitingTime}m</span></p>
                  {isDelayed && (
                    <p className="text-xs text-red-600 font-bold mt-1 bg-red-50 px-2 py-1 rounded">DELAYED</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={sel.chef}
                  onChange={(e) =>
                    setSelections((prev) => ({
                      ...prev,
                      [order.id]: { ...sel, chef: e.target.value },
                    }))
                  }
                  className="border rounded-lg p-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Assign chef…</option>
                  {chefs.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  value={sel.bartender}
                  onChange={(e) =>
                    setSelections((prev) => ({
                      ...prev,
                      [order.id]: { ...sel, bartender: e.target.value },
                    }))
                  }
                  className="border rounded-lg p-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Assign bartender…</option>
                  {bartenders.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAssign(order.id)}
                  className="flex-1 bg-gray-800 hover:bg-black transition text-white rounded-lg py-2.5 text-sm font-medium"
                >
                  Save Assignment
                </button>
                <button
                  onClick={() => handleServed(order.id)}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 transition text-white rounded-lg py-2.5 text-sm font-medium"
                >
                  Mark as Served
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
