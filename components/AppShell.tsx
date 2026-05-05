"use client";
import React from "react";
import { NavBar } from "@/components/NavBar";
import { SideBar } from "@/components/SideBar";
import { BottomNav } from "@/components/BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <SideBar />
      <main className="md:ml-56 pb-20 md:pb-0">
        <div className="mx-auto max-w-4xl px-4 py-6">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
