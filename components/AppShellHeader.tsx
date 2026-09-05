"use client";

import Link from "next/link";
import { UtensilsCrossed, ArrowLeft, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

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
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-background border-b sticky top-0 z-50 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {restaurantName && (
            <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors mr-2">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm"
            >
              <UtensilsCrossed size={20} />
            </motion.div>
            <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-1">
              GB<span className="text-primary">-chow</span>
            </h1>
          </Link>
          {restaurantName && (
            <div className="hidden md:flex items-center gap-2 ml-4 px-4 py-1.5 bg-muted border border-border rounded-full">
              <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{restaurantName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {showRoleToggle && setRole && (
            <div className="flex items-center gap-1 bg-muted/80 rounded-full p-1 border shadow-inner">
              <button
                onClick={() => setRole("customer")}
                className={`relative px-5 py-1.5 rounded-full text-sm font-semibold transition-colors z-10 ${
                  role === "customer"
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {role === "customer" && (
                  <motion.div
                    layoutId="role-pill"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                Customer
              </button>
              <button
                onClick={() => setRole("waiter")}
                className={`relative px-5 py-1.5 rounded-full text-sm font-semibold transition-colors z-10 ${
                  role === "waiter" 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {role === "waiter" && (
                  <motion.div
                    layoutId="role-pill"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                Waiter
              </button>
            </div>
          )}

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-muted text-foreground transition-colors"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>
        </div>
      </div>
    </header>
  );
}
