"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Database,
  UserCircle,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/log", icon: PlusCircle, label: "Log Food" },
  { href: "/history", icon: History, label: "History" },
  { href: "/foods", icon: Database, label: "Foods" },
  { href: "/profile", icon: UserCircle, label: "Profile" },
];

export function SideBar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-56 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 z-30">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  active ? "text-primary-600 dark:text-primary-400" : "text-gray-400"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-400 text-center">MacroFree v0.1.0</p>
        <p className="text-xs text-gray-400 text-center">Open Source</p>
      </div>
    </aside>
  );
}
