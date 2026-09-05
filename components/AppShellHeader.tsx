"use client";

import Link from "next/link";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function AppShellHeader({ 
  showRoleToggle, 
  role, 
  setRole,
  restaurantName
}: { 
  showRoleToggle?: boolean;
  role?: "customer" | "waiter";
  setRole?: (role: "customer" | "waiter") => void;
  restaurantName?: string;
}) {
  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {restaurantName && (
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="bg-orange-600 text-white p-1.5 rounded-lg shadow-sm group-hover:bg-orange-700"
            >
              <UtensilsCrossed size={20} />
            </motion.div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-1">
              [GB<span className="text-orange-600">-chow</span>]
            </h1>
          </Link>
          {restaurantName && (
            <div className="hidden md:flex items-center gap-2 ml-4 px-4 py-1.5 bg-gray-50 border rounded-full">
              <span className="text-sm font-medium text-gray-600 truncate max-w-[200px]">{restaurantName}</span>
            </div>
          )}
        </div>

        {showRoleToggle && setRole && (
          <div className="flex items-center gap-1 bg-gray-100/80 rounded-full p-1 border shadow-inner">
            <button
              onClick={() => setRole("customer")}
              className={`relative px-5 py-1.5 rounded-full text-sm font-semibold transition-colors z-10 ${
                role === "customer"
                  ? "text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {role === "customer" && (
                <motion.div
                  layoutId="role-pill"
                  className="absolute inset-0 bg-orange-600 rounded-full -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              Customer
            </button>
            <button
              onClick={() => setRole("waiter")}
              className={`relative px-5 py-1.5 rounded-full text-sm font-semibold transition-colors z-10 ${
                role === "waiter" 
                  ? "text-white" 
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {role === "waiter" && (
                <motion.div
                  layoutId="role-pill"
                  className="absolute inset-0 bg-orange-600 rounded-full -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              Waiter
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
