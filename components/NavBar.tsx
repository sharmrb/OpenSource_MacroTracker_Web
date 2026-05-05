"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

export function NavBar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/95">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">
            Macro<span className="text-primary-500">Free</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-semibold">
                    {user?.name?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex text-gray-600"
                  onClick={logout}
                >
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Get started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
