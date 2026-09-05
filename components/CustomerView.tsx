"use client";

import { useEffect, useState } from "react";
import { placeOrder, getOrder, submitComplaint, processPayment } from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Minus, Receipt, Clock, Star, UtensilsCrossed } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function CustomerView({ restaurant, menu }: { restaurant: any, menu: any[] }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [complaintText, setComplaintText] = useState("");
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`chowly_order_${restaurant.id}`);
    if (saved) setOrderId(saved);
  }, [restaurant.id]);

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

  const cartLines = menu.filter((m) => cart[m.id] > 0).map((m) => ({ ...m, quantity: cart[m.id] }));
  const total = cartLines.reduce((s, l) => s + l.price * l.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cartLines.length === 0) return;
    setBusy(true);
    const items = cartLines.map((l) => ({ menuId: l.id, name: l.name, price: l.price, quantity: l.quantity, preparationTime: l.preparationTime }));
    try {
      const newOrder = await placeOrder(restaurant.id, items);
      localStorage.setItem(`chowly_order_${restaurant.id}`, newOrder.id);
      setOrderId(newOrder.id);
      setOrder(newOrder);
      setCart({});
      toast.success("Order placed successfully!");
    } catch (e) {
      toast.error("Failed to place order");
    }
    setBusy(false);
  };

  const handleComplaint = async () => {
    if (!orderId || rating === 0) return;
    setBusy(true);
    try {
      await submitComplaint(orderId, complaintText, rating);
      setOrder(await getOrder(orderId));
      toast.success("Feedback submitted. Thank you!");
    } catch (e) {
      toast.error("Failed to submit feedback");
    }
    setBusy(false);
  };

  const handlePayment = async () => {
    if (!orderId) return;
    setBusy(true);
    try {
      await processPayment(orderId);
      setOrder(await getOrder(orderId));
      toast.success("Payment processed!");
    } catch (e) {
      toast.error("Payment failed");
    }
    setBusy(false);
  };

  const startNewOrder = () => {
    localStorage.removeItem(`chowly_order_${restaurant.id}`);
    setOrderId(null);
    setOrder(null);
    setComplaintText("");
    setRating(0);
  };

  if (orderId && order) {
    const elapsedMinutes = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
    const isDelayed = elapsedMinutes > order.waitingTime;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto py-10">
        <Card className="bg-white shadow-2xl border-0 overflow-hidden">
          <div className="bg-orange-600 p-6 text-white text-center flex flex-col items-center gap-2">
            <UtensilsCrossed size={32} className="opacity-90" />
            <h2 className="text-2xl font-bold tracking-tight">[GB-chow]</h2>
            <p className="text-orange-100 text-sm">Receipt for {restaurant.name}</p>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="text-center pb-4 border-b border-dashed border-gray-300">
              <p className="text-sm font-mono text-gray-500 uppercase">Order #{order.id.slice(-6)}</p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold capitalize text-gray-800">
                {order.status === "pending" && <Loader2 className="w-4 h-4 animate-spin text-orange-500" />}
                {order.status}
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-700"><span className="font-medium mr-2">{it.quantity}x</span>{it.name}</span>
                  <span className="font-medium">₦{(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₦{order.items.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0).toLocaleString()}</span>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Estimated Wait</p>
                <p className="font-bold text-orange-700">{order.waitingTime} minutes</p>
              </div>
            </div>

            {isDelayed && order.status !== "paid" && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl p-4">
                <p className="font-semibold mb-1">Running late?</p>
                We apologize for the delay! Please let us know how we did below.
              </motion.div>
            )}

            {!order.complaint && order.status !== "pending" && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <p className="text-center font-medium text-gray-700">Rate your experience</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setRating(n)} className="focus:outline-none transform hover:scale-110 transition-transform">
                      <Star className={`w-8 h-8 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-300"}`} />
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {rating > 0 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-3 overflow-hidden">
                      <textarea value={complaintText} onChange={(e) => setComplaintText(e.target.value)} placeholder="Leave a review..." className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none bg-gray-50" rows={2} />
                      <button onClick={handleComplaint} disabled={busy} className="w-full bg-black text-white rounded-xl py-3 font-semibold hover:bg-gray-800 transition">
                        {busy ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Submit Review"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {!order.isPaid ? (
              <button onClick={handlePayment} disabled={busy} className="w-full bg-green-600 text-white rounded-xl py-4 font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 hover:shadow-green-600/40 transition-all flex items-center justify-center gap-2">
                {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Receipt size={20}/> Complete Payment</>}
              </button>
            ) : (
              <div className="pt-6 border-t border-dashed border-gray-300">
                <div className="text-center text-green-600 font-bold mb-4 bg-green-50 py-2 rounded-lg">PAID</div>
                <button onClick={startNewOrder} className="w-full border-2 border-gray-200 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-50 transition">
                  Start New Order
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-12 flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full space-y-6">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Our Menu</h2>
          <p className="text-gray-500 mt-2 text-lg">Select your favorites and we'll take care of the rest.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menu.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden flex border-gray-100 hover:border-orange-200 transition-colors shadow-sm hover:shadow-md h-full">
                {item.imageUrl && (
                  <div className="w-1/3 min-w-[120px] bg-gray-100">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      ~{item.preparationTime} mins
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-orange-600">₦{item.price.toLocaleString()}</span>
                    <div className="flex items-center bg-gray-50 rounded-full border p-0.5">
                      <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50">
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">{cart[item.id] || 0}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-orange-600 text-white shadow-sm flex items-center justify-center hover:bg-orange-700 transition">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-96 sticky top-24">
        <Card className="shadow-xl border-0 overflow-hidden bg-white">
          <div className="bg-gray-900 text-white p-5">
            <h3 className="font-bold flex items-center justify-between text-lg">
              Your Order <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{cartLines.reduce((s,l)=>s+l.quantity,0)} items</span>
            </h3>
          </div>
          <CardContent className="p-0">
            <div className="max-h-[50vh] overflow-y-auto p-5 space-y-4">
              {cartLines.length === 0 ? (
                <div className="text-center py-8 opacity-50">
                  <UtensilsCrossed size={48} className="mx-auto mb-3" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cartLines.map((l) => (
                  <motion.div layout key={l.id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                      <div className="bg-orange-100 text-orange-700 font-bold w-6 h-6 rounded flex items-center justify-center text-xs shrink-0">{l.quantity}x</div>
                      <span className="font-medium text-sm truncate">{l.name}</span>
                    </div>
                    <span className="font-semibold shrink-0 ml-4">₦{(l.price * l.quantity).toLocaleString()}</span>
                  </motion.div>
                ))
              )}
            </div>
            {cartLines.length > 0 && (
              <div className="p-5 bg-gray-50 border-t">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <button onClick={handlePlaceOrder} disabled={busy} className="w-full bg-orange-600 text-white rounded-xl py-3.5 font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/40 transition-all flex items-center justify-center gap-2">
                  {busy && <Loader2 className="w-5 h-5 animate-spin" />}
                  Place Order
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
