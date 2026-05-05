"use client";
import React from "react";
import Link from "next/link";
import { PlusCircle, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/components/AppShell";
import { MacroRing } from "@/components/MacroRing";
import { MacroBar } from "@/components/MacroBar";
import { MealSection } from "@/components/MealSection";
import { useLogStore } from "@/store/useLogStore";
import { useAuthStore } from "@/store/useAuthStore";

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const { entries, goals, removeEntry } = useLogStore();
  const { user } = useAuthStore();

  const totals = {
    calories: entries.reduce((s, e) => s + e.macros.calories, 0),
    protein: entries.reduce((s, e) => s + e.macros.protein, 0),
    carbs: entries.reduce((s, e) => s + e.macros.carbs, 0),
    fat: entries.reduce((s, e) => s + e.macros.fat, 0),
  };

  const today = new Date().toISOString().split("T")[0];
  const todayEntries = entries.filter((e) => e.date === today);

  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user ? `Hey, ${user.name.split(" ")[0]}!` : "Dashboard"}
          </h1>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{formatToday()}</span>
          </div>
        </div>
        <Button asChild size="sm">
          <Link href="/log">
            <PlusCircle className="mr-1.5 h-4 w-4" />
            Log food
          </Link>
        </Button>
      </div>

      {/* Macro summary card */}
      <Card className="mb-6 overflow-hidden border-0 shadow-md bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Ring */}
            <div className="shrink-0">
              <MacroRing consumed={totals.calories} goal={goals.calories} />
            </div>

            {/* Bars */}
            <div className="flex-1 w-full space-y-5">
              <MacroBar
                label="Protein"
                consumed={totals.protein}
                goal={goals.protein}
                color="protein"
                className="[&_.text-gray-700]:text-gray-200 [&_.text-gray-500]:text-gray-400 [&_.text-gray-400]:text-gray-500"
              />
              <MacroBar
                label="Carbohydrates"
                consumed={totals.carbs}
                goal={goals.carbs}
                color="carbs"
                className="[&_.text-gray-700]:text-gray-200 [&_.text-gray-500]:text-gray-400 [&_.text-gray-400]:text-gray-500"
              />
              <MacroBar
                label="Fat"
                consumed={totals.fat}
                goal={goals.fat}
                color="fat"
                className="[&_.text-gray-700]:text-gray-200 [&_.text-gray-500]:text-gray-400 [&_.text-gray-400]:text-gray-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Calories",
            value: Math.round(totals.calories),
            unit: "kcal",
            remaining: Math.max(0, goals.calories - totals.calories),
            color: "text-primary-500",
          },
          {
            label: "Protein",
            value: Math.round(totals.protein),
            unit: "g",
            remaining: Math.max(0, goals.protein - totals.protein),
            color: "text-blue-500",
          },
          {
            label: "Carbs",
            value: Math.round(totals.carbs),
            unit: "g",
            remaining: Math.max(0, goals.carbs - totals.carbs),
            color: "text-orange-400",
          },
          {
            label: "Fat",
            value: Math.round(totals.fat),
            unit: "g",
            remaining: Math.max(0, goals.fat - totals.fat),
            color: "text-yellow-500",
          },
        ].map((s) => (
          <Card key={s.label} className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>
                {s.value}
                <span className="text-sm font-normal text-gray-500 ml-0.5">{s.unit}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">{s.remaining}{s.unit} left</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's meals */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Today&apos;s Meals
        </h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/history">
            <TrendingUp className="mr-1.5 h-4 w-4" />
            History
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {(["breakfast", "lunch", "dinner", "snack"] as const).map((meal) => (
          <MealSection
            key={meal}
            meal={meal}
            entries={todayEntries}
            onRemove={removeEntry}
          />
        ))}
      </div>
    </AppShell>
  );
}
