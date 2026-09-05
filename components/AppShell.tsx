"use client";

import { useState } from "react";
import CustomerView from "./CustomerView";
import WaiterView from "./WaiterView";

export default function AppShell({
  menu,
  staff,
  initialOrders,
}: {
  menu: any[];
  staff: any[];
  initialOrders: any[];
}) {
  const [role, setRole] = useState<"customer" | "waiter">("customer");

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-600">Chowly</h1>

          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setRole("customer")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                role === "customer"
                  ? "bg-orange-600 text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setRole("waiter")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                role === "waiter" 
                  ? "bg-orange-600 text-white" 
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Waiter
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {role === "customer" ? (
          <CustomerView menu={menu} />
        ) : (
          <WaiterView staff={staff} initialOrders={initialOrders} />
        )}
      </div>
    </main>
  );
}
