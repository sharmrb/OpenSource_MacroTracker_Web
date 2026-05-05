"use client";
import React from "react";
import Link from "next/link";
import { Leaf, GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";

export function NavBar() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/95">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">
            Macro<span className="text-green-500">Free</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* GitHub link — always visible */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <GitFork className="h-3.5 w-3.5" />
            Open source
          </a>

          {isAuthenticated ? (
            <>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-green-100 text-green-700 text-xs font-semibold">
                  {user?.name?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-gray-500 hover:text-gray-900 text-xs"
                onClick={logout}
              >
                Sign out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-sm">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-sm" asChild>
                <Link href="/auth/register">Get started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
