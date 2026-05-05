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
  GitFork,
  Heart,
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
      {/* Main nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              )}
            >
              <item.icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  active ? "text-green-600 dark:text-green-400" : "text-gray-400"
                )}
                size={18}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Open source section */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2">
          Open Source
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <GitFork className="h-4 w-4 text-gray-400" />
          GitHub
        </a>
        <Link
          href="/foods"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Heart className="h-4 w-4 text-gray-400" />
          Contribute food
        </Link>
      </div>

      {/* Footer branding */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-green-500">
            <Leaf className="h-3 w-3 text-white" />
          </div>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Macro<span className="text-green-500">Free</span>
          </span>
        </div>
        <p className="text-[10px] text-gray-400">v0.1.0 · MIT License · Free forever</p>
      </div>
    </aside>
  );
}
