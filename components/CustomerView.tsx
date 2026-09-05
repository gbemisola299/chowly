"use client";

import { useEffect, useState } from "react";
import {
  placeOrder,
  getOrder,
  submitComplaint,
  processPayment,
} from "@/lib/actions";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  preparationTime: number;
};

export default function CustomerView({ menu }: { menu: MenuItem[] }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [complaintText, setComplaintText] = useState("");
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);

  // Restore an in-progress order after a page refresh
  useEffect(() => {
    const saved = localStorage.getItem("chowly_order_id");
    if (saved) setOrderId(saved);
  }, []);

  // Poll the order's live status every few seconds
  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => setOrder(await getOrder(orderId));
    fetchOrder();
    const interval = setInterval(fetchOrder, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const updated = Math.max(0, (next[id] || 0) + delta);
      if (updated === 0) delete next[id];
      else next[id] = updated;
      return next;
    });
  };

  const cartLines = menu
    .filter((m) => cart[m.id] > 0)
    .map((m) => ({ ...m, quantity: cart[m.id] }));

  const total = cartLines.reduce((s, l) => s + l.price * l.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cartLines.length === 0) return;
    setBusy(true);
    const items = cartLines.map((l) => ({
      menuId: l.id,
      name: l.name,
      price: l.price,
      quantity: l.quantity,
      preparationTime: l.preparationTime,
    }));
    try {
      const newOrder = await placeOrder(items);
      localStorage.setItem("chowly_order_id", newOrder.id);
      setOrderId(newOrder.id);
      setOrder(newOrder);
      setCart({});
    } catch (e) {
      console.error(e);
    }
    setBusy(false);
  };

  const handleComplaint = async () => {
    if (!orderId || rating === 0) return;
    setBusy(true);
    try {
      await submitComplaint(orderId, complaintText, rating);
      setOrder(await getOrder(orderId));
    } catch (e) {
      console.error(e);
    }
    setBusy(false);
  };

  const handlePayment = async () => {
    if (!orderId) return;
    setBusy(true);
    try {
      await processPayment(orderId);
      setOrder(await getOrder(orderId));
    } catch (e) {
      console.error(e);
    }
    setBusy(false);
  };

  const startNewOrder = () => {
    localStorage.removeItem("chowly_order_id");
    setOrderId(null);
    setOrder(null);
    setComplaintText("");
    setRating(0);
  };

  // ---------- Active order screen ----------
  if (orderId && order) {
    const elapsedMinutes = Math.floor(
      (Date.now() - new Date(order.createdAt).getTime()) / 60000
    );
    const isDelayed = elapsedMinutes > order.waitingTime;

    return (
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-6 space-y-5 border border-gray-100 text-black">
        <h2 className="text-xl font-semibold">Your Order</h2>

        <div className="space-y-1 text-sm text-gray-600">
          {order.items.map((it: any, idx: number) => (
            <div key={idx} className="flex justify-between">
              <span>
                {it.quantity} × {it.name}
              </span>
              <span>₦{(it.price * it.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 flex justify-between font-medium text-black">
          <span>Status</span>
          <span className="capitalize">{order.status}</span>
        </div>
        
        <div className="flex justify-between text-sm text-black">
          <span>Estimated waiting time</span>
          <span>{order.waitingTime} min</span>
        </div>

        {order.assignedChef && (
          <div className="text-sm text-gray-600">Chef: {order.assignedChef}</div>
        )}
        {order.assignedBartender && (
          <div className="text-sm text-gray-600">
            Bartender: {order.assignedBartender}
          </div>
        )}

        {isDelayed && order.status !== "paid" && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3">
            This order is running past its estimated time. Feel free to leave
            a complaint and rating below.
          </div>
        )}

        {!order.complaint && order.status !== "pending" && (
          <div className="space-y-2 border-t pt-4">
            <p className="text-sm font-medium">Rate this order</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className={`text-2xl ${
                    n <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="Optional: describe the issue"
              className="w-full border rounded-lg p-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
            <button
              onClick={handleComplaint}
              disabled={rating === 0 || busy}
              className="w-full bg-gray-800 text-white rounded-lg py-2 text-sm disabled:opacity-50"
            >
              Submit rating &amp; complaint
            </button>
          </div>
        )}

        {order.complaint !== null && order.rating !== null && (
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-black">
            You rated this order {order.rating}/5.
          </div>
        )}

        <div className="border-t pt-4 flex justify-between font-semibold text-black">
          <span>Total</span>
          <span>₦{order.items.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0).toLocaleString()}</span>
        </div>

        {!order.isPaid ? (
          <button
            onClick={handlePayment}
            disabled={busy}
            className="w-full bg-orange-600 text-white rounded-lg py-3 font-medium disabled:opacity-50 hover:bg-orange-700 transition"
          >
            Pay Now (PRETEND PAYMENT — no real charge)
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-green-50 text-green-700 rounded-lg p-3 text-sm text-center border border-green-100">
              Payment received (simulated). Thank you!
            </div>
            <button
              onClick={startNewOrder}
              className="w-full border rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition"
            >
              Start a new order
            </button>
          </div>
        )}
      </div>
    );
  }

  // ---------- Menu / cart screen ----------
  return (
    <div className="grid md:grid-cols-3 gap-6 items-start">
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold mb-4 text-black">Menu</h2>
        {menu.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-black">{item.name}</p>
              <p className="text-sm text-gray-500">
                ₦{item.price.toLocaleString()} · ~{item.preparationTime} min
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQty(item.id, -1)}
                className="w-8 h-8 rounded-full border text-black hover:bg-gray-50 transition flex items-center justify-center"
              >
                −
              </button>
              <span className="w-4 text-center font-medium text-black">{cart[item.id] || 0}</span>
              <button
                onClick={() => updateQty(item.id, 1)}
                className="w-8 h-8 rounded-full border text-black hover:bg-gray-50 transition flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-fit sticky top-24 space-y-4 text-black">
        <h3 className="font-semibold text-lg">Your Cart</h3>
        {cartLines.length === 0 && (
          <p className="text-sm text-gray-400">No items yet</p>
        )}
        
        {cartLines.map((l) => (
          <div key={l.id} className="flex justify-between text-sm text-gray-700">
            <span>
              {l.quantity} × {l.name}
            </span>
            <span>₦{(l.price * l.quantity).toLocaleString()}</span>
          </div>
        ))}
        
        {cartLines.length > 0 && (
          <>
            <div className="border-t pt-3 flex justify-between font-medium">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={busy}
              className="w-full bg-orange-600 hover:bg-orange-700 transition text-white rounded-lg py-2.5 mt-2 font-medium disabled:opacity-50"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}
