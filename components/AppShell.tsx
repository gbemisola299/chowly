"use client";

import { useState } from "react";
import CustomerView from "./CustomerView";
import WaiterView from "./WaiterView";
import { AppShellHeader } from "./AppShellHeader";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AppShell({
  restaurant,
  menu,
  staff,
  initialOrders,
}: {
  restaurant: any;
  menu: any[];
  staff: any[];
  initialOrders: any[];
}) {
  const [role, setRole] = useState<"customer" | "waiter">("customer");
  const [isSwitching, setIsSwitching] = useState(false);

  const handleRoleChange = (newRole: "customer" | "waiter") => {
    if (newRole === role) return;
    setIsSwitching(true);
    setTimeout(() => {
      setRole(newRole);
      setIsSwitching(false);
      toast.success(`Switched to ${newRole} view`);
    }, 600); // Simulate network/auth loading
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppShellHeader 
        showRoleToggle={true} 
        role={role} 
        setRole={handleRoleChange} 
        restaurantName={restaurant.name}
      />

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {isSwitching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm z-10"
            >
              <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl shadow-xl border">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                <p className="font-medium text-gray-600">Switching roles...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {role === "customer" ? (
                <CustomerView restaurant={restaurant} menu={menu} />
              ) : (
                <WaiterView restaurant={restaurant} staff={staff} initialOrders={initialOrders} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
