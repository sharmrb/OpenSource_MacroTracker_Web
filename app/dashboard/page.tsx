"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Calendar, TrendingUp, RefreshCw, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/AppShell";
import { MacroRing } from "@/components/MacroRing";
import { MacroBar } from "@/components/MacroBar";
import { MealSection } from "@/components/MealSection";
import { useLogStore } from "@/store/useLogStore";
import { useAuthStore } from "@/store/useAuthStore";
import { logsApi, profileApi } from "@/lib/api";

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const { entries, goals, setDateEntries, removeEntry } = useLogStore();
  const { user, isAuthenticated } = useAuthStore();

  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  // Replace today's local entries with server data + get streak from profile
  const syncFromBackend = async () => {
    if (!isAuthenticated) return;
    setSyncing(true);
    try {
      const [log, profile] = await Promise.all([
        logsApi.getByDate(today),
        profileApi.get(),
      ]);
      setDateEntries(today, log.entries);
      setLastSynced(new Date().toLocaleTimeString());
      setStreak(profile.streak ?? 0);
    } catch {
      // Backend offline — local store is the source of truth
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    syncFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const todayEntries = entries.filter((e) => e.date === today);

  const totals = todayEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.macros.calories,
      protein: acc.protein + e.macros.protein,
      carbs: acc.carbs + e.macros.carbs,
      fat: acc.fat + e.macros.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleRemove = async (id: string) => {
    removeEntry(id);
    if (isAuthenticated) {
      try { await logsApi.delete(id); } catch { /* offline — already removed locally */ }
    }
  };

  const caloriesLeft = Math.max(0, goals.calories - totals.calories);
  const pctDone = Math.min(100, Math.round((totals.calories / goals.calories) * 100));

  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user ? `Hey, ${user.name.split(" ")[0]} 👋` : "Dashboard"}
          </h1>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{formatToday()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full text-sm font-semibold border border-orange-200 dark:border-orange-800">
              <Flame className="h-3.5 w-3.5" />
              {streak}d
            </div>
          )}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400"
              onClick={syncFromBackend}
              disabled={syncing}
              title={lastSynced ? `Last synced ${lastSynced}` : "Sync with server"}
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            </Button>
          )}
          <Button asChild size="sm" className="bg-green-500 hover:bg-green-600 text-white">
            <Link href="/log">
              <PlusCircle className="mr-1.5 h-4 w-4" />
              Log food
            </Link>
          </Button>
        </div>
      </div>

      {/* Macro summary card */}
      <Card className="mb-5 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="shrink-0">
              <MacroRing consumed={totals.calories} goal={goals.calories} />
            </div>
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
          { label: "Calories", value: Math.round(totals.calories), unit: "kcal", remaining: caloriesLeft, color: "text-green-500" },
          { label: "Protein",  value: Math.round(totals.protein),  unit: "g",    remaining: Math.max(0, goals.protein - totals.protein),  color: "text-blue-500" },
          { label: "Carbs",    value: Math.round(totals.carbs),    unit: "g",    remaining: Math.max(0, goals.carbs - totals.carbs),       color: "text-orange-400" },
          { label: "Fat",      value: Math.round(totals.fat),      unit: "g",    remaining: Math.max(0, goals.fat - totals.fat),           color: "text-yellow-500" },
        ].map((s) => (
          <Card key={s.label} className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>
                {s.value}
                <span className="text-sm font-normal text-gray-400 ml-0.5">{s.unit}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {s.remaining}{s.unit} left
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      {todayEntries.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300 font-medium">Daily progress</span>
            <span className="text-gray-500 dark:text-gray-400">{pctDone}% of {goals.calories} kcal goal</span>
          </div>
          <div className="h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                pctDone > 100 ? "bg-red-500" : pctDone > 85 ? "bg-amber-400" : "bg-green-500"
              }`}
              style={{ width: `${Math.min(100, pctDone)}%` }}
            />
          </div>
        </div>
      )}

      {/* Today's meals */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Today&apos;s Meals
        </h2>
        <Button variant="ghost" size="sm" asChild className="text-gray-500">
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
            onRemove={handleRemove}
          />
        ))}
      </div>

      {/* Empty state CTA */}
      {todayEntries.length === 0 && (
        <div className="mt-4 text-center py-8 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Nothing logged yet today</p>
          <Button asChild size="sm" className="mt-3 bg-green-500 hover:bg-green-600 text-white">
            <Link href="/log">Log your first meal</Link>
          </Button>
        </div>
      )}
    </AppShell>
  );
}
