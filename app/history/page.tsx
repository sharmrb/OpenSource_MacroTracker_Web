"use client";
import React, { useState } from "react";
import { TrendingUp, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/AppShell";
import { DailyChart } from "@/components/DailyChart";
import { mockWeekly, mockProfile } from "@/lib/mock-data";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeekLabel(offset: number): string {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() + offset * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  if (offset === 0) return "This week";
  if (offset === -1) return "Last week";
  return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default function HistoryPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const goals = mockProfile.goals;
  const weekData = mockWeekly.week;

  const weekAvg = {
    calories: Math.round(weekData.reduce((s, d) => s + d.calories, 0) / weekData.length),
    protein: Math.round(weekData.reduce((s, d) => s + d.protein, 0) / weekData.length),
    carbs: Math.round(weekData.reduce((s, d) => s + d.carbs, 0) / weekData.length),
    fat: Math.round(weekData.reduce((s, d) => s + d.fat, 0) / weekData.length),
  };

  const daysHitGoal = weekData.filter(
    (d) => d.calories >= goals.calories * 0.9 && d.calories <= goals.calories * 1.1
  ).length;

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary-500" />
          History
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Review your past nutrition logs and trends.
        </p>
      </div>

      {/* Week navigator */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekOffset((w) => w - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <Calendar className="h-4 w-4 text-primary-500" />
          {getWeekLabel(weekOffset)}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={weekOffset >= 0}
          onClick={() => setWeekOffset((w) => w + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekly summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Avg Calories", value: weekAvg.calories, unit: "kcal", goal: goals.calories, color: "text-primary-500" },
          { label: "Avg Protein", value: weekAvg.protein, unit: "g", goal: goals.protein, color: "text-blue-500" },
          { label: "Avg Carbs", value: weekAvg.carbs, unit: "g", goal: goals.carbs, color: "text-orange-400" },
          { label: "Avg Fat", value: weekAvg.fat, unit: "g", goal: goals.fat, color: "text-yellow-500" },
        ].map((s) => (
          <Card key={s.label} className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className={`text-xl font-bold mt-1 ${s.color}`}>
                {s.value}
                <span className="text-sm font-normal text-gray-400 ml-0.5">{s.unit}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Goal: {s.goal}{s.unit}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Goal hit banner */}
      <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50 dark:bg-primary-900/10 dark:border-primary-800 p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
          <TrendingUp className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100">
            {daysHitGoal} / {weekData.length} days within calorie goal
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Within ±10% of your {goals.calories} kcal daily target
          </p>
        </div>
      </div>

      {/* Charts */}
      <Tabs defaultValue="calories">
        <TabsList className="mb-4">
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="macros">Macros</TabsTrigger>
        </TabsList>

        <TabsContent value="calories">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Calorie Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <DailyChart data={weekData} goalCalories={goals.calories} mode="calories" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="macros">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Macro Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <DailyChart data={weekData} goalCalories={goals.calories} mode="macros" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Day-by-day breakdown */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Daily Breakdown
        </h2>
        <div className="space-y-2">
          {weekData.map((day) => {
            const d = new Date(day.date + "T00:00:00");
            const dayLabel = d.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            const isToday = day.date === new Date().toISOString().split("T")[0];
            const pct = Math.min(100, Math.round((day.calories / goals.calories) * 100));

            return (
              <div
                key={day.date}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {dayLabel}
                    </span>
                    {isToday && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {day.calories} kcal
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 w-8 text-right">{pct}%</span>
                </div>
                <div className="mt-2 flex gap-4 text-xs text-gray-500">
                  <span className="text-blue-500">P: {day.protein}g</span>
                  <span className="text-orange-400">C: {day.carbs}g</span>
                  <span className="text-yellow-500">F: {day.fat}g</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
